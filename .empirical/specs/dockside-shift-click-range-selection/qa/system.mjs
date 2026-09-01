import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot =
  ".empirical/specs/dockside-shift-click-range-selection";
const screenshot = await readFile(
  `${featureRoot}/artifacts/shift-range-selected.png`,
);
assert.equal(screenshot.subarray(1, 4).toString("ascii"), "PNG");
assert.equal(screenshot.readUInt32BE(16), 320);
assert.equal(screenshot.readUInt32BE(20), 417);

const live = JSON.parse(
  await readFile(`${featureRoot}/artifacts/live-selection-result.json`, "utf8"),
);
assert.equal(live.observations.ordinaryClick.selectedCount, 1);
assert.equal(live.observations.shiftSelect.selectedCount, 4);
assert.equal(live.observations.shiftSelect.protectedRootsSelected, 0);
assert.equal(live.observations.shiftDeselect.selectedCount, 0);
assert.equal(live.observations.hiddenAnchorFallback.selectedCount, 1);
assert.equal(live.observations.clearThenShift.selectedCount, 1);
assert.equal(live.observations.selectAllThenShift.rangeApplied, false);
assert.equal(live.observations.deletePreview.deleted, 0);

const runBb = (...args) => {
  const result = spawnSync("bb", args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const plugins = JSON.parse(runBb("plugin", "list", "--json"));
const dockside = plugins.plugins.find((plugin) => plugin.id === "dockside");
assert.equal(dockside?.status, "running");
assert.match(dockside?.source ?? "", /plugins\/dockside$/);

const management = await readFile(
  "plugins/dockside/lib/thread-management.ts",
  "utf8",
);
assert.match(management, /export function applyRootSelection/);
assert.match(management, /targetSelected/);
assert.match(management, /visibleEligibleRootIds\.slice\(start, end \+ 1\)/);
assert.match(management, /if \(targetIndex < 0\)/);

const card = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.match(card, /data-dockside-select-root=\{thread\.id\}/);
assert.match(card, /selected: event\.currentTarget\.checked/);
assert.match(card, /"shiftKey" in event\.nativeEvent/);
assert.match(card, /Shift\+click to select a range/);
assert.match(card, /aria-describedby/);

const inbox = await readFile(
  "plugins/dockside/components/inbox/thread-inbox.tsx",
  "utf8",
);
assert.match(inbox, /renderedSelectableRootIds\(inboxRef\.current\)/);
assert.match(inbox, /input\[data-dockside-select-root\]:not\(:disabled\)/);
assert.match(inbox, /input\.getClientRects\(\)\.length > 0/);
assert.ok(
  (inbox.match(/selectionAnchorRootId\.current = null/g) ?? []).length >= 5,
);

console.log(
  "Dockside Shift-range system check passed: live plugin, ordinary anchor, inclusive select/deselect, protected gaps, hidden-anchor/Clear/All resets, deletion preview cancellation, accessibility guidance, and screenshot.",
);
