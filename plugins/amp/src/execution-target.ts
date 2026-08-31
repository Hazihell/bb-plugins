export const AMP_AGENT = {
  agentId: "amp",
  providerId: "acp-amp",
  displayName: "Amp",
} as const;

/** Exact legacy identity removed by automatic provisioning after the one-provider migration. */
export const OBSOLETE_AMP_ORB_AGENT = {
  agentId: "amp-orb",
  providerId: "acp-amp-orb",
} as const;

export type AmpExecutionTarget = "local" | "orb";

/** Deprecated provider-wide setting removed from managed entries during provisioning. */
export const AMP_ACP_EXECUTOR_ENV = "AMP_ACP_EXECUTOR";

/** Optional Amp project override for Orb. Omit it to infer from cwd Git remotes. */
export const AMP_ACP_ORB_PROJECT_ENV = "AMP_ACP_ORB_PROJECT";

export function parseStoredExecutionTarget(value: unknown): AmpExecutionTarget | null {
  if (value === "local" || value === "orb") return value;
  return null;
}
