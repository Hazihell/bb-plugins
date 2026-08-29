import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
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
    description: string;
    homepage: string;
    keywords: string[];
    name: string;
    repository: { directory: string };
    bb: { description: string; name: string };
  };

  assert.equal(manifest.name, "bb-plugin-host-monitor");
  assert.equal(manifest.name.replace(/^bb-plugin-/u, ""), "host-monitor");
  assert.equal(manifest.bb.name, "Host Monitor");
  assert.match(manifest.description, /guarded .*stop/iu);
  assert.match(manifest.bb.description, /guarded .*stop/iu);
  assert.match(manifest.homepage, /\/plugins\/host-monitor#readme$/u);
  assert.equal(manifest.repository.directory, "plugins/host-monitor");
  assert.deepEqual(manifest.keywords, [...new Set(manifest.keywords)]);
});

test("keeps the retired compound identity out of active plugin text", () => {
  const pluginRoot = new URL("..", import.meta.url);
  const retiredIdentity = ["machine", "monitor"].join("-");
  const textExtensions = /\.(?:css|d\.ts|json|md|mjs|ts|tsx)$/u;
  const pending = [pluginRoot];

  while (pending.length > 0) {
    const directory = pending.pop();
    assert.ok(directory);
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "dist" || entry.name === "node_modules") continue;
      const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
      if (entry.isDirectory()) {
        pending.push(child);
      } else if (textExtensions.test(entry.name)) {
        assert.doesNotMatch(readFileSync(child, "utf8"), new RegExp(retiredIdentity, "u"));
      }
    }
  }
});

test("keeps threshold color hooks on percentages without rendering a legend or coloring counts", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const accessoryStart = source.indexOf("function FleetSidebarAccessory()");
  const accessoryEnd = source.indexOf("function FilterTab(", accessoryStart);

  assert.match(source, /host-monitor-metric-ruler__percentage/u);
  assert.match(source, /host-monitor-host-card__metric-value/u);
  assert.match(source, /host-monitor-telemetry-gauge__percentage/u);
  assert.doesNotMatch(source, /ThresholdLegend|host-monitor-threshold-legend/u);
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

  assert.match(source, /host-monitor-network-rate__arrow/u);
  assert.match(source, /host-monitor-network-rate__value/u);
  assert.match(source, /host-monitor-host-card__network-rate/u);
  assert.match(source, /host-monitor-network-detail/u);
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

test("uses quiet inline status and explanatory tooltips without colored cards", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app.css", import.meta.url), "utf8");
  const healthStatusStart = source.indexOf("function HealthStatus(");
  const healthStatusEnd = source.indexOf("function MetricRuler(", healthStatusStart);
  const cardIdentityStart = source.indexOf("function CardMachineIdentity(");
  const cardIdentityEnd = source.indexOf("function IpAddressValue(", cardIdentityStart);

  assert.notEqual(healthStatusStart, -1);
  assert.notEqual(healthStatusEnd, -1);
  assert.notEqual(cardIdentityStart, -1);
  assert.notEqual(cardIdentityEnd, -1);
  const healthStatusSource = source.slice(healthStatusStart, healthStatusEnd);
  const cardIdentitySource = source.slice(cardIdentityStart, cardIdentityEnd);

  assert.match(healthStatusSource, /data-connected=/u);
  assert.match(healthStatusSource, /aria-label=\{`\$\{presentation\.label\}\. \$\{presentation\.reason\}`\}/u);
  assert.match(healthStatusSource, /host-monitor-health-status__indicator/u);
  assert.match(
    healthStatusSource,
    /<span aria-hidden="true" className="host-monitor-health-status__indicator" \/>/u,
  );
  assert.match(
    cardIdentitySource,
    /const statusTone = machineBadgePresentation\(machine\)\.tone;/u,
  );
  assert.match(cardIdentitySource, /data-tone=\{statusTone\}/u);

  for (const tone of ["healthy", "attention", "critical"] as const) {
    assert.match(
      css,
      new RegExp(
        `host-monitor-health-status\\[data-connected="true"\\]\\[data-tone="${tone}"\\]`,
        "u",
      ),
    );
    assert.match(
      css,
      new RegExp(
        `host-monitor-machine-identity__status\\[data-connected="true"\\]\\[data-tone="${tone}"\\]`,
        "u",
      ),
    );
    assert.match(
      css,
      new RegExp(
        `host-monitor-host-card__status\\[data-connected="true"\\]\\[data-tone="${tone}"\\]`,
        "u",
      ),
    );
  }

  assert.match(
    css,
    /\.host-monitor-health-status\s*\{[^{}]*border:\s*0[^{}]*background:\s*transparent[^{}]*padding:\s*0/u,
  );
  assert.match(
    css,
    /\.host-monitor-health-status\[data-connected="true"\]\[data-tone="critical"\]\s*\{[^{}]*var\(--host-monitor-critical-text\)/u,
  );
  assert.doesNotMatch(
    css,
    /\.host-monitor-dashboard\s+\.host-monitor-health-status[^{}]*\{[^{}]*(?:border-color|background):/u,
  );

  assert.match(
    css,
    /host-monitor-health-status__indicator\s*\{[^{}]*background:\s*currentColor/u,
  );
  assert.match(
    css,
    /--host-monitor-attention-text:\s*color-mix\(\s*in srgb,\s*var\(--warning-text, var\(--warning\)\) 50%,\s*var\(--host-monitor-text, var\(--foreground\)\)/u,
  );
  assert.match(
    css,
    /--host-monitor-critical-text:\s*color-mix\(\s*in srgb,\s*var\(--destructive-text, var\(--destructive\)\) 50%,\s*var\(--host-monitor-text, var\(--foreground\)\)/u,
  );
  for (const [tone, token] of [
    ["healthy", "normal"],
    ["attention", "attention"],
    ["critical", "critical"],
  ] as const) {
    assert.match(
      css,
      new RegExp(
        `host-monitor-health-status\\[data-connected="true"\\]\\[data-tone="${tone}"\\][^{}]*host-monitor-health-status__indicator\\s*\\{[^{}]*background:\\s*var\\(--host-monitor-${token}\\)`,
        "u",
      ),
    );
  }
  assert.match(
    css,
    /host-monitor-machine-identity__status\[data-connected="false"\]\s*\{[^{}]*muted-foreground/u,
  );
  assert.match(
    css,
    /host-monitor-host-card__status\[data-connected="false"\]\s*\{[^{}]*muted-foreground/u,
  );
  assert.doesNotMatch(
    healthStatusSource,
    /className="host-monitor-health-status"[^>]*data-tone[^>]*style=/u,
  );
  assert.match(source, /function MachineExplanationTooltip/u);
  assert.match(source, /<Tooltip\.Trigger asChild>/u);
  assert.match(source, /<Tooltip\.Portal>/u);
  assert.match(source, /className="host-monitor-status-tooltip"/u);
  assert.match(source, /<Tooltip\.Provider/u);
  assert.match(source, /<MachineExplanationTooltip key=\{machine\.host\.id\} machine=\{machine\}>\s*<tr/u);
  assert.match(source, /className=\{`host-monitor-desktop-fleet__row[^`]*focus-visible:bg-accent\/40/u);
  assert.match(source, /data-tone=\{machineBadgePresentation\(machine\)\.tone\}\s*tabIndex=\{0\}/u);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/u);
  assert.doesNotMatch(source, /\{machine\.alert\.message\}/u);
  assert.doesNotMatch(source, /\{machine\.error\}/u);
  assert.match(source, /\{machineBadgePresentation\(machine\)\.reason\}/u);
  assert.match(css, /\.host-monitor-status-tooltip\s*\{/u);
  assert.match(
    css,
    /\.host-monitor-status-tooltip\s*\{[^{}]*--host-monitor-text:\s*var\(--popover-foreground, var\(--foreground\)\)/u,
  );
  assert.match(css, /background:\s*var\(--popover, var\(--card\)\)/u);
});

test("uses underline fleet filters and rail-free neutral host containers", () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app.css", import.meta.url), "utf8");

  assert.match(source, /function FilterTab/u);
  assert.match(source, /aria-controls="host-monitor-fleet-results"/u);
  assert.match(source, /<fieldset aria-label="Host filter"/u);
  assert.match(source, /data-tone=\{machineBadgePresentation\(machine\)\.tone\}/u);
  assert.match(
    css,
    /\.host-monitor-filter-tab\[aria-pressed="true"\]::after\s*\{[^{}]*background:\s*var\(--foreground\)/u,
  );
  assert.doesNotMatch(
    css,
    /\.host-monitor-(?:host-card|compact-fleet__row)\[data-tone="(?:healthy|attention|critical|offline|unavailable)"\]::before/u,
  );
  assert.doesNotMatch(
    css,
    /\.host-monitor-desktop-fleet__row\[data-tone="(?:attention|critical)"\][^{}]*\{[^{}]*box-shadow/u,
  );
  assert.match(
    css,
    /\.host-monitor-host-card:hover\s*\{[^{}]*background:\s*color-mix\([^{}]*var\(--accent\)/u,
  );
  assert.match(
    source,
    /label="Attention" onClick=\{\(\) => setFilter\("attention"\)\}/u,
  );
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
  assert.match(skeletonSource, /host-monitor-card-skeleton__metadata/u);
  assert.match(skeletonSource, /host-monitor-card-skeleton__metric/u);
  assert.match(skeletonSource, /host-monitor-card-skeleton__network/u);
  assert.match(css, /minmax\(min\(100%, 20rem\), 1fr\)/u);
  assert.match(css, /\.host-monitor-host-card__status\[data-connected="false"\]/u);
  assert.match(css, /\.host-monitor-host-card__network-lane/u);
  assert.match(css, /\.host-monitor-host-card__network-direction/u);
  assert.match(css, /\.host-monitor-host-card__metric-detail/u);
  assert.match(css, /\.host-monitor-host-card\[aria-current="true"\]/u);
});

test("registers the Host Monitor sidebar surfaces and targeted inspector", async () => {
  const source = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
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
      icon: "ChartColumn",
      layout: "flush",
    },
  );
  assert.doesNotMatch(source, /icon:\s*"Activity"/u);
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
  assert.match(processesSource, /host-monitor-process-surface/u);
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
  assert.match(source, /className="host-monitor-process-column-sort"/u);
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
    /@container \(min-width: 32rem\)\s*\{\s*\.host-monitor-process-sort-group\s*\{\s*display:\s*none;/u,
  );
  assert.match(css, /\.host-monitor-process-column-sort:focus-visible/u);
});

test("stamps portaled process confirmations with the plugin overlay scope", async () => {
  const { usePortalScopeProps } = await import("../lib/portal-scope");
  const scope = usePortalScopeProps();

  assert.equal(scope["data-bb-portaled-overlay"], "");
  assert.equal(scope["data-bb-plugin-root"], "");
  assert.equal(scope["data-bb-plugin"], undefined);
});
