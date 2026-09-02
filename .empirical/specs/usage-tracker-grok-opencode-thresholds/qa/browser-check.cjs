const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

const root = process.cwd();
const evidenceDirectory = path.join(
  root,
  ".empirical/specs/usage-tracker-grok-opencode-thresholds/evidence",
);

function provider(id, name, usedPercent) {
  return {
    id,
    name,
    status: "ok",
    accountEmail: null,
    planLabel: "Browser QA",
    message: null,
    windows: [
      {
        label: "Weekly limit",
        usedPercent,
        barPercent: Math.min(100, Math.max(0, usedPercent)),
        resetsAt: null,
        cost: null,
      },
    ],
    ...(id === "codex" ? { resetCredits: { availableCount: 0 } } : {}),
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const snapshot = {
    fetchedAt: "2026-09-02T19:42:00.000Z",
    host: { id: null, name: "Browser QA" },
    providers: [
      provider("codex", "Codex", 80),
      provider("claudeCode", "Claude Code", 79.9),
      {
        id: "cursor",
        name: "Cursor",
        status: "error",
        accountEmail: null,
        planLabel: null,
        message: "Cursor is outside this visible-provider check.",
        windows: [],
      },
      provider("grok", "Grok", 95),
      provider("openCode", "OpenCode", 96),
    ],
  };

  await page.route("**/api/v1/plugins/usage-tracker/rpc/getUsage", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, result: snapshot }),
    }),
  );
  await page.route(
    "**/api/v1/plugins/usage-tracker/rpc/getPreferences",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          result: {
            enabledProviderIds: ["claudeCode", "codex", "grok", "openCode"],
            compactLimit: "Weekly",
          },
        }),
      }),
  );

  await page.goto("http://127.0.0.1:38886/", {
    waitUntil: "domcontentloaded",
  });
  const rootLocator = page.locator("[data-usage-tracker-sidebar]");
  await rootLocator.waitFor({ state: "visible" });
  const summary = rootLocator.locator(".usage-tracker-sidebar__summary");
  await summary.waitFor({ state: "visible" });

  assert.equal(await rootLocator.getAttribute("data-provider-count"), "4");
  assert.equal(await summary.getAttribute("data-level"), "critical");
  assert.match((await summary.textContent()) ?? "", /96%\+3/u);
  const strip = await rootLocator.locator(".usage-tracker-sidebar__strip").evaluate(
    (node) => {
      const style = getComputedStyle(node);
      return {
        display: style.display,
        height: style.height,
      };
    },
  );
  assert.equal(strip.display, "flex");
  assert.equal(strip.height, "32px");

  await summary.click();
  const overview = page.getByRole("dialog", { name: "Agent usage overview" });
  await overview.waitFor({ state: "visible" });
  const rows = overview.locator(".usage-tracker-sidebar__overview-provider");
  assert.equal(await rows.count(), 4);
  assert.deepEqual(
    await rows.evaluateAll((nodes) =>
      nodes.map((node) => [node.dataset.provider, node.dataset.level]),
    ),
    [
      ["claudeCode", "normal"],
      ["codex", "warning"],
      ["grok", "critical"],
      ["openCode", "critical"],
    ],
  );
  const colors = await rows.evaluateAll((nodes) =>
    nodes.map((node) =>
      getComputedStyle(node.querySelector(".usage-tracker-sidebar__reading"))
        .color,
    ),
  );
  assert.notEqual(colors[0], colors[1]);
  assert.notEqual(colors[1], colors[2]);

  await page.screenshot({
    path: path.join(evidenceDirectory, "sidebar-summary-overview.png"),
    fullPage: true,
  });
  await rows.filter({ hasText: "Grok" }).click();
  const dialog = page.getByRole("dialog", { name: "Grok usage limits" });
  await dialog.waitFor({ state: "visible" });
  assert.equal(
    await dialog
      .locator('.usage-tracker-sidebar__window[data-level="critical"]')
      .count(),
    1,
  );

  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(
    await overview
      .locator('.usage-tracker-sidebar__overview-provider[data-provider="grok"]')
      .evaluate((node) => document.activeElement === node),
    true,
  );
  await page.keyboard.press("Escape");
  await overview.waitFor({ state: "hidden" });
  assert.equal(
    await summary.evaluate((node) => document.activeElement === node),
    true,
  );

  console.log(
    JSON.stringify({
      summary: "96% +3",
      providerLevels: ["normal", "warning", "critical", "critical"],
      strip,
      colors,
      navigation: "summary-overview-grok-details-overview-summary",
      screenshot: "sidebar-summary-overview.png",
    }),
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
