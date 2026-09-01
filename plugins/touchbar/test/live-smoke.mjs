import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";

function bb(...args) {
  return execFileSync("bb", args, { encoding: "utf8" }).trim();
}

const inventory = JSON.parse(bb("plugin", "list", "--json"));
const installed = inventory.plugins.find((plugin) => plugin.id === "touchbar");
assert.equal(installed?.status, "running");
assert.equal(installed?.cliCommand?.name, "touchbar");

const snapshot = JSON.parse(bb("touchbar", "snapshot"));
assert.equal(snapshot.schemaVersion, 1);
assert.ok(snapshot.threads.length <= 24);
assert.equal(typeof snapshot.summary.active, "number");
assert.match(bb("touchbar", "card", "summary"), /^BB /u);

const rejected = spawnSync("bb", ["touchbar", "stop", "definitely-not-a-thread"], {
  encoding: "utf8",
});
assert.equal(rejected.status, 1);
assert.match(rejected.stderr, /not found/u);

console.log("Touch Bar live BB smoke passed.");
