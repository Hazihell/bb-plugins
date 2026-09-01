import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot =
  ".empirical/specs/dockside-rich-pr-agent-metadata";
const screenshots = [
  ["dockside-rich-metadata-wide.png", 1_200, 700],
  ["dockside-rich-metadata-compact.png", 350, 600],
  ["dockside-waiting-agents.png", 1_200, 700],
];

for (const [name, minimumWidth, minimumHeight] of screenshots) {
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
const childrenByParent = new Map();
for (const thread of threads) {
  if (thread.parentThreadId === null || thread.status !== "idle") continue;
  const children = childrenByParent.get(thread.parentThreadId) ?? [];
  children.push(thread);
  childrenByParent.set(thread.parentThreadId, children);
}
const completedChildren = [...childrenByParent.values()].find(
  (children) => children.length >= 3,
);
assert.ok(completedChildren, "Expected one completed three-child BB family");

const requests = completedChildren.slice(0, 3).map((thread) => ({
  threadId: thread.id,
  updatedAt: thread.updatedAt,
}));
const response = await fetch(
  "http://127.0.0.1:38886/api/v1/plugins/dockside/rpc/listThreadSummaries",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ threads: requests }),
  },
);
assert.equal(response.status, 200);
const envelope = await response.json();
assert.equal(envelope.ok, true);
assert.equal(envelope.result.summaries.length, 3);
for (const summary of envelope.result.summaries) {
  assert.equal(typeof summary.text, "string");
  assert.ok(summary.text.length > 0 && summary.text.length <= 120);
  assert.equal(
    Array.from(summary.text).some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint <= 31 || (codePoint >= 127 && codePoint <= 159);
    }),
    false,
  );
}

const threadCard = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.match(threadCard, /PullRequestMetadata/);
assert.match(threadCard, /WaitingForAgentsMetadata/);
assert.match(threadCard, /useSidebarThreadPullRequest\(thread\.id\)/);
assert.match(threadCard, /border-primary\/60/);

const metadata = await readFile(
  "plugins/dockside/components/inbox/row-metadata.tsx",
  "utf8",
);
assert.match(metadata, /UrlLink/);
assert.match(metadata, /DONE/);
assert.match(metadata, /pullRequest\.title/);

console.log(
  "Dockside rich-metadata check passed: live plugin, bounded real outputs, root/child PR wiring, family activity treatment, and wide/compact screenshots.",
);
