export interface HealthThresholds {
  attentionPercent: number;
  criticalPercent: number;
}

export interface RawHealthThresholdSettings {
  attentionThresholdPercent?: unknown;
  criticalThresholdPercent?: unknown;
}

export const DEFAULT_HEALTH_THRESHOLDS: Readonly<HealthThresholds> = {
  attentionPercent: 85,
  criticalPercent: 95,
};

function numericPercent(value: unknown): number | null {
  if (typeof value === "string" && value.trim().length === 0) return null;
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = typeof value === "number" ? value : Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Convert the settings form's strings into one safe, ordered threshold pair.
 * Invalid or contradictory edits fall back together so every surface and the
 * server-owned health calculation continue to agree.
 */
export function resolveHealthThresholds(
  input: RawHealthThresholdSettings = {},
): HealthThresholds {
  const attentionPercent = numericPercent(input.attentionThresholdPercent);
  const criticalPercent = numericPercent(input.criticalThresholdPercent);
  if (
    attentionPercent === null ||
    criticalPercent === null ||
    attentionPercent < 1 ||
    attentionPercent >= 100 ||
    criticalPercent <= 1 ||
    criticalPercent > 100 ||
    attentionPercent >= criticalPercent
  ) {
    return { ...DEFAULT_HEALTH_THRESHOLDS };
  }
  return { attentionPercent, criticalPercent };
}

export function sameHealthThresholds(
  left: HealthThresholds,
  right: HealthThresholds,
): boolean {
  return (
    left.attentionPercent === right.attentionPercent &&
    left.criticalPercent === right.criticalPercent
  );
}
