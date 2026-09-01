import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot = ".empirical/specs/dockside-root-only-pr-position";
const screenshots = [
  ["compact-two-row-normal.png", 320, 417],
  ["compact-two-row-narrow.png", 250, 417],
  ["compact-two-row-pr-focus.png", 320, 417],
];

for (const [name, width, height] of screenshots) {
  const bytes = await readFile(`${featureRoot}/artifacts/${name}`);
  assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(bytes.readUInt32BE(16), width, `${name} width`);
  assert.equal(bytes.readUInt32BE(20), height, `${name} height`);
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

const threadCard = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.equal(
  threadCard.match(/useSidebarThreadPullRequest\(thread\.id\)/g)?.length,
  1,
);
const childRowStart = threadCard.indexOf("function ChildThreadRow");
assert.doesNotMatch(threadCard.slice(childRowStart), /useSidebarThreadPullRequest/);
assert.doesNotMatch(threadCard.slice(childRowStart), /PullRequestMetadata/);
assert.match(threadCard, /data-dockside-root-title-row/);
assert.match(threadCard, /data-dockside-root-detail-row/);
assert.match(threadCard, /data-dockside-root-time/);
assert.match(threadCard, /data-dockside-root-metadata/);

const metadata = await readFile(
  "plugins/dockside/components/inbox/row-metadata.tsx",
  "utf8",
);
assert.ok(metadata.indexOf("#{pullRequest.number}") < metadata.indexOf("name={presentation.icon}"));
assert.match(metadata, /group-hover\/pr:opacity-100/);
assert.match(metadata, /group-focus-visible\/pr:opacity-100/);
assert.match(metadata, /whitespace-normal break-words/);

const mapping = await readFile(
  "plugins/dockside/lib/pull-request-presentation.ts",
  "utf8",
);
for (const label of [
  "IN REVIEW",
  "READY",
  "MERGED",
  "CHECKS",
  "DRAFT",
  "BLOCKED",
  "CLOSED",
]) {
  assert.match(mapping, new RegExp(`label: "${label}"`));
}

console.log(
  "Dockside compact-card system check passed: live plugin, one parent PR lookup, no child PR metadata, two-row markers, semantic states, wrapped focus tooltip, and normal/narrow screenshots.",
);
