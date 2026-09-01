import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const PRE_MERGE = "57fe6fd649f15d9ff2aa19f0ec0431d2623c0e84";
const MAIN = "a63ff36722fac30a1845eb1abf988fa7e8d49b02";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

run("git", ["merge-base", "--is-ancestor", MAIN, "HEAD"]);
assert.equal(run("git", ["ls-files", "-u"]), "", "unmerged index entries");

const merge = run("git", [
  "rev-list",
  "--merges",
  "--ancestry-path",
  `${MAIN}..HEAD`,
]).split("\n").filter(Boolean)[0];
assert.ok(merge, "normal merge commit is present");
const mergeParents = run("git", ["show", "-s", "--format=%P", merge]).split(" ");
assert.ok(mergeParents.includes(MAIN), "merge contains current main parent");

run("git", ["diff", "--quiet", PRE_MERGE, "HEAD", "--", "plugins/dockside"]);
for (const plugin of [
  "host-monitor",
  "save-my-model",
  "taskboard",
  "usage-tracker",
]) {
  run("git", [
    "diff",
    "--quiet",
    MAIN,
    "HEAD",
    "--",
    `plugins/${plugin}`,
  ]);
}

const trackedPlugins = run("git", ["ls-files", "plugins/*/package.json"])
  .split("\n")
  .filter(Boolean)
  .map((path) => path.split("/")[1])
  .sort();
assert.deepEqual(trackedPlugins, [
  "dockside",
  "host-monitor",
  "save-my-model",
  "taskboard",
  "usage-tracker",
]);
assert.equal(run("git", ["ls-files", "plugins/t3sidebar"]), "");
assert.equal(run("git", ["ls-files", "bun.lock"]), "");
assert.equal(run("git", ["ls-files", "package-lock.json"]), "package-lock.json");
for (const retired of [
  "GEMINI.md",
  ".gemini/settings.json",
  ".windsurf/skills/empirical/SKILL.md",
]) {
  assert.equal(run("git", ["ls-files", retired]), "", `${retired} was restored`);
}

const collection = JSON.parse(await readFile(".bb/plugins.json", "utf8"));
assert.deepEqual(
  collection.plugins.map((plugin) => plugin.name).sort(),
  trackedPlugins,
);
const rootPackage = JSON.parse(await readFile("package.json", "utf8"));
assert.deepEqual(rootPackage.workspaces, ["plugins/*"]);
assert.match(rootPackage.scripts.check, /check:dockside/);
assert.equal(rootPackage.scripts.ci, "npm run check");
const docksideCheck = await readFile(".github/check-dockside.mjs", "utf8");
assert.match(docksideCheck, /bb-plugin-dockside/);
const policy = JSON.parse(await readFile(".empirical/policy.json", "utf8"));
const promotion = policy.verification.commands.find(
  (command) => command.id === "repo-full-ci",
);
assert.deepEqual(promotion?.argv, ["bun", "run", "ci"]);
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
assert.ok(lock.packages["plugins/dockside"]);

const conflicts = spawnSync(
  "git",
  ["grep", "-n", "^<<<<<<<\\|^=======\\|^>>>>>>>"],
  { encoding: "utf8" },
);
assert.equal(conflicts.status, 1, conflicts.stdout || conflicts.stderr);

console.log(
  "Dockside reconciliation system check passed: normal main merge, exact plugin authority trees, five-plugin npm inventory, aligned collection/lock, and no stale t3sidebar or conflict markers.",
);
