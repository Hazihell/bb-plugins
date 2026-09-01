import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const generatedTypes = [
  "plugins/dockside/types/bb-plugin-sdk.d.ts",
  "plugins/dockside/types/bb-plugin-sdk-app.d.ts",
];
const originals = await Promise.all(generatedTypes.map((path) => readFile(path)));

function run(args) {
  const env = { ...process.env };
  delete env.BB_CLI;
  const result = spawnSync("npm", args, { env, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(" ")} failed with ${result.status}`);
  }
}

try {
  run(["run", "typecheck", "--workspace", "bb-plugin-dockside"]);
  run(["test", "--workspace", "bb-plugin-dockside"]);
  run(["run", "build", "--workspace", "bb-plugin-dockside"]);
} finally {
  await Promise.all(
    generatedTypes.map((path, index) => writeFile(path, originals[index])),
  );
}
