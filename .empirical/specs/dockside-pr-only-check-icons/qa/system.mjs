import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

for (const [name, width, height] of [
  ["pr-only-wide.png", 1_200, 700],
  ["pr-only-compact.png", 350, 600],
]) {
  const bytes = await readFile(
    `.empirical/specs/dockside-pr-only-check-icons/artifacts/${name}`,
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
const numberAt = metadata.indexOf("#{pullRequest.number}");
const iconAt = metadata.indexOf("name={presentation.icon}");
assert.ok(numberAt >= 0 && iconAt > numberAt, "PR number must precede icon");
assert.doesNotMatch(metadata, /DoneMetadata|>Done<|>DONE</);

const card = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.doesNotMatch(card, /useThreadSummaries|secondaryState === "done"/);
assert.match(card, /childProviderIds\.map/);
assert.match(card, /label="Settle thread"[\s\S]{0,100}icon="Archive"/);

const server = await readFile("plugins/dockside/server.ts", "utf8");
assert.doesNotMatch(server, /listThreadSummaries|threadSummaryCache/);

console.log(
  "Dockside PR-only check passed: no ordinary completion, PR number-before-icon source, provider identity retained, running plugin, and wide/compact screenshots.",
);
