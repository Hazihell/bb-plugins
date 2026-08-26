import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import {
  syncWorkspaceSdkTypes,
  type SdkTypesMode,
} from "./sdk-types";

const temporaryDirectories: string[] = [];

async function fixtureRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "bb-sdk-types-test-"));
  temporaryDirectories.push(root);
  await mkdir(join(root, "plugins"), { recursive: true });
  return root;
}

async function writePlugin(
  root: string,
  directory: string,
  layout: "package" | "vendored",
): Promise<void> {
  const pluginDirectory = join(root, "plugins", directory);
  await mkdir(pluginDirectory, { recursive: true });
  await writeFile(
    join(pluginDirectory, "package.json"),
    `${JSON.stringify(
      {
        name: `bb-plugin-${directory}`,
        version: "0.1.0",
        type: "module",
        bb: { server: "./server.ts", app: "./app.tsx" },
        ...(layout === "package"
          ? { devDependencies: { "@get-bb/plugin-sdk": "0.4.21" } }
          : {}),
      },
      null,
      2,
    )}\n`,
  );
  if (layout === "vendored") {
    await mkdir(join(pluginDirectory, "types"));
    await writeFile(
      join(pluginDirectory, "types", "bb-plugin-sdk.d.ts"),
      "export {};\n",
    );
  }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

for (const mode of ["check", "refresh"] satisfies SdkTypesMode[]) {
  test(`${mode} delegates package and vendored layouts to bb`, async () => {
    const root = await fixtureRoot();
    await Promise.all([
      writePlugin(root, "modern", "package"),
      writePlugin(root, "legacy", "vendored"),
    ]);
    const calls: Array<{ args: readonly string[]; cwd: string }> = [];

    const result = syncWorkspaceSdkTypes(root, mode, (args, cwd) => {
      calls.push({ args: [...args], cwd });
    });

    expect(result).toEqual({ attempted: 2, failures: [] });
    expect(calls).toEqual([
      {
        args:
          mode === "check"
            ? ["plugin", "types", "--check"]
            : ["plugin", "types"],
        cwd: join(root, "plugins", "legacy"),
      },
      {
        args:
          mode === "check"
            ? ["plugin", "types", "--check"]
            : ["plugin", "types"],
        cwd: join(root, "plugins", "modern"),
      },
    ]);
  });
}

describe("syncWorkspaceSdkTypes failures", () => {
  test("checks every workspace and reports each failed plugin", async () => {
    const root = await fixtureRoot();
    await Promise.all([
      writePlugin(root, "broken-a", "vendored"),
      writePlugin(root, "healthy", "package"),
      writePlugin(root, "broken-b", "package"),
    ]);
    const visited: string[] = [];

    const result = syncWorkspaceSdkTypes(root, "check", (_args, cwd) => {
      const directory = basename(cwd);
      visited.push(directory);
      if (directory.startsWith("broken")) throw new Error("drift");
    });

    expect(visited).toEqual(["broken-a", "broken-b", "healthy"]);
    expect(result).toEqual({
      attempted: 3,
      failures: ["broken-a", "broken-b"],
    });
  });
});
