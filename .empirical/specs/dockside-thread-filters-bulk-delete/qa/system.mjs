import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const featureRoot =
  ".empirical/specs/dockside-thread-filters-bulk-delete";
const screenshots = [
  ["dockside-thread-management.png", 1200, 700],
  ["dockside-bulk-delete-preview.png", 1200, 700],
  ["dockside-compact-sidebar.png", 350, 600],
  ["dockside-compact-create.png", 350, 600],
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
const protectedThread =
  threads.find((thread) => thread.status === "active") ?? threads[0];
assert.ok(protectedThread?.id, "A live thread is required for the safe probe");

const response = await fetch(
  "http://127.0.0.1:38886/api/v1/plugins/dockside/rpc/previewBulkDelete",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      threadIds: [protectedThread.id],
      protectedThreadId: protectedThread.id,
    }),
  },
);
assert.equal(response.status, 200);
const envelope = await response.json();
assert.equal(envelope.ok, true);
assert.equal(envelope.result.token, null);
assert.equal(envelope.result.rootCount, 0);
assert.equal(envelope.result.skipped.length, 1);
assert.ok(
  ["current", "overlap"].includes(envelope.result.skipped[0].reason),
);

const inboxSource = await readFile(
  "plugins/dockside/components/inbox/thread-inbox.tsx",
  "utf8",
);
assert.match(inboxSource, /previewBulkDelete/);
const dialogSource = await readFile(
  "plugins/dockside/components/inbox/bulk-delete-dialog.tsx",
  "utf8",
);
assert.match(dialogSource, /Delete permanently/);
const projectSource = await readFile(
  "plugins/dockside/components/inbox/project-group.tsx",
  "utf8",
);
assert.match(projectSource, /openNewThread/);
assert.match(projectSource, /focusPrompt: true/);

console.log(
  "Dockside system check passed: live plugin, protected preview RPC, four screenshots, and native project create wiring.",
);
