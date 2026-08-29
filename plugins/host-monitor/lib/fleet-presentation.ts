import type { Dashboard, MachineRow } from "../contract.ts";

export type FleetFilter = "all" | "attention" | "offline";

export type MachineBadgeTone = MachineRow["health"];

export interface MachineBadgePresentation {
  label: string;
  tone: MachineBadgeTone;
  busy: boolean;
  reason: string;
}

export interface FleetCounts {
  total: number;
  connected: number;
  offline: number;
  attention: number;
}

const HEALTH_LABEL: Readonly<Record<MachineRow["health"], string>> = {
  healthy: "Healthy",
  attention: "Needs attention",
  critical: "Critical",
  offline: "Offline",
  unavailable: "Unavailable",
};

const OFFLINE_REASON =
  "Live metrics are unavailable while this host is offline.";
const UNAVAILABLE_REASON = "Current host health details are unavailable.";
const SAMPLING_REASON = "Collecting a fresh telemetry sample.";
const STALE_REASON = "The latest reading is older than expected.";
const FAILED_WITH_VALUES_REASON =
  "The latest refresh failed; these are the last known values.";
const FAILED_WITHOUT_VALUES_REASON =
  "The latest refresh failed, so no current metrics are available.";
const HEALTHY_REASON =
  "No monitored resource currently meets an alert condition.";
const ATTENTION_REASON = "A monitored resource needs attention.";
const CRITICAL_REASON =
  "A monitored resource crossed a critical threshold.";

type AlertMetric = "cpu" | "memory" | "disk";

function safeAlertMetric(machine: MachineRow): AlertMetric | null {
  if (
    machine.sampleState !== "fresh" ||
    (machine.health !== "attention" && machine.health !== "critical")
  ) {
    return null;
  }
  const alert = machine.alert as unknown;
  if (typeof alert !== "object" || alert === null || Array.isArray(alert)) {
    return null;
  }
  const candidate = alert as { message?: unknown; metric?: unknown };
  if (
    candidate.metric !== "cpu" &&
    candidate.metric !== "memory" &&
    candidate.metric !== "disk"
  ) {
    return null;
  }
  if (typeof candidate.message !== "string") return null;
  const message = candidate.message.trim();
  return message.length > 0 && message.length <= 240
    ? candidate.metric
    : null;
}

function safeMetricPercent(
  machine: MachineRow,
  metric: AlertMetric,
): number | null {
  const snapshot = machine.snapshot as unknown;
  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    return null;
  }
  const candidate = snapshot as {
    cpu?: { usagePercent?: unknown };
    disk?: { usagePercent?: unknown } | null;
    memory?: { usagePercent?: unknown };
  };
  const value =
    metric === "cpu"
      ? candidate.cpu?.usagePercent
      : metric === "memory"
        ? candidate.memory?.usagePercent
        : candidate.disk?.usagePercent;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
    ? value
    : null;
}

function closedAlertReason(machine: MachineRow): string | null {
  const metric = safeAlertMetric(machine);
  if (metric === null) return null;
  const severity = machine.health === "critical" ? "critical" : "attention";
  const percent = safeMetricPercent(machine, metric);
  const reading = percent === null ? "" : ` at ${Math.round(percent)}%`;
  if (metric === "cpu") {
    return `CPU has stayed high${reading}, above the ${severity} threshold.`;
  }
  const label = metric === "memory" ? "Memory" : "Disk";
  return `${label} usage is high${reading}, above the ${severity} threshold.`;
}

/** A stale or failed refresh needs attention even when its last sample was healthy. */
export function machineNeedsAttention(machine: MachineRow): boolean {
  const presentation = machineBadgePresentation(machine);
  return (
    presentation.tone === "attention" ||
    presentation.tone === "critical" ||
    (presentation.tone === "unavailable" &&
      machine.sampleState === "fresh" &&
      machine.health === "unavailable")
  );
}

/** Keep resource severity and telemetry freshness from contradicting each other. */
export function machineBadgePresentation(
  machine: MachineRow,
): MachineBadgePresentation {
  if (
    machine.host.status === "disconnected" ||
    machine.sampleState === "offline" ||
    machine.health === "offline"
  ) {
    return {
      label: "Offline",
      tone: "offline",
      busy: false,
      reason: OFFLINE_REASON,
    };
  }
  if (machine.host.status !== "connected") {
    return {
      label: "Unavailable",
      tone: "unavailable",
      busy: false,
      reason: UNAVAILABLE_REASON,
    };
  }
  if (machine.sampleState === "sampling") {
    return {
      label: "Sampling",
      tone: "unavailable",
      busy: true,
      reason: SAMPLING_REASON,
    };
  }
  if (machine.sampleState === "stale") {
    return {
      label: "Stale reading",
      tone: "attention",
      busy: false,
      reason: STALE_REASON,
    };
  }
  if (machine.sampleState === "error") {
    return {
      label: "Last known",
      tone: "attention",
      busy: false,
      reason:
        machine.snapshot === null
          ? FAILED_WITHOUT_VALUES_REASON
          : FAILED_WITH_VALUES_REASON,
    };
  }
  if (machine.sampleState !== "fresh") {
    return {
      label: "Unavailable",
      tone: "unavailable",
      busy: false,
      reason: UNAVAILABLE_REASON,
    };
  }
  if (
    machine.health !== "healthy" &&
    machine.health !== "attention" &&
    machine.health !== "critical" &&
    machine.health !== "unavailable"
  ) {
    return {
      label: "Unavailable",
      tone: "unavailable",
      busy: false,
      reason: UNAVAILABLE_REASON,
    };
  }
  const alertReason = closedAlertReason(machine);
  return {
    label: HEALTH_LABEL[machine.health],
    tone: machine.health,
    busy: false,
    reason:
      machine.health === "healthy"
        ? HEALTHY_REASON
        : machine.health === "attention"
          ? alertReason ?? ATTENTION_REASON
          : machine.health === "critical"
            ? alertReason ?? CRITICAL_REASON
            : UNAVAILABLE_REASON,
  };
}

export function machineMatchesFleetFilter(
  machine: MachineRow,
  filter: FleetFilter,
): boolean {
  if (filter === "attention") return machineNeedsAttention(machine);
  if (filter === "offline") {
    return machineBadgePresentation(machine).tone === "offline";
  }
  return true;
}

export function fleetCounts(dashboard: Dashboard | null): FleetCounts {
  const machines = dashboard?.machines ?? [];
  const connected = machines.filter(
    (machine) =>
      machine.host.status === "connected" &&
      machineBadgePresentation(machine).tone !== "offline",
  ).length;
  const offline = machines.filter(
    (machine) => machineBadgePresentation(machine).tone === "offline",
  ).length;
  return {
    total: machines.length,
    connected,
    offline,
    attention: machines.filter(machineNeedsAttention).length,
  };
}
