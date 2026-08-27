import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Dashboard, MachineRow } from "../contract.ts";
import {
  fleetCounts,
  machineBadgePresentation,
  machineMatchesFleetFilter,
  machineNeedsAttention,
} from "../lib/fleet-presentation.ts";

function machine(
  id: string,
  overrides: Partial<Pick<MachineRow, "health" | "sampleState" | "snapshot">> & {
    status?: MachineRow["host"]["status"];
  } = {},
): MachineRow {
  const status = overrides.status ?? "connected";
  return {
    host: { id, name: `Host ${id}`, status, lastSeenAt: null },
    snapshot: overrides.snapshot ?? null,
    sampleState:
      overrides.sampleState ?? (status === "connected" ? "fresh" : "offline"),
    health:
      overrides.health ?? (status === "connected" ? "healthy" : "offline"),
    error: null,
    alert: null,
  };
}

function dashboard(machines: MachineRow[]): Dashboard {
  return {
    generatedAtMs: 1,
    refreshIntervalMs: 10_000,
    thresholds: { attentionPercent: 85, criticalPercent: 95 },
    machines,
  };
}

describe("Host Monitor fleet presentation", () => {
  it("counts stale and failed samples as attention exactly once", () => {
    const stale = machine("stale", { sampleState: "stale" });
    const failed = machine("failed", {
      health: "unavailable",
      sampleState: "error",
    });
    const critical = machine("critical", { health: "critical" });
    const offline = machine("offline", { status: "disconnected" });

    assert.deepEqual(
      fleetCounts(dashboard([stale, failed, critical, offline])),
      { total: 4, connected: 3, offline: 1, attention: 3 },
    );
    assert.equal(machineNeedsAttention(stale), true);
    assert.equal(machineNeedsAttention(failed), true);
    assert.equal(machineNeedsAttention(critical), true);
    assert.equal(machineNeedsAttention(offline), false);
  });

  it("includes stale and failed samples in the Attention filter", () => {
    const stale = machine("stale", { sampleState: "stale" });
    const failed = machine("failed", { sampleState: "error" });
    const healthy = machine("healthy");

    assert.equal(machineMatchesFleetFilter(stale, "attention"), true);
    assert.equal(machineMatchesFleetFilter(failed, "attention"), true);
    assert.equal(machineMatchesFleetFilter(healthy, "attention"), false);
    assert.equal(machineMatchesFleetFilter(healthy, "all"), true);
  });

  it("keeps a connected host waiting for its first sample neutral", () => {
    const firstSample = machine("first-sample", {
      health: "unavailable",
      sampleState: "sampling",
    });

    assert.equal(machineNeedsAttention(firstSample), false);
    assert.equal(machineMatchesFleetFilter(firstSample, "attention"), false);
    assert.deepEqual(fleetCounts(dashboard([firstSample])), {
      total: 1,
      connected: 1,
      offline: 0,
      attention: 0,
    });

    const refreshingCritical = machine("refreshing-critical", {
      health: "critical",
      sampleState: "sampling",
    });
    assert.equal(machineNeedsAttention(refreshingCritical), false);
    assert.deepEqual(machineBadgePresentation(refreshingCritical), {
      label: "Sampling",
      tone: "unavailable",
      busy: true,
    });
  });

  it("uses freshness-aware badge copy and attention styling", () => {
    assert.deepEqual(
      machineBadgePresentation(machine("stale", { sampleState: "stale" })),
      { label: "Stale reading", tone: "attention", busy: false },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("failed", { sampleState: "error" })),
      { label: "Last known", tone: "attention", busy: false },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("healthy")),
      { label: "Healthy", tone: "healthy", busy: false },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("sampling", { sampleState: "sampling" })),
      { label: "Sampling", tone: "unavailable", busy: true },
    );
  });
});
