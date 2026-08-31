import type { BbPluginApi } from "@get-bb/plugin-sdk";

/** The plugin is frontend-only; the server entry keeps the package loadable. */
export default function plugin(_bb: BbPluginApi): void {}
