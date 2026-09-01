import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["run", "check"], {
  env: process.env,
  stdio: "inherit",
  shell: false,
});

if (result.error) throw result.error;
if (result.signal !== null) {
  throw new Error(`npm run check exited on signal ${result.signal}`);
}
process.exitCode = result.status ?? 1;
