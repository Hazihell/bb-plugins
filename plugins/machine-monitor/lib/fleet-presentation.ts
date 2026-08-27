import type { Dashboard, MachineRow } from "../contract.ts";

export type FleetFilter = "all" | "attention" | "offline";

export type MachineBadgeTone = MachineRow["health"];

export interface MachineBadgePresentation {
  label: string;
  tone: MachineBadgeTone;
  busy: boolean;
}

export interface FleetCounts {
  total: number;
  connected: number;
  offline: number;
  attention: number;
}

const HEALTH_LABEL: Readonly<Record<MachineRow["health"], string>> = {
  healthy: "Healthy",
  attention: "Attention",
  critical: "Critical",
  offline: "Offline",
  unavailable: "Unavailable",
};

/** A stale or failed refresh needs attention even when its last sample was healthy. */
export function machineNeedsAttention(machine: MachineRow): boolean {
  if (machine.sampleState === "sampling") return false;
  return (
    machine.health === "attention" ||
    machine.health === "critical" ||
    machine.health === "unavailable" ||
    machine.sampleState === "stale" ||
    machine.sampleState === "error"
  );
}

/** Keep resource severity and telemetry freshness from contradicting each other. */
export function machineBadgePresentation(
  machine: MachineRow,
): MachineBadgePresentation {
  if (machine.sampleState === "sampling") {
    return { label: "Sampling", tone: "unavailable", busy: true };
  }
  if (machine.sampleState === "stale") {
    return { label: "Stale reading", tone: "attention", busy: false };
  }
  if (machine.sampleState === "error") {
    return { label: "Last known", tone: "attention", busy: false };
  }
  return {
    label: HEALTH_LABEL[machine.health],
    tone: machine.health,
    busy: false,
  };
}

export function machineMatchesFleetFilter(
  machine: MachineRow,
  filter: FleetFilter,
): boolean {
  if (filter === "attention") return machineNeedsAttention(machine);
  if (filter === "offline") return machine.health === "offline";
  return true;
}

export function fleetCounts(dashboard: Dashboard | null): FleetCounts {
  const machines = dashboard?.machines ?? [];
  const connected = machines.filter(
    (machine) => machine.host.status === "connected",
  ).length;
  return {
    total: machines.length,
    connected,
    offline: machines.length - connected,
    attention: machines.filter(machineNeedsAttention).length,
  };
}
