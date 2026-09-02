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

  await page.goto("http://127.0.0.1:38886/", { waitUntil: "networkidle" });
  const rootLocator = page.locator("[data-usage-tracker-sidebar]");
  await rootLocator.waitFor({ state: "visible" });
  const buttons = rootLocator.locator(".usage-tracker-sidebar__provider");
  await assert.doesNotReject(() => buttons.nth(3).waitFor({ state: "visible" }));

  assert.equal(await rootLocator.getAttribute("data-provider-count"), "4");
  assert.equal(await buttons.count(), 4);
  assert.deepEqual(
    await buttons.evaluateAll((nodes) =>
      nodes.map((node) => [node.dataset.provider, node.dataset.level]),
    ),
    [
      ["claudeCode", "normal"],
      ["codex", "warning"],
      ["grok", "critical"],
      ["openCode", "critical"],
    ],
  );

  const grid = await rootLocator.locator(".usage-tracker-sidebar__strip").evaluate(
    (node) => {
      const style = getComputedStyle(node);
      return {
        display: style.display,
        columns: style.gridTemplateColumns,
        rows: style.gridTemplateRows,
      };
    },
  );
  assert.equal(grid.display, "grid");
  assert.equal(grid.rows.split(" ").length, 2);
  assert.equal(grid.columns.split(" ").length, 3);

  const colors = await buttons.evaluateAll((nodes) =>
    nodes.map((node) =>
      getComputedStyle(node.querySelector(".usage-tracker-sidebar__reading"))
        .color,
    ),
  );
  assert.notEqual(colors[0], colors[1]);
  assert.notEqual(colors[1], colors[2]);

  await rootLocator
    .locator('.usage-tracker-sidebar__provider[data-provider="grok"]')
    .click();
  const dialog = page.getByRole("dialog", { name: "Grok usage limits" });
  await dialog.waitFor({ state: "visible" });
  assert.equal(
    await dialog
      .locator('.usage-tracker-sidebar__window[data-level="critical"]')
      .count(),
    1,
  );

  await page.screenshot({
    path: path.join(evidenceDirectory, "sidebar-thresholds.png"),
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(
    await rootLocator
      .locator('.usage-tracker-sidebar__provider[data-provider="grok"]')
      .evaluate((node) => document.activeElement === node),
    true,
  );

  console.log(
    JSON.stringify({
      providerLevels: ["normal", "warning", "critical", "critical"],
      grid,
      colors,
      grokDialog: "opened-and-dismissed-with-focus-restored",
      screenshot: "sidebar-thresholds.png",
    }),
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
