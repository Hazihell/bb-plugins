import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateNetworkThroughput,
  parseLinuxNetworkCounters,
  parseMacNetworkCounters,
  parseWindowsNetworkCounters,
  selectNetworkCounters,
  type NetworkCounterSnapshot,
} from "../lib/network-throughput.ts";

function counters(
  entries: ReadonlyArray<
    readonly [string, receivedBytes: bigint, sentBytes: bigint]
  >,
): NetworkCounterSnapshot {
  return new Map(
    entries.map(([name, receivedBytes, sentBytes]) => [
      name,
      { receivedBytes, sentBytes },
    ]),
  );
}

test("parses Linux counters, excludes loopback, and handles alias colons", () => {
  const parsed = parseLinuxNetworkCounters(`
Inter-|   Receive                                                |  Transmit
 face |bytes packets errs drop fifo frame compressed multicast|bytes packets errs drop fifo colls carrier compressed
    lo: 500 1 0 0 0 0 0 0 600 1 0 0 0 0 0 0
eth0:1: 1000 2 0 0 0 0 0 0 2000 3 0 0 0 0 0 0
 veth0: 3000 4 0 0 0 0 0 0 4000 5 0 0 0 0 0 0
`);

  assert.deepEqual(
    [...parsed],
    [
      ["eth0:1", { receivedBytes: 1_000n, sentBytes: 2_000n }],
      ["veth0", { receivedBytes: 3_000n, sentBytes: 4_000n }],
    ],
  );
  assert.throws(
    () => parseLinuxNetworkCounters("lo: 1 2 3"),
    /interface header/u,
  );
  assert.throws(
    () =>
      parseLinuxNetworkCounters(`
Inter-| Receive | Transmit
face |bytes packets errs drop fifo frame compressed multicast|bytes packets errs drop fifo colls carrier compressed
eth0: 18446744073709551616 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0
`),
    /64-bit/u,
  );
});

test("parses macOS counters once per interface and excludes loopback", () => {
  const parsed = parseMacNetworkCounters(`
Name  Mtu   Network       Address            Ipkts Ierrs Ibytes Opkts Oerrs Obytes Coll
lo0   16384 <Link#1>      00:00:00:00:00:00  10    0     100    10    0     100    0
en0   1500  <Link#4>      aa:bb:cc:dd:ee:ff  20    0     1000   30    0     2000   0
en0   1500  192.0.2       192.0.2.10         21    -     1010   31    -     2020   -
utun3* 1380 <Link#7>      none               3     0     300    4     0     400    0
`);

  assert.deepEqual(
    [...parsed],
    [
      ["en0", { receivedBytes: 1_010n, sentBytes: 2_020n }],
      ["utun3", { receivedBytes: 300n, sentBytes: 400n }],
    ],
  );
  assert.throws(() => parseMacNetworkCounters("Name Mtu Network"), /header/u);
});

test("parses Windows UInt64 strings without leaking adapter details", () => {
  const parsed = parseWindowsNetworkCounters(
    JSON.stringify([
      {
        id: "Ethernet",
        receivedBytes: "90071992547409930",
        sentBytes: "90071992547409940",
      },
      {
        id: "Loopback Pseudo-Interface 1",
        receivedBytes: "100",
        sentBytes: "200",
      },
    ]),
  );

  assert.deepEqual([...parsed], [
    [
      "ethernet",
      {
        receivedBytes: 90_071_992_547_409_930n,
        sentBytes: 90_071_992_547_409_940n,
      },
    ],
  ]);
  assert.throws(
    () =>
      parseWindowsNetworkCounters(
        '{"id":"Ethernet","receivedBytes":42,"sentBytes":"1"}',
      ),
    /invalid row/u,
  );
  assert.throws(
    () =>
      parseWindowsNetworkCounters(
        '[{"id":"Ethernet","receivedBytes":"1","sentBytes":"2"},{"id":"ETHERNET","receivedBytes":"3","sentBytes":"4"}]',
      ),
    /repeat/u,
  );
});

test("selects only interfaces that own useful addresses", () => {
  const parsed = counters([
    ["ethernet", 100n, 200n],
    ["docker0", 300n, 400n],
    ["veth0", 500n, 600n],
  ]);

  assert.deepEqual(
    [...selectNetworkCounters(parsed, new Set(["ethernet", "docker0"]))],
    [
      ["ethernet", { receivedBytes: 100n, sentBytes: 200n }],
      ["docker0", { receivedBytes: 300n, sentBytes: 400n }],
    ],
  );
});

test("derives rounded bytes-per-second from one bounded sample window", () => {
  const result = calculateNetworkThroughput(
    counters([["ethernet", 1_000n, 2_000n]]),
    counters([["ethernet", 1_250n, 2_500n]]),
    250,
  );

  assert.deepEqual(result, {
    receiveBytesPerSecond: 1_000,
    sendBytesPerSecond: 2_000,
    partial: false,
  });
});

test("reports a stable zero delta as zero bytes per second", () => {
  assert.deepEqual(
    calculateNetworkThroughput(
      counters([["ethernet", 1_000n, 2_000n]]),
      counters([["ethernet", 1_000n, 2_000n]]),
      300,
    ),
    {
      receiveBytesPerSecond: 0,
      sendBytesPerSecond: 0,
      partial: false,
    },
  );
});

test("uses stable interfaces only when topology or one counter changes", () => {
  const result = calculateNetworkThroughput(
    counters([
      ["stable", 1_000n, 2_000n],
      ["reset", 9_000n, 9_000n],
      ["removed", 10n, 20n],
    ]),
    counters([
      ["stable", 1_500n, 2_250n],
      ["reset", 10n, 20n],
      ["added", 50_000n, 80_000n],
    ]),
    500,
  );

  assert.deepEqual(result, {
    receiveBytesPerSecond: 1_000,
    sendBytesPerSecond: 500,
    partial: true,
  });
});

test("fails closed when no stable safe rate can be calculated", () => {
  assert.throws(
    () => calculateNetworkThroughput(new Map(), new Map(), 300),
    /No eligible/u,
  );
  assert.throws(
    () =>
      calculateNetworkThroughput(
        counters([["reset", 10n, 20n]]),
        counters([["reset", 1n, 2n]]),
        300,
      ),
    /interfaces changed/u,
  );
  assert.throws(
    () =>
      calculateNetworkThroughput(
        counters([["ethernet", 0n, 0n]]),
        counters([["ethernet", 1n, 1n]]),
        0,
      ),
    /duration/u,
  );
  assert.throws(
    () =>
      calculateNetworkThroughput(
        counters([["ethernet", 0n, 0n]]),
        counters([
          ["ethernet", BigInt(Number.MAX_SAFE_INTEGER) + 1n, 1n],
        ]),
        1_000,
      ),
    /JSON-safe/u,
  );
});
