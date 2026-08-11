#!/usr/bin/env bun
/**
 * Keep the vendored @bb/plugin-sdk type declarations in every workspace plugin
 * in sync with the pinned bb release (root package.json → config.bbVersion).
 *
 *   bun scripts/sdk-types.ts check     # exit 1 on drift (used by CI)
 *   bun scripts/sdk-types.ts refresh   # rewrite the .d.ts files in place
 *
 * The authoritative declarations come from scaffolding a throwaway plugin with
 * the pinned bb CLI (`bb plugin new --app`), which writes the exact .d.ts
 * files that release ships. Set BB_CLI to point at a specific bb binary.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { workspacePlugins } from "./plugin-package";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
// Declaration filenames the bb SDK ships. Not package names — leave them alone.
const SERVER_DTS = "bb-plugin-sdk.d.ts";
const APP_DTS = "bb-plugin-sdk-app.d.ts";

const mode = process.argv[2];
if (mode !== "check" && mode !== "refresh") {
  console.error("usage: bun scripts/sdk-types.ts <check|refresh>");
  process.exit(2);
}

const rootPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const expectedVersion: string | undefined = rootPkg.config?.bbVersion;
if (!expectedVersion) {
  console.error("root package.json is missing config.bbVersion");
  process.exit(2);
}

const bb = process.env.BB_CLI ?? "bb";
let actualVersion: string;
try {
  actualVersion = execFileSync(bb, ["--version"], { encoding: "utf8" }).trim();
} catch {
  console.error(
    `could not run '${bb} --version' — install the bb desktop app, ` +
      `'bun install -g bb-app@${expectedVersion}', or set BB_CLI`,
  );
  process.exit(1);
}
if (actualVersion !== expectedVersion) {
  console.error(
    `bb CLI is ${actualVersion} but config.bbVersion pins ${expectedVersion}; ` +
      `refusing to ${mode} with a mismatched release ` +
      `(update config.bbVersion or use a matching bb via BB_CLI)`,
  );
  process.exit(1);
}

console.log(`scaffolding reference plugin with bb ${actualVersion}…`);
const tmp = mkdtempSync(join(tmpdir(), "bb-sdk-types-"));
let canonical: { server: string; app: string };
try {
  execFileSync(bb, ["plugin", "new", "probe", "--app"], { cwd: tmp, stdio: "pipe" });
  // bb names the scaffold directory `bb-plugin-<id>` whatever the package name
  // is (apps/cli/src/commands/plugin.ts), so this stays unscoped.
  const typesDir = join(tmp, "bb-plugin-probe", "types");
  canonical = {
    server: readFileSync(join(typesDir, SERVER_DTS), "utf8"),
    app: readFileSync(join(typesDir, APP_DTS), "utf8"),
  };
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

let drifted = 0;
let updated = 0;
for (const plugin of workspacePlugins(ROOT)) {
  const targets: Array<[string, string]> = [[join(plugin.dir, "types", SERVER_DTS), canonical.server]];
  if (plugin.manifest.bb?.app) targets.push([join(plugin.dir, "types", APP_DTS), canonical.app]);

  for (const [path, want] of targets) {
    const current = existsSync(path) ? readFileSync(path, "utf8") : null;
    if (current === want) continue;
    const rel = path.slice(ROOT.length);
    if (mode === "check") {
      console.error(`drift: ${rel} does not match bb ${expectedVersion}`);
      drifted++;
    } else {
      // A newly added plugin has no types/ directory yet.
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, want);
      console.log(`updated ${rel}`);
      updated++;
    }
  }
}

if (mode === "check") {
  if (drifted > 0) {
    console.error(`\n${drifted} file(s) drifted — run 'bun run sdk-types:refresh'`);
    process.exit(1);
  }
  console.log(`all vendored SDK types match bb ${expectedVersion}`);
} else {
  console.log(updated > 0 ? `${updated} file(s) refreshed` : "already up to date");
}
