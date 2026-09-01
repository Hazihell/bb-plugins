import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot =
  ".empirical/specs/dockside-row-selection-status-customization";
const screenshots = [
  ["settings-customization.png", 1200, 657],
  ["sidebar-colorblind.png", 320, 417],
  ["row-shift-selected.png", 320, 417],
  ["row-hit-targets.png", 320, 445],
];
for (const [name, width, height] of screenshots) {
  const bytes = await readFile(`${featureRoot}/artifacts/${name}`);
  assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(bytes.readUInt32BE(16), width, `${name} width`);
  assert.equal(bytes.readUInt32BE(20), height, `${name} height`);
}

const live = JSON.parse(
  await readFile(`${featureRoot}/artifacts/live-customization-result.json`, "utf8"),
);
assert.equal(live.observations.rowSelection.ordinaryStatusIconClickSelected, 1);
assert.equal(live.observations.rowSelection.shiftTrailingTimeClickSelected, 3);
assert.equal(live.observations.rowSelection.protectedRowsSelected, 0);
assert.equal(live.observations.rowSelection.protectedRowClickNavigated, false);
assert.equal(live.observations.rowSelection.selectionTargetRole, "button");
assert.equal(live.observations.repairedHitTesting.protectedSelectionTargetDisabled, true);
assert.equal(live.observations.settingsRegistration.previewVisible, true);
assert.equal(live.observations.colorblindPreset.liveWithoutReload, true);
assert.equal(live.observations.customValidation.effectiveWorkingFallback, "#22C55E");
assert.equal(live.observations.behaviorSettings.compactRootHeight, 42);
assert.equal(live.observations.reset.preset, "Default");

const runBb = (...args) => {
  const result = spawnSync("bb", args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const plugins = JSON.parse(runBb("plugin", "list", "--json"));
assert.equal(plugins.plugins.find((plugin) => plugin.id === "dockside")?.status, "running");
const config = JSON.parse(runBb("plugin", "config", "dockside", "--json"));
assert.equal(Object.keys(config.schema).length, 18);
assert.equal(config.values.palettePreset, "Default");
assert.equal(config.values.rowDensity, "Comfortable");
assert.equal(config.values.showProviderIcons, true);

const app = await readFile("plugins/dockside/app.tsx", "utf8");
const server = await readFile("plugins/dockside/server.ts", "utf8");
const preferences = await readFile("plugins/dockside/lib/preferences.ts", "utf8");
const inbox = await readFile(
  "plugins/dockside/components/inbox/thread-inbox.tsx",
  "utf8",
);
const card = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.match(app, /app\.slots\.settingsSection\(/);
assert.match(server, /bb\.settings\.define\(/);
assert.match(preferences, /const HEX_COLOR = \/\^#\[0-9A-F\]\{6\}\$\/i/);
assert.match(preferences, /Colorblind-friendly/);
assert.match(preferences, /docksidePreferenceStyle/);
assert.match(inbox, /const settings = useSettings\(\)/);
assert.match(inbox, /data-dockside-palette=/);
assert.match(card, /data-dockside-selection-target=\{thread\.id\}/);
assert.match(card, /aria-pressed=/);
assert.match(card, /disabled=\{selectionDisabledReason !== null\}/);
assert.match(card, /selected: !selected/);
assert.match(card, /interactive=\{!selectionMode\}/);
assert.match(card, /disabled=\{selectionMode\}/);
assert.match(card, /preferences\.showProviderIcons/);
assert.match(card, /preferences\.showPullRequestMetadata/);
assert.match(card, /preferences\.showRelativeTime/);

console.log(
  "Dockside customization system check passed: row-wide protected Shift selection, 18 live settings, preset/custom validation/reset, behavior toggles, settings preview, screenshots, and running plugin.",
);
