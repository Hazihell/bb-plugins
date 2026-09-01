import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const scratchRoot = join(homedir(), ".cache", "empirical-qa");
mkdirSync(scratchRoot, { recursive: true });
const checkout = mkdtempSync(join(scratchRoot, "dockside-main-qa-"));

function run(command, args, cwd, options = {}) {
  const env = { ...process.env, ...options.env };
  if (options.clearBbCli) delete env.BB_CLI;
  const result = spawnSync(command, args, {
    cwd,
    encoding: options.encoding ?? "utf8",
    input: options.input,
    maxBuffer: 128 * 1024 * 1024,
    stdio: options.stdio,
    env,
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

  run("npm", ["ci"], checkout, { stdio: "inherit", clearBbCli: true });
  const typePaths = [
    "plugins/dockside/types/bb-plugin-sdk.d.ts",
    "plugins/dockside/types/bb-plugin-sdk-app.d.ts",
  ];
  const typesBefore = typePaths.map((path) => readFileSync(join(checkout, path)));
  run(
    "npm",
    ["test", "--workspace", "bb-plugin-dockside"],
    checkout,
    { stdio: "inherit", clearBbCli: true },
  );
  run(
    "npm",
    ["run", "typecheck", "--workspace", "bb-plugin-dockside"],
    checkout,
    { stdio: "inherit", clearBbCli: true },
  );
  run(
    "npm",
    ["run", "build", "--workspace", "bb-plugin-dockside"],
    checkout,
    { stdio: "inherit", clearBbCli: true },
  );
  run("npm", ["run", "check"], checkout, {
    stdio: "inherit",
    clearBbCli: true,
  });

  typePaths.forEach((path, index) => {
    assert.deepEqual(
      readFileSync(join(checkout, path)),
      typesBefore[index],
      `${path} changed after checks`,
    );
  });
  console.log(
    "Dockside reconciliation portability check passed: archived clean checkout, npm ci, focused Dockside test/type/build, all-workspace check, and clean tracked output.",
  );
} finally {
  rmSync(checkout, { recursive: true, force: true });
}
