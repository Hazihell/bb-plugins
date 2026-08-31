import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_HEALTH_THRESHOLDS,
  resolveHealthThresholds,
  sameHealthThresholds,
} from "../lib/thresholds.ts";

describe("health threshold settings", () => {
  it("uses the established 85/95 defaults when values are absent", () => {
    assert.deepEqual(resolveHealthThresholds(), DEFAULT_HEALTH_THRESHOLDS);
  });

  it("accepts ordered numeric strings, decimals, and inclusive outer bounds", () => {
    assert.deepEqual(
      resolveHealthThresholds({
        attentionThresholdPercent: "72.5",
        criticalThresholdPercent: "91",
      }),
      { attentionPercent: 72.5, criticalPercent: 91 },
    );
    assert.deepEqual(
      resolveHealthThresholds({
        attentionThresholdPercent: "1",
        criticalThresholdPercent: "100",
      }),
      { attentionPercent: 1, criticalPercent: 100 },
    );
  });

  it("falls back as one pair for empty, non-finite, out-of-range, or reversed values", () => {
    for (const input of [
      { attentionThresholdPercent: "", criticalThresholdPercent: "90" },
      { attentionThresholdPercent: "yellow", criticalThresholdPercent: "90" },
      { attentionThresholdPercent: "0", criticalThresholdPercent: "90" },
      { attentionThresholdPercent: "80", criticalThresholdPercent: "101" },
      { attentionThresholdPercent: "90", criticalThresholdPercent: "90" },
      { attentionThresholdPercent: "95", criticalThresholdPercent: "85" },
      { attentionThresholdPercent: Number.NaN, criticalThresholdPercent: 90 },
    ]) {
      assert.deepEqual(resolveHealthThresholds(input), DEFAULT_HEALTH_THRESHOLDS);
    }
  });

  it("compares effective pairs without relying on object identity", () => {
    assert.equal(
      sameHealthThresholds(
        { attentionPercent: 70, criticalPercent: 90 },
        { attentionPercent: 70, criticalPercent: 90 },
      ),
      true,
    );
    assert.equal(
      sameHealthThresholds(
        { attentionPercent: 70, criticalPercent: 90 },
        { attentionPercent: 75, criticalPercent: 90 },
      ),
      false,
    );
  });
});
