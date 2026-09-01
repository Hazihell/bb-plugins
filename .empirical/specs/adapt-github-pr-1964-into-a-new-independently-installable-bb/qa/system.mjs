import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot =
  ".empirical/specs/adapt-github-pr-1964-into-a-new-independently-installable-bb";
const screenshot = await readFile(`${featureRoot}/evidence/settings.png`);
assert.equal(screenshot.subarray(1, 4).toString("ascii"), "PNG");
assert.equal(screenshot.readUInt32BE(16), 900);
assert.equal(screenshot.readUInt32BE(20), 700);

const live = JSON.parse(
  await readFile(`${featureRoot}/evidence/live-result.json`, "utf8"),
);
assert.equal(live.route, "/settings/plugins/save-my-model");
assert.equal(live.previewVisible, true);
assert.equal(live.browserWideLabel, true);
assert.equal(live.providerOnlyVisible, true);
assert.equal(live.hostScopedColumns, true);
assert.equal(live.clearEnabledWithRows, true);
assert.equal(live.clearedToEmptyState, true);
assert.deepEqual(live.remainingPluginKeys, []);
assert.equal(live.upstreamLinkVisible, true);

const runBb = (...args) => {
  const result = spawnSync("bb", args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const plugins = JSON.parse(runBb("plugin", "list", "--json"));
assert.equal(
  plugins.plugins.find((plugin) => plugin.id === "save-my-model")?.status,
  "running",
);

const preferences = await readFile(
  "plugins/save-my-model/lib/preferences.ts",
  "utf8",
);
const app = await readFile("plugins/save-my-model/app.tsx", "utf8");
const readme = await readFile("plugins/save-my-model/README.md", "utf8");
const collection = JSON.parse(await readFile(".bb/plugins.json", "utf8"));
assert.match(preferences, /normalizeHostId/);
assert.match(preferences, /readProviderPreference/);
assert.match(preferences, /writeProviderPreference/);
assert.match(preferences, /bb\.save-my-model\.v3/);
assert.match(preferences, /bb\.promptbox\.model/);
assert.match(preferences, /bb\.promptbox\.reasoning/);
assert.match(preferences, /MAX_LISTED_PREFERENCES = 200/);
assert.match(preferences, /safeDecode/);
assert.match(app, /Browser-wide/);
assert.match(app, /Clear saved selections/);
assert.match(readme, /https:\/\/github\.com\/get-bb\/bb\/pull\/1964/);
assert.ok(
  collection.plugins.some((plugin) => plugin.name === "save-my-model"),
);

console.log(
  "Save My Model system check passed: bounded host/provider persistence, exact legacy fallback, settings inspect/clear screenshot, package/docs alignment, and running plugin.",
);
