import assert from "node:assert/strict";
import test from "node:test";
import {
  loadUsageSnapshot,
  resolveThreadHostId,
  type UsageSdk,
} from "../lib/load-usage.ts";
import {
  clampPercent,
  formatCost,
  formatFetchedAt,
  formatResetTime,
  formatUsedPercent,
  normalizeUsage,
  providerStatusLabel,
  type RawUsageResponse,
} from "../lib/usage.ts";
import {
  mergeLastKnownWindows,
  sidebarUsagePrimarySummary,
  sidebarUsageSummary,
  sidebarUsageWindows,
} from "../lib/sidebar-usage.ts";
import { enabledSidebarProviderIds } from "../lib/preferences.ts";

function healthyResponse(): RawUsageResponse {
  return {
    codex: {
      status: "ok",
      accountEmail: "mateo@example.com",
      planLabel: "Pro",
      windows: [
        {
          label: "Weekly limit",
          usedPercent: 17.25,
          resetsAt: "2026-08-17T00:44:00.000Z",
        },
        {
          label: "Five-hour limit",
          usedPercent: 120,
          resetsAt: null,
          cost: { usedUsdCents: 125, limitUsdCents: 500 },
        },
      ],
    },
    "claude-code": { status: "expired" },
    "acp-cursor": { status: "unauthenticated" },
  };
}

function makeSdk(overrides: Partial<UsageSdk> = {}): UsageSdk {
  return {
    threads: {
      async get() {
        return { environmentId: "env_1" };
      },
    },
    environments: {
      async get() {
        return { hostId: "host_1" };
      },
    },
    hosts: {
      async get() {
        return { name: "Mateo's MacBook" };
      },
    },
    system: {
      async usageLimits() {
        return healthyResponse();
      },
    },
    ...overrides,
  };
}

test("enables sidebar providers independently in display order", () => {
  assert.deepEqual(
    enabledSidebarProviderIds({ enableClaudeCode: true, enableCodex: true }),
    ["claudeCode", "codex"],
  );
  assert.deepEqual(
    enabledSidebarProviderIds({ enableClaudeCode: true, enableCodex: false }),
    ["claudeCode"],
  );
  assert.deepEqual(
    enabledSidebarProviderIds({ enableClaudeCode: false, enableCodex: true }),
    ["codex"],
  );
  assert.deepEqual(
    enabledSidebarProviderIds({ enableClaudeCode: false, enableCodex: false }),
    [],
  );
});

test("normalizes providers in stable order with every usage window", () => {
  const snapshot = normalizeUsage(
    healthyResponse(),
    { id: "host_1", name: "Mateo's MacBook" },
    new Date("2026-08-11T17:00:00.000Z"),
  );

  assert.equal(snapshot.fetchedAt, "2026-08-11T17:00:00.000Z");
  assert.deepEqual(
    snapshot.providers.map((provider) => provider.id),
    ["codex", "claudeCode", "cursor"],
  );
  assert.equal(snapshot.providers[0]?.windows.length, 2);
  assert.equal(snapshot.providers[0]?.windows[0]?.barPercent, 17.25);
  assert.equal(snapshot.providers[0]?.windows[1]?.usedPercent, 120);
  assert.equal(snapshot.providers[0]?.windows[1]?.barPercent, 100);
  assert.deepEqual(snapshot.providers[0]?.windows[1]?.cost, {
    usedUsdCents: 125,
    limitUsdCents: 500,
  });
  assert.equal(snapshot.providers[1]?.status, "expired");
  assert.match(snapshot.providers[1]?.message ?? "", /`claude`/);
  assert.equal(snapshot.providers[2]?.status, "unauthenticated");
  assert.match(snapshot.providers[2]?.message ?? "", /cursor-agent login/);
});

test("ignores usage entries outside the tracked provider roster", () => {
  const snapshot = normalizeUsage(
    {
      ...healthyResponse(),
      anotherProvider: { status: "not_installed" },
    },
    { id: null, name: null },
  );

  assert.deepEqual(
    snapshot.providers.map((provider) => provider.id),
    ["codex", "claudeCode", "cursor"],
  );
});

test("normalizes not-installed and provider-error states", () => {
  const response: RawUsageResponse = {
    codex: { status: "not_installed" },
    "claude-code": {
      status: "error",
      message: "Provider timed out",
      planLabel: "Max",
      accountEmail: "account@example.com",
    },
    "acp-cursor": { status: "expired" },
  };

  const snapshot = normalizeUsage(response, { id: null, name: null });
  assert.equal(snapshot.providers[0]?.message, "Codex is not installed on this machine.");
  assert.deepEqual(snapshot.providers[1], {
    id: "claudeCode",
    name: "Claude Code",
    status: "error",
    accountEmail: "account@example.com",
    planLabel: "Max",
    message: "Provider timed out",
    windows: [],
  });
  assert.equal(providerStatusLabel("not_installed"), "Not installed");
  assert.equal(providerStatusLabel("error"), "Unavailable");
});

test("accepts legacy provider aliases", () => {
  const snapshot = normalizeUsage(
    {
      codex: { status: "not_installed" },
      claudeCode: { status: "unauthenticated" },
      cursor: { status: "expired" },
    },
    { id: null, name: null },
  );

  assert.equal(snapshot.providers[0]?.status, "not_installed");
  assert.equal(snapshot.providers[1]?.status, "unauthenticated");
  assert.equal(snapshot.providers[2]?.status, "expired");
});

test("prefers current wire keys over legacy aliases", () => {
  const snapshot = normalizeUsage(
    {
      "claude-code": { status: "expired" },
      claudeCode: { status: "not_installed" },
      "acp-cursor": { status: "unauthenticated" },
      cursor: { status: "not_installed" },
    },
    { id: null, name: null },
  );

  assert.equal(snapshot.providers[1]?.status, "expired");
  assert.equal(snapshot.providers[2]?.status, "unauthenticated");
});

test("reports omitted providers as unavailable without throwing", () => {
  const snapshot = normalizeUsage(
    { codex: { status: "not_installed" } },
    { id: null, name: null },
  );

  assert.equal(snapshot.providers[0]?.status, "not_installed");
  assert.deepEqual(snapshot.providers[1], {
    id: "claudeCode",
    name: "Claude Code",
    status: "error",
    accountEmail: null,
    planLabel: null,
    message: "Claude Code usage was not reported by bb.",
    windows: [],
  });
  assert.equal(snapshot.providers[2]?.status, "error");
  assert.equal(providerStatusLabel(snapshot.providers[2]!.status), "Unavailable");
});

test("clamps progress geometry and rejects non-finite values", () => {
  assert.equal(clampPercent(-3), 0);
  assert.equal(clampPercent(45.5), 45.5);
  assert.equal(clampPercent(140), 100);
  assert.throws(() => clampPercent(Number.NaN), /finite/);

  const response = healthyResponse();
  const codex = response.codex;
  if (codex?.status !== "ok") assert.fail("codex fixture must be healthy");
  codex.windows[0]!.usedPercent = Number.POSITIVE_INFINITY;
  assert.throws(
    () => normalizeUsage(response, { id: null, name: null }),
    /finite/,
  );
});

test("formats reset, update, percentage, and cost copy safely", () => {
  assert.equal(formatResetTime(null), "Reset unavailable");
  assert.equal(formatResetTime("not-a-date"), "Reset unavailable");
  assert.match(
    formatResetTime("2026-08-17T00:44:00.000Z", "en-US"),
    /^Resets /,
  );
  assert.equal(formatFetchedAt("bad"), "Updated recently");
  assert.match(formatFetchedAt("2026-08-11T17:00:00.000Z", "en-US"), /^Updated /);
  assert.equal(formatUsedPercent(Number.NaN), "—");
  assert.equal(formatUsedPercent(17.25, "en-US"), "17.3");
  assert.equal(
    formatCost({ usedUsdCents: 125, limitUsdCents: 500 }, "en-US"),
    "$1.25 of $5.00",
  );
});

test("projects five-hour and weekly windows into the compact sidebar copy", () => {
  const provider = normalizeUsage(
    healthyResponse(),
    { id: null, name: null },
  ).providers[0]!;
  const windows = sidebarUsageWindows(provider);

  assert.equal(windows.fiveHour?.label, "Five-hour limit");
  assert.equal(windows.weekly?.label, "Weekly limit");
  assert.equal(sidebarUsageSummary(provider), "120% 5h · 17.3% wk");
  assert.equal(sidebarUsagePrimarySummary(provider), "120%");
});

test("keeps last-known sidebar windows through partial and failed refreshes", () => {
  const previous = normalizeUsage(
    healthyResponse(),
    { id: null, name: null },
  ).providers[0]!;
  const partial = {
    ...previous,
    windows: previous.windows.filter((window) => window.label === "Weekly limit"),
  };
  const failed = { ...partial, status: "error" as const, message: "Rate limited" };

  assert.equal(
    sidebarUsageSummary(mergeLastKnownWindows(partial, previous)),
    "120% 5h · 17.3% wk",
  );
  assert.equal(
    sidebarUsageSummary(mergeLastKnownWindows(failed, previous)),
    "120% 5h · 17.3% wk",
  );
});

test("resolves the thread environment host", async () => {
  const sdk = makeSdk();
  assert.equal(await resolveThreadHostId(sdk, "thr_1"), "host_1");
});

test("falls back when a thread has no environment or lookup fails", async () => {
  const noEnvironment = makeSdk({
    threads: {
      async get() {
        return { environmentId: null };
      },
    },
  });
  assert.equal(await resolveThreadHostId(noEnvironment, "thr_1"), null);

  const missingEnvironment = makeSdk({
    environments: {
      async get() {
        throw new Error("environment missing");
      },
    },
  });
  assert.equal(await resolveThreadHostId(missingEnvironment, "thr_1"), null);
});

test("loads usage for the resolved host and tolerates missing host metadata", async () => {
  const calls: Array<{ hostId?: string } | undefined> = [];
  const sdk = makeSdk({
    hosts: {
      async get() {
        throw new Error("host metadata unavailable");
      },
    },
    system: {
      async usageLimits(args) {
        calls.push(args);
        return healthyResponse();
      },
    },
  });

  const snapshot = await loadUsageSnapshot(
    sdk,
    "thr_1",
    new Date("2026-08-11T17:00:00.000Z"),
  );
  assert.deepEqual(calls, [{ hostId: "host_1" }]);
  assert.deepEqual(snapshot.host, { id: "host_1", name: null });
});

test("omits host override for primary-machine fallback", async () => {
  const calls: Array<{ hostId?: string } | undefined> = [];
  const sdk = makeSdk({
    threads: {
      async get() {
        return { environmentId: null };
      },
    },
    system: {
      async usageLimits(args) {
        calls.push(args);
        return healthyResponse();
      },
    },
  });

  const snapshot = await loadUsageSnapshot(sdk, "thr_1");
  assert.deepEqual(calls, [undefined]);
  assert.deepEqual(snapshot.host, { id: null, name: null });
});

test("loads the primary machine directly for the sidebar strip", async () => {
  const calls: Array<{ hostId?: string } | undefined> = [];
  const sdk = makeSdk({
    threads: {
      async get() {
        throw new Error("the primary-machine surface must not resolve a thread");
      },
    },
    system: {
      async usageLimits(args) {
        calls.push(args);
        return healthyResponse();
      },
    },
  });

  const snapshot = await loadUsageSnapshot(sdk, null);
  assert.deepEqual(calls, [undefined]);
  assert.deepEqual(snapshot.host, { id: null, name: null });
});

test("propagates thread and request-level usage failures", async () => {
  const threadFailure = makeSdk({
    threads: {
      async get() {
        throw new Error("thread missing");
      },
    },
  });
  await assert.rejects(() => loadUsageSnapshot(threadFailure, "thr_1"), /thread missing/);

  const usageFailure = makeSdk({
    system: {
      async usageLimits() {
        throw new Error("usage unavailable");
      },
    },
  });
  await assert.rejects(() => loadUsageSnapshot(usageFailure, "thr_1"), /usage unavailable/);
});
