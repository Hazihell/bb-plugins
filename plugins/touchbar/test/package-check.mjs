import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const result = JSON.parse(
  execFileSync(
    "npm",
    ["pack", "--workspace", "bb-plugin-touchbar", "--dry-run", "--json"],
    { encoding: "utf8" },
  ),
)[0];
const paths = new Set(result.files.map((file) => file.path));

for (const required of [
  "dist/server.js",
  "dist/server.meta.json",
  "assets/icon.svg",
  "companion/BB-Agent-Monitor.bttpreset",
  "companion/BBTouchBar.swift",
  "companion/bb-touchbar.sh",
  "companion/install.sh",
  "native/Sources/BBTouchBarPrivate.h",
  "native/Sources/AgentModel.swift",
  "native/Sources/TouchBarController.swift",
  "native/Sources/main.swift",
  "native/build.sh",
  "native/install.sh",
  "native/run.sh",
  "native/uninstall.sh",
  "native/LICENSE.upstream",
  "native/Assets/NOTICE.md",
  "native/Assets/codex-color.png",
  "native/Assets/opencode.png",
  "native/Assets/kimi-color.png",
  "native/Assets/deepseek-color.png",
  "README.md",
  "LICENSE",
]) {
  assert.ok(paths.has(required), `package is missing ${required}`);
}
assert.ok(![...paths].some((path) => path.includes("node_modules") || path.endsWith(".map")));
assert.ok(result.size < 500_000);
console.log(`Touch Bar package consumer check passed (${result.size} bytes).`);
