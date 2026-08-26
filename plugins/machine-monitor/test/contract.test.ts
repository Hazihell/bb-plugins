import assert from "node:assert/strict";
import test from "node:test";
import { networkSnapshotSchema } from "../contract.ts";

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
