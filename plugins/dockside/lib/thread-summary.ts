import type { PluginSidebarThread } from "@bb/plugin-sdk";
import { threadIsWorking } from "./inbox.ts";

export const FINAL_SUMMARY_MAX_CHARS = 120;

/** A safe, single-line outcome for the narrow sidebar. */
export function normalizeFinalOutput(
  value: string | null | undefined,
  maxChars = FINAL_SUMMARY_MAX_CHARS,
): string | null {
  if (value == null) return null;
  if (!Number.isInteger(maxChars) || maxChars < 1) {
    throw new RangeError("maxChars must be a positive integer.");
  }

  const withoutControls = Array.from(value, (character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint <= 31 || (codePoint >= 127 && codePoint <= 159)
      ? " "
      : character;
  }).join("");
  const normalized = withoutControls
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length === 0) return null;
  if (normalized.length <= maxChars) return normalized;
  if (maxChars === 1) return "…";
  return `${normalized.slice(0, maxChars - 1).trimEnd()}…`;
}

export interface SummaryCacheLookup {
  found: boolean;
  text: string | null;
}

/** Small process-local LRU; null is cached as deliberately as text. */
export class BoundedThreadSummaryCache {
  readonly #entries = new Map<string, string | null>();
  readonly maxEntries: number;

  constructor(maxEntries = 200) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError("maxEntries must be a positive integer.");
    }
    this.maxEntries = maxEntries;
  }

  get size(): number {
    return this.#entries.size;
  }

  get(threadId: string, updatedAt: number): SummaryCacheLookup {
    const key = summaryCacheKey(threadId, updatedAt);
    if (!this.#entries.has(key)) return { found: false, text: null };
    const text = this.#entries.get(key) ?? null;
    this.#entries.delete(key);
    this.#entries.set(key, text);
    return { found: true, text };
  }

  set(threadId: string, updatedAt: number, text: string | null): void {
    const key = summaryCacheKey(threadId, updatedAt);
    this.#entries.delete(key);
    this.#entries.set(key, text);
    while (this.#entries.size > this.maxEntries) {
      const oldest = this.#entries.keys().next().value as string | undefined;
      if (oldest === undefined) break;
      this.#entries.delete(oldest);
    }
  }

  deleteThread(threadId: string): void {
    const prefix = `${threadId}:`;
    for (const key of this.#entries.keys()) {
      if (key.startsWith(prefix)) this.#entries.delete(key);
    }
  }
}

/** Family activity belongs on the root, not repeated beside every child. */
export function familyWaitingForAgents(
  children: readonly PluginSidebarThread[],
): boolean {
  return children.some(threadIsWorking);
}

function summaryCacheKey(threadId: string, updatedAt: number): string {
  return `${threadId}:${updatedAt}`;
}
