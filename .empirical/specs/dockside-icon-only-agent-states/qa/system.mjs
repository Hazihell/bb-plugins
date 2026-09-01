import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

for (const [name, width, height] of [
  ["icon-wide.png", 1_200, 700],
  ["icon-compact.png", 350, 600],
]) {
  const bytes = await readFile(
    `.empirical/specs/dockside-icon-only-agent-states/artifacts/${name}`,
  );
  assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG");
  assert.ok(bytes.readUInt32BE(16) >= width);
  assert.ok(bytes.readUInt32BE(20) >= height);
}

const runBb = (...args) => {
  const result = spawnSync("bb", args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const plugins = JSON.parse(runBb("plugin", "list", "--json"));
assert.equal(
  plugins.plugins.find((plugin) => plugin.id === "dockside")?.status,
  "running",
);

const metadata = await readFile(
  "plugins/dockside/components/inbox/row-metadata.tsx",
  "utf8",
);
assert.match(metadata, /name=\{presentation\.icon\}/);
assert.match(metadata, /<span className="sr-only">Done<\/span>/);
assert.match(metadata, /<span className="sr-only">Agents working<\/span>/);
assert.doesNotMatch(metadata, />DONE</);

const card = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.match(card, /useMemo\(\(\) => \[thread\], \[thread\]\)/);
assert.doesNotMatch(card, /hasDone=\{summaries\.has\(child\.id\)\}/);
assert.doesNotMatch(card, /secondaryState === "done"[\s\S]{0,200}ChildThreadRow/);
assert.match(card, /childProviderIds\.map/);
assert.match(card, /<span className="tabular-nums">\{childThreads\.length\}<\/span>/);
assert.match(card, /status !== null \? \(/);

console.log(
  "Dockside icon-state check passed: running plugin, semantic icons, root-only completion, no child Done metadata, and wide/compact screenshots.",
);
