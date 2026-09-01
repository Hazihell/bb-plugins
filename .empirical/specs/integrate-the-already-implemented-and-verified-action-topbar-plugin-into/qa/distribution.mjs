import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const read = (path) => readFileSync(path, "utf8");
const manifest = JSON.parse(read("plugins/action-topbar/package.json"));
const collection = JSON.parse(read(".bb/plugins.json"));
const rootReadme = read("README.md");
const pluginReadme = read("plugins/action-topbar/README.md");

assert.equal(manifest.name, "bb-plugin-action-topbar");
assert.equal(manifest.engines.bbPluginSdk, ">=0.4.33");
assert.equal(manifest.bb.server, "./server.ts");
assert.equal(manifest.bb.app, "./app.tsx");
assert.ok(collection.plugins.some((plugin) => plugin.name === "action-topbar" && plugin.source === "./plugins/action-topbar"));
assert.match(rootReadme, /Action Topbar is not being submitted to the BB Marketplace yet/);
assert.match(pluginReadme, /experimental Action split-drag API introduced in Plugin SDK 0\.4\.33/);
assert.match(pluginReadme, /git:https:\/\/github\.com\/MateoCerquetella\/bb-plugins\.git@main/);
assert.match(pluginReadme, /path:\/absolute\/path\/to\/bb-plugins\/plugins\/action-topbar/);

const packed = spawnSync("npm", ["pack", "--dry-run", "--json", "--workspace=bb-plugin-action-topbar"], {
  cwd: process.cwd(),
  encoding: "utf8"
});

assert.equal(packed.status, 0, packed.stderr);
const packReport = JSON.parse(packed.stdout);
const packedPaths = new Set(packReport[0].files.map((file) => file.path));
for (const path of ["dist/app.js", "dist/server.js", "assets/icon.svg", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md"]) {
  assert.ok(packedPaths.has(path), `missing packed file: ${path}`);
}

process.stdout.write("Action Topbar distribution contract passed.\n");
