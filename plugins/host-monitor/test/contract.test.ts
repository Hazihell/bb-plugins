import assert from "node:assert/strict";
import test from "node:test";
import {
  machineRowSchema,
  networkSnapshotSchema,
  processListResultSchema,
  processRowSchema,
} from "../contract.ts";

test("bounds every host-status explanation source", () => {
  const base = {
    host: {
      id: "host-alpha",
      name: "Alpha",
      status: "connected",
      lastSeenAt: null,
    },
    snapshot: null,
    sampleState: "error",
    health: "unavailable",
    error: null,
    alert: null,
  } as const;
  assert.deepEqual(machineRowSchema.parse(base), base);
  assert.throws(() =>
    machineRowSchema.parse({ ...base, error: "e".repeat(241) }),
  );
  assert.throws(() =>
    machineRowSchema.parse({
      ...base,
      alert: { metric: "disk", message: "a".repeat(241) },
    }),
  );
});

test("network snapshot accepts only a canonical primary IP or null", () => {
  const throughput = {
    receiveBytesPerSecond: 1_024,
    sendBytesPerSecond: 512,
  } as const;
  assert.deepEqual(
    networkSnapshotSchema.parse({
      primaryIpAddress: "192.0.2.42",
      ...throughput,
    }),
    { primaryIpAddress: "192.0.2.42", ...throughput },
  );
  assert.deepEqual(
    networkSnapshotSchema.parse({
      primaryIpAddress: "2001:db8::42",
      ...throughput,
    }),
    { primaryIpAddress: "2001:db8::42", ...throughput },
  );
  assert.deepEqual(
    networkSnapshotSchema.parse({
      primaryIpAddress: null,
      receiveBytesPerSecond: null,
      sendBytesPerSecond: null,
    }),
    {
      primaryIpAddress: null,
      receiveBytesPerSecond: null,
      sendBytesPerSecond: null,
    },
  );
});

test("network snapshot rejects malformed addresses and extra interface data", () => {
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: "999.1.2.3",
      receiveBytesPerSecond: null,
      sendBytesPerSecond: null,
    }),
  );
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: "2001:db8::42%ethernet0",
      receiveBytesPerSecond: null,
      sendBytesPerSecond: null,
    }),
  );
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: "192.0.2.42",
      receiveBytesPerSecond: 1,
      sendBytesPerSecond: 1,
      mac: "00:00:00:00:00:00",
    }),
  );
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: "192.0.2.42",
      receiveBytesPerSecond: 1,
      sendBytesPerSecond: 1,
      interface: "ethernet0",
    }),
  );
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: null,
      receiveBytesPerSecond: -1,
      sendBytesPerSecond: 0,
    }),
  );
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: null,
      receiveBytesPerSecond: Number.MAX_SAFE_INTEGER + 1,
      sendBytesPerSecond: 0,
    }),
  );
  assert.throws(() =>
    networkSnapshotSchema.parse({
      primaryIpAddress: null,
      receiveBytesPerSecond: 0,
      sendBytesPerSecond: null,
    }),
  );
});

test("process rows expose only the bounded privacy-safe projection", () => {
  const row = {
    pid: 42,
    name: "worker",
    identity: "i".repeat(43),
    cpuPercent: 12,
    rssBytes: 1_024,
    memoryPercent: 1,
    startedAtMs: 1_000,
    ownerCategory: "same-user",
    allowedTerminationModes: ["graceful", "force"],
    blockedReason: null,
  } as const;
  assert.deepEqual(processRowSchema.parse(row), row);
  for (const secretField of ["argv", "path", "cwd", "environment", "username", "uid"]) {
    assert.throws(() =>
      processRowSchema.parse({ ...row, [secretField]: "must-not-cross-RPC" }),
    );
  }
});

test("process row protection fields cannot contradict each other", () => {
  const base = {
    pid: 42,
    name: "worker",
    identity: "i".repeat(43),
    cpuPercent: 12,
    rssBytes: 1_024,
    memoryPercent: 1,
    startedAtMs: 1_000,
    ownerCategory: "same-user",
  } as const;
  assert.throws(() =>
    processRowSchema.parse({
      ...base,
      allowedTerminationModes: [],
      blockedReason: null,
    }),
  );
  assert.deepEqual(
    processRowSchema.parse({
      ...base,
      identity: null,
      allowedTerminationModes: [],
      blockedReason: "elevated-session",
    }),
    {
      ...base,
      identity: null,
      allowedTerminationModes: [],
      blockedReason: "elevated-session",
    },
  );
  assert.throws(() =>
    processRowSchema.parse({
      ...base,
      identity: null,
      allowedTerminationModes: ["force"],
      blockedReason: null,
    }),
  );
});

test("process list result is strict and bounded", () => {
  assert.throws(() =>
    processListResultSchema.parse({
      outcome: "ok",
      host: {
        id: "host-alpha",
        name: "Alpha",
        status: "connected",
        platform: "linux",
        address: "192.0.2.1",
      },
      sampledAtMs: 1,
      elevated: false,
      totalCount: 0,
      truncated: false,
      processes: [],
    }),
  );
});
