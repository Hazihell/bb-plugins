import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const scratchRoot = join(homedir(), ".cache", "empirical-qa");
mkdirSync(scratchRoot, { recursive: true });
const checkout = mkdtempSync(join(scratchRoot, "dockside-rich-qa-"));

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
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

  run(
    "bun",
    [
      "install",
      "--frozen-lockfile",
      "--cache-dir",
      join(checkout, ".bun-cache"),
    ],
    checkout,
    { stdio: "inherit" },
  );
  run(
    "bun",
    ["run", "--filter", "bb-plugin-dockside", "test"],
    checkout,
    { stdio: "inherit" },
  );
  run(
    "bun",
    ["run", "--filter", "bb-plugin-dockside", "typecheck"],
    checkout,
    { stdio: "inherit" },
  );
  run(
    "bun",
    ["run", "--filter", "bb-plugin-dockside", "build"],
    checkout,
    { stdio: "inherit" },
  );

  const packageRoot = join(checkout, "plugins", "dockside");
  const packed = run("bun", ["pm", "pack", "--dry-run"], packageRoot);
  for (const required of [
    "server.ts",
    "app.tsx",
    "lib/attention-state.ts",
    "lib/pull-request-presentation.ts",
    "components/inbox/row-metadata.tsx",
  ]) {
    assert.match(packed, new RegExp(required.replaceAll("/", "\\/")));
  }

  const portabilitySources = [
    "plugins/dockside/lib/attention-state.ts",
    "plugins/dockside/lib/pull-request-presentation.ts",
  ].map((path) => readFileSync(join(checkout, path), "utf8"));
  for (const source of portabilitySources) {
    assert.doesNotMatch(source, /process\.platform|node:child_process|node:os/);
  }

  console.log(
    "Dockside portability check passed: clean archived checkout, frozen install, focused tests/typecheck/build, complete package source closure, and platform-neutral metadata logic.",
  );
} finally {
  rmSync(checkout, { recursive: true, force: true });
}
