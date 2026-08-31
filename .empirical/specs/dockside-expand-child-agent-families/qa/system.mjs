import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const screenshot = await readFile(
  ".empirical/specs/dockside-expand-child-agent-families/artifacts/open-child-tree.png",
);
assert.equal(screenshot.subarray(1, 4).toString("ascii"), "PNG");
assert.ok(screenshot.readUInt32BE(16) >= 1_000);
assert.ok(screenshot.readUInt32BE(20) >= 700);

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
const visibleChildrenByParent = new Map();
for (const thread of threads) {
  if (thread.parentThreadId === null || thread.visibility !== "visible") continue;
  const children = visibleChildrenByParent.get(thread.parentThreadId) ?? [];
  children.push(thread);
  visibleChildrenByParent.set(thread.parentThreadId, children);
}
assert.ok(
  [...visibleChildrenByParent.values()].some((children) => children.length >= 3),
  "Expected one visible root with at least three BB child threads",
);

const threadCard = await readFile(
  "plugins/dockside/components/inbox/thread-card.tsx",
  "utf8",
);
assert.match(threadCard, /resolveFamilyExpanded/);
assert.doesNotMatch(threadCard, /\? "agent" : "agents"/);

const projectGroup = await readFile(
  "plugins/dockside/components/inbox/project-group.tsx",
  "utf8",
);
assert.doesNotMatch(projectGroup, /border-r-transparent/);
assert.match(projectGroup, /projectStatusLabel\(threads\)/);

console.log(
  "Dockside child-tree check passed: live plugin, three visible children, default-open resolver, compact count, quiet project header, and screenshot.",
);
