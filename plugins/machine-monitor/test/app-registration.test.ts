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

test("marks download red and upload blue across network readings", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app.css", import.meta.url), "utf8");

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
  assert.match(css, /--host-monitor-network-down:\s*var\(--destructive\)/u);
  assert.match(css, /--host-monitor-network-up:\s*var\(--timeline-accent\)/u);
});

test("keeps the redesigned host cards flat, private, and keyboard-native", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app.css", import.meta.url), "utf8");
  const cardStart = source.indexOf("function FleetCardGrid(");
  const cardEnd = source.indexOf("function DesktopFleetTable(", cardStart);
  const skeletonStart = source.indexOf("function FleetSkeleton(");
  const skeletonEnd = source.indexOf("function ErrorNotice(", skeletonStart);

  assert.notEqual(cardStart, -1);
  assert.notEqual(cardEnd, -1);
  assert.notEqual(skeletonStart, -1);
  assert.notEqual(skeletonEnd, -1);
  const cardSource = source.slice(cardStart, cardEnd);
  const skeletonSource = source.slice(skeletonStart, skeletonEnd);

  assert.equal([...cardSource.matchAll(/<button\b/gu)].length, 1);
  assert.match(cardSource, /aria-current=\{selected \? "true" : undefined\}/u);
  assert.match(cardSource, /<CardMachineIdentity machine=\{machine\}/u);
  assert.match(cardSource, /<CardMetric/u);
  assert.match(
    cardSource,
    /formatByteUsage\(\s*machine\.snapshot\.memory\.usedBytes,\s*machine\.snapshot\.memory\.totalBytes,?\s*\)/su,
  );
  assert.match(cardSource, /<IpAddressValue/u);
  assert.match(cardSource, /const sampleLabel = cardSampleLabel\(machine\)/u);
  assert.match(cardSource, /<span className="sr-only">\{network\.accessibleText\}<\/span>/u);
  assert.match(cardSource, />Download<\/span>/u);
  assert.match(cardSource, />Upload<\/span>/u);
  assert.match(cardSource, /data-network-direction="down"/u);
  assert.match(cardSource, /data-network-direction="up"/u);
  assert.match(skeletonSource, /machine-monitor-card-skeleton__metadata/u);
  assert.match(skeletonSource, /machine-monitor-card-skeleton__metric/u);
  assert.match(skeletonSource, /machine-monitor-card-skeleton__network/u);
  assert.match(css, /minmax\(min\(100%, 20rem\), 1fr\)/u);
  assert.match(css, /\.machine-monitor-host-card__status\[data-connected="false"\]/u);
  assert.match(css, /\.machine-monitor-host-card__network-lane/u);
  assert.match(css, /\.machine-monitor-host-card__network-direction/u);
  assert.match(css, /\.machine-monitor-host-card__metric-detail/u);
  assert.match(css, /\.machine-monitor-host-card\[aria-current="true"\]/u);
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

  assert.equal(panel.fixedTabs?.length, 2);
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

  const processesTab = panel.fixedTabs?.[1];
  assert.ok(processesTab);
  assert.deepEqual(
    {
      panelId: processesTab.panelId,
      id: processesTab.id,
      title: processesTab.title,
      icon: processesTab.icon,
      layout: processesTab.layout,
    },
    {
      panelId: "machines",
      id: "processes",
      title: "Processes",
      icon: "Activity",
      layout: "flush",
    },
  );
  assert.equal(typeof processesTab.component, "function");
  assert.ok(processesTab.experimental_target);
  const validateProcessesTarget = processesTab.experimental_target.validate;
  assert.equal(
    validateProcessesTarget({ hostId: "host-alpha", initialSort: "cpu" }),
    true,
  );
  assert.equal(
    validateProcessesTarget({ hostId: "host-alpha", initialSort: "memory" }),
    true,
  );
  const malformedProcessTargets: JsonValue[] = [
    null,
    {},
    { hostId: "host-alpha" },
    { initialSort: "cpu" },
    { hostId: "", initialSort: "cpu" },
    { hostId: "host-alpha", initialSort: "name" },
    { hostId: "host-alpha", initialSort: "cpu", extra: true },
  ];
  for (const target of malformedProcessTargets) {
    assert.equal(validateProcessesTarget(target), false);
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

test("keeps process inspection on demand, target-bound, and privacy-safe", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");

  assert.match(source, /PROCESS_POLL_INTERVAL_MS = 5_000/u);
  assert.match(source, /rpc\.call\("listProcesses"/u);
  assert.match(source, /rpc\.call\("prepareProcessTermination"/u);
  assert.match(source, /rpc\.call\("executeProcessTermination"/u);
  assert.match(source, /confirmationToken: token/u);
  assert.match(source, /consumedTokens\.current\.has\(token\)/u);
  assert.match(source, /onOpenAutoFocus/u);
  assert.match(source, /cancelRef\.current\?\.focus\(\)/u);
  assert.match(source, /onCloseAutoFocus/u);
  assert.match(source, /usePortalScopeProps/u);
  assert.match(source, /forceContext.*"persisted"/su);
  assert.match(source, /function EndProcessIcon/u);
  assert.match(
    source,
    /pending \? <Spinner className="size-3" \/> : <EndProcessIcon \/>/u,
  );
  assert.doesNotMatch(source, /process\.command|process\.user|process\.path/u);
  const processesStart = source.indexOf("function ProcessesPanel()");
  const processesEnd = source.indexOf("function InspectorEmpty(", processesStart);
  assert.notEqual(processesStart, -1);
  assert.notEqual(processesEnd, -1);
  assert.doesNotMatch(
    source.slice(processesStart, processesEnd),
    /targetState\?\.target\.hostId \?\?/u,
  );
  assert.doesNotMatch(
    source.slice(processesStart, processesEnd),
    /thresholdTone|data-host-monitor-threshold-colors/u,
  );
  assert.doesNotMatch(
    source.slice(processesStart, processesEnd),
    /bulk|process tree|auto.?kill/iu,
  );
  const processesSource = source.slice(processesStart, processesEnd);
  assert.match(processesSource, /prepareInFlight\.current/u);
  assert.match(processesSource, /sequence !== prepareSequence\.current/u);
  assert.match(processesSource, /generation !== targetGeneration\.current/u);
  assert.match(processesSource, /listInFlight\.current/u);
  assert.match(processesSource, /listQueued\.current/u);
  assert.match(processesSource, /!actionBusyRef\.current/u);
  assert.match(processesSource, /actionsBusy=\{destructiveActionsBusy\}/u);
  assert.match(source, /preferred\?\.isConnected/u);
  assert.match(source, /preferred\.disabled/u);
  assert.match(source, /getAttribute\("aria-disabled"\) === "true"/u);
  assert.match(source, /fallbackFocus\.current\?\.isConnected/u);
  assert.match(source, /fallbackFocus\.current\.focus\(\)/u);
  assert.match(processesSource, /params\.sortBy === listParams\.current\.sortBy/u);
  assert.match(processesSource, /dashboard\.dashboard\?\.machines\.find/u);
  assert.match(processesSource, /ref=\{fallbackFocus\}/u);
  assert.match(processesSource, /tabIndex=\{-1\}/u);
  assert.match(processesSource, /toast\.info\(executed\.message\)/u);
  assert.doesNotMatch(processesSource, /toast\.success/u);
  assert.match(
    processesSource,
    /Host Monitor could not confirm whether the stop request completed\. Refresh before trying again\./u,
  );
  assert.doesNotMatch(processesSource, /connection dropped/iu);
  assert.match(processesSource, /consumedTokens\.current\.delete\(token\)/u);
  assert.match(
    processesSource,
    /aria-label="Sort processes; Process is A to Z, CPU and RAM are highest first"/u,
  );
  assert.match(processesSource, /filterProcessRows\(sortedRows, processQuery\)/u);
  assert.match(processesSource, /aria-keyshortcuts="Escape"/u);
  assert.match(processesSource, /ProcessSummaryStrip/u);
  assert.match(processesSource, /machine-monitor-process-surface/u);
  assert.match(
    source,
    /<th aria-label=\{`\$\{row\.name\}, PID \$\{row\.pid\}`\} scope="row">/u,
  );
  assert.match(processesSource, /maximumCpu=\{maximumCpu\}/u);
  assert.match(processesSource, /maximumMemory=\{maximumMemory\}/u);
});

test("keeps process sorting responsive and accessible", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app.css", import.meta.url), "utf8");

  assert.match(source, /function ProcessTableSortHeader/u);
  assert.match(source, /aria-sort=\{active \? direction : undefined\}/u);
  assert.match(source, /className="machine-monitor-process-column-sort"/u);
  assert.match(source, /onClick=\{\(\) => onSort\("name"\)\}/u);
  assert.match(source, /onClick=\{\(\) => onSort\("cpu"\)\}/u);
  assert.match(source, /onClick=\{\(\) => onSort\("memory"\)\}/u);
  assert.match(source, /onSort=\{selectSort\}/u);
  assert.match(source, /aria-pressed=\{active\}/u);
  assert.match(source, /Sorted by Process, A to Z\./u);
  assert.match(source, /Sorted by.*highest first\./u);
  assert.equal([...source.matchAll(/<ProcessSortButton /gu)].length, 3);
  assert.match(
    css,
    /@container \(min-width: 32rem\)\s*\{\s*\.machine-monitor-process-sort-group\s*\{\s*display:\s*none;/u,
  );
  assert.match(css, /\.machine-monitor-process-column-sort:focus-visible/u);
});

test("stamps portaled process confirmations with the plugin overlay scope", async () => {
  const { usePortalScopeProps } = await import("../lib/portal-scope");
  const scope = usePortalScopeProps();

  assert.equal(scope["data-bb-portaled-overlay"], "");
  assert.equal(scope["data-bb-plugin-root"], "");
  assert.equal(scope["data-bb-plugin"], undefined);
});
