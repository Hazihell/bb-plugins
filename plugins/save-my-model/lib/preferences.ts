export type ReasoningLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max"
  | "ultra";

export interface Preference {
  projectId: string;
  /** Empty means the browser-wide fallback scope. */
  hostId: string;
  providerId: string;
  model: string;
  reasoningLevel: ReasoningLevel;
}

const PREFIX = "bb.save-my-model.v2";
const LEGACY_PROVIDER_KEY = "bb.promptbox.provider";
const LEGACY_MODEL_KEY = "bb.promptbox.model";
const LEGACY_REASONING_KEY = "bb.promptbox.reasoning";
const LEGACY_PROVIDER_VERSION = "1";
const MAX_PROJECT_ID = 256;
const MAX_HOST_ID = 128;
const MAX_PROVIDER_ID = 128;
const MAX_MODEL = 256;
const MAX_STORED_VALUE = 2_048;
const MAX_LISTED_PREFERENCES = 200;
const CONTROL_CHARACTER = /[\u0000-\u001f\u007f-\u009f]/u;
const validReasoning = new Set<ReasoningLevel>([
  "none",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "ultra",
]);

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function boundedIdentity(value: string, maxLength: number): string | null {
  const normalized = value.trim();
  return normalized.length > 0 &&
    normalized.length <= maxLength &&
    !CONTROL_CHARACTER.test(normalized)
    ? normalized
    : null;
}

function normalizeHostId(hostId: string | null | undefined): string {
  return boundedIdentity(hostId ?? "", MAX_HOST_ID) ?? "";
}

function key(projectId: string, hostId: string, providerId: string): string {
  return `${PREFIX}:${encodeURIComponent(projectId)}:${encodeURIComponent(hostId)}:${encodeURIComponent(providerId)}`;
}

function legacyProviderKey(storageKey: string, providerId: string): string {
  return `${storageKey}-${encodeURIComponent(providerId)}-${LEGACY_PROVIDER_VERSION}`;
}

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function validModel(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= MAX_MODEL &&
    !CONTROL_CHARACTER.test(value)
  );
}

function validReasoningLevel(value: unknown): value is ReasoningLevel {
  return typeof value === "string" && validReasoning.has(value as ReasoningLevel);
}

function readCurrentValue(raw: string | null): {
  model: string;
  reasoningLevel: ReasoningLevel;
} | null {
  if (raw === null || raw.length > MAX_STORED_VALUE) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    return validModel(value.model) && validReasoningLevel(value.reasoningLevel)
      ? { model: value.model, reasoningLevel: value.reasoningLevel }
      : null;
  } catch {
    return null;
  }
}

function readLegacyValue(
  localStorage: Storage,
  providerId: string,
): { model: string; reasoningLevel: ReasoningLevel } | null {
  const providerModel = localStorage.getItem(
    legacyProviderKey(LEGACY_MODEL_KEY, providerId),
  );
  const providerReasoning = localStorage.getItem(
    legacyProviderKey(LEGACY_REASONING_KEY, providerId),
  );
  const ownsUnscoped = localStorage.getItem(LEGACY_PROVIDER_KEY) === providerId;
  const unscopedModel = ownsUnscoped
    ? localStorage.getItem(LEGACY_MODEL_KEY)
    : null;
  const unscopedReasoning = ownsUnscoped
    ? localStorage.getItem(LEGACY_REASONING_KEY)
    : null;
  const model = providerModel ?? unscopedModel;
  const storedReasoning = providerReasoning ?? unscopedReasoning;
  if (model === null && storedReasoning === null) return null;
  const reasoningLevel = storedReasoning === null || storedReasoning === ""
    ? "none"
    : storedReasoning;
  return validModel(model ?? "") && validReasoningLevel(reasoningLevel)
    ? { model: model ?? "", reasoningLevel }
    : null;
}

export function preferenceKey(
  projectId: string,
  hostId: string,
  providerId: string,
): string {
  const project = boundedIdentity(projectId, MAX_PROJECT_ID) ?? "";
  const provider = boundedIdentity(providerId, MAX_PROVIDER_ID) ?? "";
  return key(project, normalizeHostId(hostId), provider);
}

export function readPreference(
  projectId: string,
  hostId: string,
  providerId: string,
): Preference | null {
  const localStorage = storage();
  const project = boundedIdentity(projectId, MAX_PROJECT_ID);
  const provider = boundedIdentity(providerId, MAX_PROVIDER_ID);
  if (localStorage === null || project === null || provider === null) return null;
  const host = normalizeHostId(hostId);
  const value =
    readCurrentValue(localStorage.getItem(key(project, host, provider))) ??
    readLegacyValue(localStorage, provider);
  return value === null
    ? null
    : { projectId: project, hostId: host, providerId: provider, ...value };
}

export function writePreference(preference: Preference): void {
  const localStorage = storage();
  const project = boundedIdentity(preference.projectId, MAX_PROJECT_ID);
  const provider = boundedIdentity(preference.providerId, MAX_PROVIDER_ID);
  if (
    localStorage === null ||
    project === null ||
    provider === null ||
    !validModel(preference.model) ||
    !validReasoningLevel(preference.reasoningLevel)
  ) {
    return;
  }
  localStorage.setItem(
    key(project, normalizeHostId(preference.hostId), provider),
    JSON.stringify({
      model: preference.model,
      reasoningLevel: preference.reasoningLevel,
    }),
  );
}

export function clearPreferences(): void {
  const localStorage = storage();
  if (localStorage === null) return;
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const storedKey = localStorage.key(index);
    if (storedKey?.startsWith(`${PREFIX}:`)) localStorage.removeItem(storedKey);
  }
}

export function listPreferences(): Preference[] {
  const localStorage = storage();
  const result: Preference[] = [];
  if (localStorage === null) return result;
  for (
    let index = 0;
    index < localStorage.length && result.length < MAX_LISTED_PREFERENCES;
    index += 1
  ) {
    const storedKey = localStorage.key(index);
    if (!storedKey?.startsWith(`${PREFIX}:`)) continue;
    const parts = storedKey.split(":");
    if (parts.length !== 4) continue;
    const project = safeDecode(parts[1]);
    const host = safeDecode(parts[2]);
    const provider = safeDecode(parts[3]);
    if (project === null || host === null || provider === null) continue;
    const preference = readPreference(project, host, provider);
    if (preference !== null) result.push(preference);
  }
  return result;
}
