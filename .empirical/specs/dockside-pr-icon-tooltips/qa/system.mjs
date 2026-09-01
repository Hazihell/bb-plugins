import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const runBb = (...args) => {
  const result = spawnSync("bb", args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const plugins = JSON.parse(runBb("plugin", "list", "--json"));
assert.equal(plugins.plugins.find((p) => p.id === "dockside")?.status, "running");

const metadata = await readFile("plugins/dockside/components/inbox/row-metadata.tsx", "utf8");
assert.ok(metadata.indexOf("#{pullRequest.number}") < metadata.indexOf("name={presentation.icon}"));
assert.match(metadata, /role="tooltip"/);
assert.match(metadata, /group-hover\/pr:opacity-100/);
assert.match(metadata, /group-focus-visible\/pr:opacity-100/);
assert.match(metadata, /presentation\.label/);
assert.match(metadata, /pullRequest\.title/);

const mapping = await readFile("plugins/dockside/lib/pull-request-presentation.ts", "utf8");
assert.match(mapping, /label: "IN REVIEW", icon: "Eye"/);
assert.match(mapping, /label: "READY", icon: "Check"/);

console.log("Dockside PR tooltip check passed: running plugin, number-before-icon, Eye review state, and hover/focus state-number-title tooltip.");
