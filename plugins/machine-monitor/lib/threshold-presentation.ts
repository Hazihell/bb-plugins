import type { HealthThresholds } from "./thresholds.ts";

export type ThresholdTone =
  | "normal"
  | "attention"
  | "critical"
  | "neutral"
  | "unavailable";

export type ThresholdSettings = Readonly<
  Record<string, string | boolean>
>;

/**
 * Keep every Host Monitor surface on the same resource thresholds. Values
 * outside the display range still describe their real severity; renderers can
 * clamp them independently when sizing a rail or gauge.
 */
export function thresholdToneForPercent(
  percent: number | null,
  thresholds: HealthThresholds,
): ThresholdTone {
  if (percent === null || !Number.isFinite(percent)) return "unavailable";
  if (percent >= thresholds.criticalPercent) return "critical";
  if (percent >= thresholds.attentionPercent) return "attention";
  return "normal";
}

/** Only current samples carry resource-threshold color. */
export function thresholdToneForReading(
  percent: number | null,
  isFresh: boolean,
  thresholds: HealthThresholds,
): ThresholdTone {
  const tone = thresholdToneForPercent(percent, thresholds);
  return isFresh || tone === "unavailable" ? tone : "neutral";
}

export function thresholdToneAccessibleLabel(
  tone: ThresholdTone,
):
  | "normal"
  | "attention threshold"
  | "critical threshold"
  | "not current"
  | "unavailable" {
  if (tone === "attention") return "attention threshold";
  if (tone === "critical") return "critical threshold";
  if (tone === "neutral") return "not current";
  return tone;
}

/**
 * The setting is opt-out. That keeps threshold colors on during the initial
 * settings request and if settings are temporarily unavailable.
 */
export function thresholdColorsEnabled(
  values: ThresholdSettings | undefined,
  isLoading: boolean,
): boolean {
  return isLoading || values?.sidebarThresholdColors !== false;
}
