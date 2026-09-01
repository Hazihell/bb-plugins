import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot =
  ".empirical/specs/dockside-minimal-attention-states";
for (const [name, minimumWidth, minimumHeight] of [
  ["minimal-wide.png", 1_200, 700],
  ["minimal-compact.png", 350, 600],
]) {
  const bytes = await readFile(`${featureRoot}/artifacts/${name}`);
  assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG");
  assert.ok(bytes.readUInt32BE(16) >= minimumWidth, `${name} width`);
  assert.ok(bytes.readUInt32BE(20) >= minimumHeight, `${name} height`);
}

const runBb = (...args) => {
  const result = spawnSync("bb", args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};

const plugins = JSON.parse(runBb("plugin", "list", "--json"));
const dockside = plugins.plugins.find((plugin) => plugin.id === "dockside");
assert.equal(dockside?.status, "running");
assert.match(dockside?.source ?? "", /plugins\/dockside$/);

const threads = JSON.parse(runBb("thread", "list", "--json"));
const childCounts = new Map();
for (const thread of threads) {
  if (thread.parentThreadId === null) continue;
  childCounts.set(
    thread.parentThreadId,
    (childCounts.get(thread.parentThreadId) ?? 0) + 1,
  );
}
assert.ok([...childCounts.values()].some((count) => count >= 3));

const metadata = await readFile(
  "plugins/dockside/components/inbox/row-metadata.tsx",
  "utf8",
);
assert.match(metadata, /title=\{pullRequest\.title\}/);
assert.doesNotMatch(metadata, />\{pullRequest\.title\}<\/span>/);
assert.match(metadata, /export function DoneMetadata\(\)/);
assert.doesNotMatch(metadata, /summary\s*:/);
assert.match(metadata, /Agents working/);
assert.doesNotMatch(metadata, /name="Loading"/);

const threadCard = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.match(threadCard, /rootSecondaryState/);
assert.match(threadCard, /childSecondaryState/);
assert.match(threadCard, /hasDone=\{summaries\.has\(child\.id\)\}/);

const status = await readFile(
  "plugins/dockside/components/inbox/status-slot.tsx",
  "utf8",
);
assert.match(status, /semanticStateToneClass\("destructive"\)/);
assert.match(status, /semanticStateToneClass\("primary"\)/);

console.log(
  "Dockside minimal-state check passed: live plugin, three-child family, state-only metadata, attention precedence wiring, semantic status tones, and wide/compact screenshots.",
);
