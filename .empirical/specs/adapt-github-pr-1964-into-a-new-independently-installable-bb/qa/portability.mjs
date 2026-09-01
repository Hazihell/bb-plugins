import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const scratchRoot = join(homedir(), ".cache", "empirical-qa");
mkdirSync(scratchRoot, { recursive: true });
const checkout = mkdtempSync(join(scratchRoot, "save-my-model-qa-"));

function run(command, args, cwd, options = {}) {
  const env = { ...process.env };
  delete env.BB_CLI;
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: options.encoding ?? "utf8",
    input: options.input,
    maxBuffer: 128 * 1024 * 1024,
    stdio: options.stdio,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

try {
  const archive = spawnSync("git", ["archive", "HEAD"], {
    cwd: root,
    maxBuffer: 128 * 1024 * 1024,
  });
  assert.equal(archive.status, 0, archive.stderr?.toString());
  run("tar", ["-x", "-C", checkout], checkout, {
    input: archive.stdout,
    encoding: null,
  });
  run("npm", ["ci"], checkout, { stdio: "inherit" });
  run(
    "npm",
    ["run", "check", "--workspace", "bb-plugin-save-my-model"],
    checkout,
    { stdio: "inherit" },
  );
  run("npm", ["run", "check"], checkout, { stdio: "inherit" });
  console.log(
    "Save My Model portability check passed: clean archive, npm ci, focused plugin check, and all-workspace check.",
  );
} finally {
  rmSync(checkout, { recursive: true, force: true });
}
