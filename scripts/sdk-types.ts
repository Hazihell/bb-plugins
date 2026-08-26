#!/usr/bin/env bun
/**
 * Keep every workspace plugin's SDK surface in sync with the pinned bb release
 * (root package.json → config.bbVersion).
 *
 *   bun scripts/sdk-types.ts check     # exit 1 on drift (used by CI)
 *   bun scripts/sdk-types.ts refresh   # sync each plugin in place
 *
 * Workspaces may use either supported SDK layout: older plugins vendor
 * `types/*.d.ts`, while current plugins depend on `@get-bb/plugin-sdk`.
 * `bb plugin types` owns that distinction, including the package SDK pin and
 * frontend shim dependencies, so this script invokes it once from every
 * plugin workspace instead of scaffolding a reference plugin. Set BB_CLI to
 * point at a specific bb binary.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { workspacePlugins } from "./plugin-package";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

export type SdkTypesMode = "check" | "refresh";

export type PluginTypesRunner = (
  args: readonly string[],
  cwd: string,
) => void;

export interface SdkTypesResult {
  attempted: number;
  failures: string[];
}

/**
 * Delegate SDK synchronization to bb from each plugin directory. The command
 * deliberately receives no layout hint: bb inspects that workspace and
 * updates either its vendored declarations or its package dependencies.
 */
export function syncWorkspaceSdkTypes(
  root: string,
  mode: SdkTypesMode,
  runPluginTypes: PluginTypesRunner,
): SdkTypesResult {
  const plugins = workspacePlugins(root);
  const failures: string[] = [];
  const args = [
    "plugin",
    "types",
    ...(mode === "check" ? ["--check"] : []),
  ] as const;

  for (const plugin of plugins) {
    console.log(
      `${mode === "check" ? "checking" : "refreshing"} plugins/${plugin.directory}…`,
    );
    try {
      runPluginTypes(args, plugin.dir);
    } catch {
      failures.push(plugin.directory);
    }
  }

  return { attempted: plugins.length, failures };
}

function pinnedBbVersion(root: string): string | null {
  const rootPackage = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  ) as { config?: { bbVersion?: unknown } };
  const version = rootPackage.config?.bbVersion;
  return typeof version === "string" && version.length > 0 ? version : null;
}

function main(): number {
  const mode = process.argv[2];
  if (mode !== "check" && mode !== "refresh") {
    console.error("usage: bun scripts/sdk-types.ts <check|refresh>");
    return 2;
  }

  const expectedVersion = pinnedBbVersion(ROOT);
  if (expectedVersion === null) {
    console.error("root package.json is missing config.bbVersion");
    return 2;
  }

  const bb = process.env.BB_CLI ?? "bb";
  let actualVersion: string;
  try {
    actualVersion = execFileSync(bb, ["--version"], {
      encoding: "utf8",
    }).trim();
  } catch {
    console.error(
      `could not run '${bb} --version' — install the bb desktop app, ` +
        `'bun install -g bb-app@${expectedVersion}', or set BB_CLI`,
    );
    return 1;
  }

  if (actualVersion !== expectedVersion) {
    console.error(
      `bb CLI is ${actualVersion} but config.bbVersion pins ${expectedVersion}; ` +
        `refusing to ${mode} with a mismatched release ` +
        `(update config.bbVersion or use a matching bb via BB_CLI)`,
    );
    return 1;
  }

  const result = syncWorkspaceSdkTypes(ROOT, mode, (args, cwd) => {
    execFileSync(bb, [...args], { cwd, stdio: "inherit" });
  });

  if (result.attempted === 0) {
    console.error("no bb plugin workspaces found under plugins/");
    return 1;
  }

  if (result.failures.length > 0) {
    console.error(
      `\n${mode} failed for ${result.failures.length} plugin(s): ` +
        result.failures.map((plugin) => `plugins/${plugin}`).join(", "),
    );
    if (mode === "check") {
      console.error("run 'bun run sdk-types:refresh' to sync them");
    }
    return 1;
  }

  console.log(
    mode === "check"
      ? `all ${result.attempted} plugin SDK surfaces match bb ${expectedVersion}`
      : `refreshed ${result.attempted} plugin SDK surfaces for bb ${expectedVersion}`,
  );
  return 0;
}

if (import.meta.main) {
  process.exitCode = main();
}
