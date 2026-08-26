import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { setTimeout as delay } from "node:timers/promises";
import {
  hostContract,
  rpcContract,
  type Dashboard,
  type MachineSnapshot,
} from "./contract.js";
import {
  buildDashboard,
  mergeLastGoodRecords,
  type LastGoodMachineRecord,
  type MachineHost,
  type MachineSampleUpdate,
} from "./lib/dashboard.js";
import {
  resolveHealthThresholds,
  sameHealthThresholds,
  type HealthThresholds,
} from "./lib/thresholds.js";

const REFRESH_INTERVAL_MS = 10_000;
const CPU_SAMPLE_MS = 300;
const HOST_CALL_TIMEOUT_MS = 5_000;
const REALTIME_CHANNEL = "machines-changed";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isTimeout(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || /timed?\s*out/iu.test(error.message))
  );
}

function publicSampleError(error: unknown): string {
  return isTimeout(error)
    ? "Sampling timed out. The machine may be busy or reconnecting."
    : "Could not collect metrics from this machine.";
}

function projectHost(host: {
  id: string;
  name: string;
  status: "connected" | "disconnected";
  lastSeenAt: number | null;
}): MachineHost {
  return {
    id: host.id,
    name: host.name,
    status: host.status,
    lastSeenAt: host.lastSeenAt,
  };
}

function nextCpuHighStreak(
  previous: LastGoodMachineRecord | undefined,
  snapshot: MachineSnapshot,
  thresholds: HealthThresholds,
): number {
  return snapshot.cpu.usagePercent >= thresholds.attentionPercent
    ? Math.min((previous?.cpuHighStreak ?? 0) + 1, Number.MAX_SAFE_INTEGER)
    : 0;
}

export default async function machineMonitorPlugin(
  bb: BbPluginApi,
): Promise<void> {
  const settings = bb.settings.define({
    sidebarThresholdColors: {
      type: "boolean",
      label: "Threshold colors",
      description:
        "Color CPU, memory, and disk percentage values green, yellow, or red across the Host Monitor page, sidebar popover, and floating window.",
      default: true,
    },
    attentionThresholdPercent: {
      type: "string",
      label: "Yellow threshold (%)",
      description:
        "CPU, memory, and disk turn yellow at this usage percentage. Enter 1–99, below the red threshold; invalid values use 85%.",
      default: "85",
    },
    criticalThresholdPercent: {
      type: "string",
      label: "Red threshold (%)",
      description:
        "CPU, memory, and disk turn red at this usage percentage. Enter 2–100, above the yellow threshold; invalid values use 95%.",
      default: "95",
    },
  });
  const initialSettings = await settings.get();
  let sidebarThresholdColors = initialSettings.sidebarThresholdColors;
  let thresholds = resolveHealthThresholds(initialSettings);
  const hostClient = bb.hosts.experimental_client({ contract: hostContract });
  let hosts: MachineHost[] = [];
  let records = new Map<string, LastGoodMachineRecord>();
  let hostListInFlight: Promise<MachineHost[]> | null = null;
  let fullRefreshInFlight: Promise<void> | null = null;
  const sampleInFlight = new Map<string, Promise<void>>();
  let refreshRequested = true;
  let wakeWaiter: (() => void) | null = null;

  function dashboard(): Dashboard {
    return buildDashboard(
      hosts,
      records,
      Date.now(),
      REFRESH_INTERVAL_MS,
      thresholds,
    );
  }

  function publish(hostIds: readonly string[]): void {
    bb.realtime.publish(REALTIME_CHANNEL, {
      hostIds: [...hostIds],
      generatedAtMs: Date.now(),
    });
  }

  function requestRefresh(): void {
    refreshRequested = true;
    wakeWaiter?.();
  }

  settings.onChange((next) => {
    const nextThresholds = resolveHealthThresholds(next);
    const thresholdsChanged = !sameHealthThresholds(
      thresholds,
      nextThresholds,
    );
    sidebarThresholdColors = next.sidebarThresholdColors;
    thresholds = nextThresholds;
    if (thresholdsChanged) {
      records = new Map(
        [...records].map(([hostId, record]) => [
          hostId,
          { ...record, cpuHighStreak: 0 },
        ]),
      );
      requestRefresh();
    }
    publish(hosts.map((host) => host.id));
  });

  async function listHosts(signal?: AbortSignal): Promise<MachineHost[]> {
    if (hostListInFlight !== null) return hostListInFlight;
    const pending = bb.sdk.hosts
      .list(signal === undefined ? undefined : { signal })
      .then((availableHosts) => availableHosts.map(projectHost));
    hostListInFlight = pending;
    try {
      hosts = await pending;
      records = mergeLastGoodRecords(hosts, records, new Map());
      return hosts;
    } finally {
      if (hostListInFlight === pending) hostListInFlight = null;
    }
  }

  async function sampleHost(
    machine: MachineHost,
    signal?: AbortSignal,
  ): Promise<void> {
    if (machine.status !== "connected") return;
    const existing = sampleInFlight.get(machine.id);
    if (existing !== undefined) return existing;

    const timeoutSignal = AbortSignal.timeout(HOST_CALL_TIMEOUT_MS);
    const callSignal =
      signal === undefined
        ? timeoutSignal
        : AbortSignal.any([signal, timeoutSignal]);
    const pending = (async () => {
      try {
        const snapshot = await hostClient.call(
          "snapshot",
          { cpuSampleMs: CPU_SAMPLE_MS },
          { hostId: machine.id, signal: callSignal },
        );
        const update: MachineSampleUpdate = {
          kind: "success",
          snapshot,
          cpuHighStreak: nextCpuHighStreak(
            records.get(machine.id),
            snapshot,
            thresholds,
          ),
        };
        records = mergeLastGoodRecords(
          hosts,
          records,
          new Map([[machine.id, update]]),
        );
      } catch (error) {
        if (signal?.aborted) return;
        bb.log.warn(
          `Could not sample host ${machine.id}: ${errorMessage(error)}`,
        );
        records = mergeLastGoodRecords(
          hosts,
          records,
          new Map([
            [
              machine.id,
              { kind: "error", error: publicSampleError(error) } as const,
            ],
          ]),
        );
      }
    })();
    sampleInFlight.set(machine.id, pending);
    try {
      await pending;
    } finally {
      if (sampleInFlight.get(machine.id) === pending) {
        sampleInFlight.delete(machine.id);
      }
    }
  }

  async function refreshAll(signal?: AbortSignal): Promise<void> {
    if (fullRefreshInFlight !== null) return fullRefreshInFlight;
    const pending = (async () => {
      const availableHosts = await listHosts(signal);
      await Promise.all(
        availableHosts.map((machine) => sampleHost(machine, signal)),
      );
      publish(availableHosts.map((machine) => machine.id));
    })();
    fullRefreshInFlight = pending;
    try {
      await pending;
    } finally {
      if (fullRefreshInFlight === pending) fullRefreshInFlight = null;
    }
  }

  async function refreshOne(hostId: string): Promise<void> {
    const availableHosts = await listHosts();
    const machine = availableHosts.find((candidate) => candidate.id === hostId);
    if (machine === undefined) return;
    await sampleHost(machine);
    publish([hostId]);
  }

  bb.rpc.register(rpcContract, {
    async getPreferences() {
      return { sidebarThresholdColors, thresholds };
    },
    async dashboard() {
      if (hosts.length === 0) await listHosts();
      return dashboard();
    },
    async refresh({ hostId }) {
      if (hostId === null) await refreshAll();
      else await refreshOne(hostId);
      return dashboard();
    },
  });

  async function waitForRefresh(signal: AbortSignal): Promise<void> {
    if (signal.aborted || refreshRequested) return;
    const wakeController = new AbortController();
    const wake = (): void => wakeController.abort();
    wakeWaiter = wake;
    try {
      await delay(REFRESH_INTERVAL_MS, undefined, {
        signal: AbortSignal.any([signal, wakeController.signal]),
      });
    } catch (error) {
      if (!signal.aborted && !wakeController.signal.aborted) throw error;
    } finally {
      if (wakeWaiter === wake) wakeWaiter = null;
    }
  }

  const unsubscribeWorkerExit = hostClient.experimental_onWorkerExit(
    ({ hostId }) => {
      bb.log.warn(
        `Host Monitor worker exited unexpectedly on host ${hostId}; the next poll will restart it`,
      );
    },
  );
  bb.onDispose(unsubscribeWorkerExit);

  bb.background.service("machine-sampler", {
    async start(signal) {
      const unsubscribeHost = bb.sdk.subscribe({
        event: "host:changed",
        callback: requestRefresh,
      });
      const unsubscribeRealtime = bb.sdk.subscribe({
        event: "realtime:connection",
        callback: (event) => {
          if (event.state === "connected" && event.reconnected) {
            requestRefresh();
          }
        },
      });

      try {
        while (!signal.aborted) {
          refreshRequested = false;
          try {
            await refreshAll(signal);
          } catch (error) {
            if (!signal.aborted) {
              bb.log.warn(`Could not refresh machines: ${errorMessage(error)}`);
            }
          }
          if (signal.aborted) break;
          if (refreshRequested) continue;
          await waitForRefresh(signal);
        }
      } finally {
        unsubscribeRealtime();
        unsubscribeHost();
        wakeWaiter?.();
        wakeWaiter = null;
      }
    },
  });
}
