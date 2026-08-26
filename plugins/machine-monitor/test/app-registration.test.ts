import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import type {
  JsonValue,
  PluginAppDefinition,
  PluginAppSetup,
  PluginSdkApp,
} from "@get-bb/plugin-sdk/app";
import { collectPluginAppRegistrations } from "@get-bb/plugin-sdk/internal/plugin-app-collector";

type PluginRuntimeGlobal = typeof globalThis & {
  __bbPluginRuntime?: {
    pluginSdkApp?: Partial<PluginSdkApp>;
  };
};

async function loadRegistrations() {
  const runtimeGlobal = globalThis as PluginRuntimeGlobal;
  const previousRuntime = runtimeGlobal.__bbPluginRuntime;
  runtimeGlobal.__bbPluginRuntime = {
    ...previousRuntime,
    pluginSdkApp: {
      definePluginApp(setup: PluginAppSetup): PluginAppDefinition {
        return Object.freeze({ __bbPluginApp: true, setup });
      },
    },
  };

  try {
    const { default: definition } = await import("../app.tsx");
    return collectPluginAppRegistrations(definition);
  } finally {
    if (previousRuntime === undefined) {
      delete runtimeGlobal.__bbPluginRuntime;
    } else {
      runtimeGlobal.__bbPluginRuntime = previousRuntime;
    }
  }
}

test("keeps the installed plugin identity while presenting Host Monitor", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as {
    name: string;
    bb: { name: string };
  };

  assert.equal(manifest.name, "bb-plugin-machine-monitor");
  assert.equal(manifest.name.replace(/^bb-plugin-/u, ""), "machine-monitor");
  assert.equal(manifest.bb.name, "Host Monitor");
});

test("keeps threshold color hooks on percentages without rendering a legend or coloring counts", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const accessoryStart = source.indexOf("function FleetSidebarAccessory()");
  const accessoryEnd = source.indexOf("function FilterPill(", accessoryStart);

  assert.match(source, /machine-monitor-metric-ruler__percentage/u);
  assert.match(source, /machine-monitor-host-card__metric-value/u);
  assert.match(source, /machine-monitor-telemetry-gauge__percentage/u);
  assert.doesNotMatch(source, /ThresholdLegend|machine-monitor-threshold-legend/u);
  assert.notEqual(accessoryStart, -1);
  assert.notEqual(accessoryEnd, -1);
  const accessorySource = source.slice(accessoryStart, accessoryEnd);
  assert.doesNotMatch(
    accessorySource,
    /data-host-monitor-threshold-colors|data-tone/u,
  );
  assert.match(accessorySource, /hosts connected, all healthy/u);
});

test("marks receive and send values for stable directional network colors", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");

  assert.match(source, /machine-monitor-network-rate__arrow/u);
  assert.match(source, /machine-monitor-network-rate__value/u);
  assert.match(source, /machine-monitor-host-card__network-rate/u);
  assert.match(source, /machine-monitor-network-detail/u);
  assert.match(source, /data-network-direction="down"/u);
  assert.match(source, /data-network-direction="up"/u);
  assert.match(
    source,
    /valueNetworkDirection=\{network\.available \? "down" : undefined\}/u,
  );
  assert.match(
    source,
    /valueNetworkDirection=\{network\.available \? "up" : undefined\}/u,
  );
});

test("registers the Host Monitor sidebar surfaces and targeted inspector", async () => {
  const registrations = await loadRegistrations();

  assert.equal(registrations.navPanels.length, 1);
  const panel = registrations.navPanels[0];
  assert.ok(panel);
  assert.deepEqual(
    {
      id: panel.id,
      title: panel.title,
      icon: panel.icon,
      path: panel.path,
    },
    {
      id: "machines",
      title: "Host Monitor",
      icon: "Terminal",
      path: "machines",
    },
  );
  assert.equal(typeof panel.component, "function");
  assert.equal(typeof panel.headerContent, "function");
  assert.equal(typeof panel.experimental_sidebarAccessory, "function");

  assert.equal(panel.fixedTabs?.length, 1);
  const inspectTab = panel.fixedTabs?.[0];
  assert.ok(inspectTab);
  assert.deepEqual(
    {
      panelId: inspectTab.panelId,
      id: inspectTab.id,
      title: inspectTab.title,
      icon: inspectTab.icon,
      layout: inspectTab.layout,
    },
    {
      panelId: "machines",
      id: "inspect",
      title: "Host details",
      icon: "Terminal",
      layout: "padded",
    },
  );
  assert.equal(typeof inspectTab.component, "function");
  assert.ok(inspectTab.experimental_target);

  const validateTarget = inspectTab.experimental_target.validate;
  assert.equal(validateTarget({ hostId: "host-alpha" }), true);
  const malformedTargets: JsonValue[] = [
    null,
    [],
    "host-alpha",
    {},
    { hostId: "" },
    { hostId: 42 },
    { hostId: "host-alpha", extra: true },
  ];
  for (const target of malformedTargets) {
    assert.equal(validateTarget(target), false);
  }

  assert.equal(registrations.sidebarFooterActions.length, 1);
  const footerAction = registrations.sidebarFooterActions[0];
  assert.ok(footerAction);
  assert.deepEqual(
    {
      id: footerAction.id,
      title: footerAction.title,
      icon: footerAction.icon,
    },
    {
      id: "machines",
      title: "Host Monitor",
      icon: "Terminal",
    },
  );
  assert.equal(typeof footerAction.run, "function");

  assert.equal(registrations.contentScripts.length, 1);
  const contentScript = registrations.contentScripts[0];
  assert.ok(contentScript);
  assert.equal(contentScript.id, "host-monitor-sidebar");
  assert.equal(typeof contentScript.mount, "function");
});
