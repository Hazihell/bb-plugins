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
  overrides: Partial<
    Pick<MachineRow, "alert" | "error" | "health" | "sampleState" | "snapshot">
  > & {
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
    error: overrides.error ?? null,
    alert: overrides.alert ?? null,
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

    const disconnectedRetained = machine("disconnected-retained", {
      status: "disconnected",
      health: "critical",
      sampleState: "stale",
    });
    assert.equal(machineNeedsAttention(disconnectedRetained), false);
    assert.equal(
      machineMatchesFleetFilter(disconnectedRetained, "attention"),
      false,
    );
    assert.equal(machineMatchesFleetFilter(disconnectedRetained, "offline"), true);
    assert.deepEqual(fleetCounts(dashboard([disconnectedRetained])), {
      total: 1,
      connected: 0,
      offline: 1,
      attention: 0,
    });
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
      reason: "Collecting a fresh telemetry sample.",
    });
  });

  it("uses freshness-aware copy and safe explanations", () => {
    assert.deepEqual(
      machineBadgePresentation(machine("stale", { sampleState: "stale" })),
      {
        label: "Stale reading",
        tone: "attention",
        busy: false,
        reason: "The latest reading is older than expected.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(
        machine("failed", {
          error: "secret=/home/operator/.ssh/id_ed25519",
          sampleState: "error",
        }),
      ),
      {
        label: "Last known",
        tone: "attention",
        busy: false,
        reason: "The latest refresh failed, so no current metrics are available.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("healthy")),
      {
        label: "Healthy",
        tone: "healthy",
        busy: false,
        reason: "No monitored resource currently meets an alert condition.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("critical", { health: "critical" })),
      {
        label: "Critical",
        tone: "critical",
        busy: false,
        reason: "A monitored resource crossed a critical threshold.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(
        machine("attention-alert", {
          health: "attention",
          alert: {
            metric: "memory",
            message: "Memory pressure is high — 2 GB available.",
          },
          snapshot: {
            memory: { usagePercent: 88 },
          } as unknown as MachineRow["snapshot"],
        }),
      ),
      {
        label: "Needs attention",
        tone: "attention",
        busy: false,
        reason: "Memory usage is high at 88%, above the attention threshold.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(
        machine("critical-alert", {
          health: "critical",
          alert: {
            metric: "disk",
            message: "System disk is nearly full — 900 MB free.",
          },
          snapshot: {
            disk: { usagePercent: 97 },
          } as unknown as MachineRow["snapshot"],
        }),
      ),
      {
        label: "Critical",
        tone: "critical",
        busy: false,
        reason: "Disk usage is high at 97%, above the critical threshold.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("offline", { status: "disconnected" })),
      {
        label: "Offline",
        tone: "offline",
        busy: false,
        reason: "Live metrics are unavailable while this host is offline.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(
        machine("unavailable", { health: "unavailable", sampleState: "fresh" }),
      ),
      {
        label: "Unavailable",
        tone: "unavailable",
        busy: false,
        reason: "Current host health details are unavailable.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation(machine("sampling", { sampleState: "sampling" })),
      {
        label: "Sampling",
        tone: "unavailable",
        busy: true,
        reason: "Collecting a fresh telemetry sample.",
      },
    );
    assert.doesNotMatch(
      machineBadgePresentation(
        machine("failed-private", {
          error:
            '<img src=x onerror="alert(1)"> secret=/home/operator/.ssh/id_ed25519 token=abc123',
          sampleState: "error",
        }),
      ).reason,
      /img|onerror|secret|operator|id_ed25519|token|abc123/u,
    );
    const maliciousAlert = machine("malicious-alert", {
      health: "critical",
      alert: {
        metric: "disk",
        message:
          '<img src=x onerror="alert(1)"> secret=/home/operator/.ssh/id_ed25519 token=abc123',
      },
      snapshot: {
        disk: { usagePercent: 96 },
      } as unknown as MachineRow["snapshot"],
    });
    const maliciousPresentation = machineBadgePresentation(maliciousAlert);
    assert.equal(
      maliciousPresentation.reason,
      "Disk usage is high at 96%, above the critical threshold.",
    );
    assert.doesNotMatch(
      maliciousPresentation.reason,
      /img|onerror|secret|operator|id_ed25519|token|abc123/u,
    );
  });

  it("normalizes disconnected and unexpected runtime states to safe badge copy", () => {
    assert.deepEqual(
      machineBadgePresentation(
        machine("disconnected-stale", {
          status: "disconnected",
          health: "critical",
          sampleState: "stale",
        }),
      ),
      {
        label: "Offline",
        tone: "offline",
        busy: false,
        reason: "Live metrics are unavailable while this host is offline.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation({
        ...machine("unknown-health"),
        health: "future-health",
      } as unknown as MachineRow),
      {
        label: "Unavailable",
        tone: "unavailable",
        busy: false,
        reason: "Current host health details are unavailable.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation({
        ...machine("unknown-sample", { health: "critical" }),
        sampleState: "future-sample",
      } as unknown as MachineRow),
      {
        label: "Unavailable",
        tone: "unavailable",
        busy: false,
        reason: "Current host health details are unavailable.",
      },
    );
    assert.deepEqual(
      machineBadgePresentation({
        ...machine("unknown-status", { health: "critical" }),
        host: {
          ...machine("unknown-status").host,
          status: "future-status",
        },
      } as unknown as MachineRow),
      {
        label: "Unavailable",
        tone: "unavailable",
        busy: false,
        reason: "Current host health details are unavailable.",
      },
    );
    for (const malformed of [
      { host: { status: null } },
      { sampleState: 7 },
      { sampleState: "FRESH" },
      { health: undefined },
    ]) {
      const base = machine("malformed-runtime");
      const candidate = {
        ...base,
        ...malformed,
        host: {
          ...base.host,
          ...malformed.host,
        },
      } as unknown as MachineRow;
      assert.deepEqual(machineBadgePresentation(candidate), {
        label: "Unavailable",
        tone: "unavailable",
        busy: false,
        reason: "Current host health details are unavailable.",
      });
    }
    assert.deepEqual(
      machineBadgePresentation({
        ...machine("malformed-alert", { health: "attention" }),
        alert: {
          metric: "memory",
          message: 42,
        },
      } as unknown as MachineRow),
      {
        label: "Needs attention",
        tone: "attention",
        busy: false,
        reason: "A monitored resource needs attention.",
      },
    );
  });
});
