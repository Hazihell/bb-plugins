import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatNetworkRate,
  networkRateSummary,
} from "../lib/network-presentation.ts";

describe("Host Monitor network presentation", () => {
  it("formats rates compactly using binary units", () => {
    assert.equal(formatNetworkRate(0), "0 B/s");
    assert.equal(formatNetworkRate(512), "512 B/s");
    assert.equal(formatNetworkRate(1_024), "1 KB/s");
    assert.equal(formatNetworkRate(1_536), "1.5 KB/s");
    assert.equal(formatNetworkRate(12 * 1_024), "12 KB/s");
    assert.equal(formatNetworkRate(2.25 * 1_024 * 1_024), "2.3 MB/s");
  });

  it("uses an unavailable marker for absent or invalid rates", () => {
    assert.equal(formatNetworkRate(null), "—");
    assert.equal(formatNetworkRate(-1), "—");
    assert.equal(formatNetworkRate(Number.POSITIVE_INFINITY), "—");
  });

  it("builds a shared receive and send summary", () => {
    assert.deepEqual(networkRateSummary(2_048, 512), {
      receive: "2 KB/s",
      send: "512 B/s",
      accessibleText: "Network receive 2 KB/s; send 512 B/s",
      available: true,
    });
    assert.deepEqual(networkRateSummary(null, null), {
      receive: "—",
      send: "—",
      accessibleText: "Network throughput unavailable",
      available: false,
    });
    assert.equal(networkRateSummary(-1, null).available, false);
  });
});
