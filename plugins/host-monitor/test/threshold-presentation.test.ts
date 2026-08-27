import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  thresholdColorsEnabled,
  thresholdToneAccessibleLabel,
  thresholdToneForPercent,
  thresholdToneForReading,
} from "../lib/threshold-presentation.ts";

const thresholds = { attentionPercent: 85, criticalPercent: 95 };

describe("Host Monitor threshold presentation", () => {
  it("uses the dashboard's effective attention and critical boundaries", () => {
    assert.equal(thresholdToneForPercent(0, thresholds), "normal");
    assert.equal(thresholdToneForPercent(84.999, thresholds), "normal");
    assert.equal(thresholdToneForPercent(85, thresholds), "attention");
    assert.equal(thresholdToneForPercent(94.999, thresholds), "attention");
    assert.equal(thresholdToneForPercent(95, thresholds), "critical");
    assert.equal(thresholdToneForPercent(120, thresholds), "critical");

    const adjusted = { attentionPercent: 60, criticalPercent: 80 };
    assert.equal(thresholdToneForPercent(59.999, adjusted), "normal");
    assert.equal(thresholdToneForPercent(60, adjusted), "attention");
    assert.equal(thresholdToneForPercent(80, adjusted), "critical");
  });

  it("treats missing and non-finite readings as unavailable", () => {
    assert.equal(thresholdToneForPercent(null, thresholds), "unavailable");
    assert.equal(thresholdToneForPercent(Number.NaN, thresholds), "unavailable");
    assert.equal(
      thresholdToneForPercent(Number.POSITIVE_INFINITY, thresholds),
      "unavailable",
    );
  });

  it("keeps stale and in-flight readings neutral", () => {
    assert.equal(thresholdToneForReading(96, true, thresholds), "critical");
    assert.equal(thresholdToneForReading(96, false, thresholds), "neutral");
    assert.equal(
      thresholdToneForReading(null, false, thresholds),
      "unavailable",
    );
  });

  it("provides non-color threshold wording for accessible meter copy", () => {
    assert.equal(thresholdToneAccessibleLabel("normal"), "normal");
    assert.equal(
      thresholdToneAccessibleLabel("attention"),
      "attention threshold",
    );
    assert.equal(
      thresholdToneAccessibleLabel("critical"),
      "critical threshold",
    );
    assert.equal(thresholdToneAccessibleLabel("neutral"), "not current");
    assert.equal(thresholdToneAccessibleLabel("unavailable"), "unavailable");
  });

  it("defaults colors on until an explicit false setting arrives", () => {
    assert.equal(thresholdColorsEnabled(undefined, true), true);
    assert.equal(thresholdColorsEnabled(undefined, false), true);
    assert.equal(thresholdColorsEnabled({}, false), true);
    assert.equal(
      thresholdColorsEnabled({ sidebarThresholdColors: "false" }, false),
      true,
    );
    assert.equal(
      thresholdColorsEnabled({ sidebarThresholdColors: true }, false),
      true,
    );
    assert.equal(
      thresholdColorsEnabled({ sidebarThresholdColors: false }, false),
      false,
    );
  });
});
