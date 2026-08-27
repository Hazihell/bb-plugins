import {
  formatUsedPercent,
  type ProviderUsage,
  type UsageWindow,
} from "./usage.ts";
import type { CompactLimitOption } from "./preferences.ts";

export interface SidebarUsageWindows {
  fiveHour: UsageWindow | null;
  weekly: UsageWindow | null;
}

export type SidebarUsagePrimaryFallback =
  | "none"
  | "current-alternative"
  | "last-known"
  | "unavailable";

export interface SidebarUsagePrimarySelection {
  window: UsageWindow | null;
  actualKind: CompactLimitOption | null;
  fallback: SidebarUsagePrimaryFallback;
}

function isFiveHourLabel(label: string): boolean {
  const normalized = label.toLowerCase();
  return (
    normalized.includes("five") ||
    normalized.includes("5 hour") ||
    normalized.includes("5-hour") ||
    normalized.includes("current session")
  );
}

function isWeeklyLabel(label: string): boolean {
  const normalized = label.toLowerCase();
  return (
    normalized.includes("week") ||
    normalized.includes("seven day") ||
    normalized.includes("7 day") ||
    normalized.includes("7-day")
  );
}

export function sidebarUsageWindows(
  provider: ProviderUsage,
): SidebarUsageWindows {
  return {
    fiveHour:
      provider.windows.find((window) => isFiveHourLabel(window.label)) ?? null,
    weekly:
      provider.windows.find((window) => isWeeklyLabel(window.label)) ?? null,
  };
}

export function sidebarUsageSummary(provider: ProviderUsage): string {
  const { fiveHour, weekly } = sidebarUsageWindows(provider);
  const fiveHourValue =
    fiveHour === null ? "—" : formatUsedPercent(fiveHour.usedPercent);
  const weeklyValue =
    weekly === null ? "—" : formatUsedPercent(weekly.usedPercent);
  return `${fiveHourValue}% 5h · ${weeklyValue}% wk`;
}

function windowForKind(
  windows: SidebarUsageWindows,
  kind: CompactLimitOption,
): UsageWindow | null {
  return kind === "Weekly" ? windows.weekly : windows.fiveHour;
}

function alternateKind(kind: CompactLimitOption): CompactLimitOption {
  return kind === "Weekly" ? "Five-hour" : "Weekly";
}

export function selectSidebarUsagePrimary(
  currentProvider: ProviderUsage | undefined,
  lastKnownProvider: ProviderUsage | undefined,
  compactLimit: CompactLimitOption,
): SidebarUsagePrimarySelection {
  const alternative = alternateKind(compactLimit);

  if (currentProvider !== undefined) {
    const currentWindows = sidebarUsageWindows(currentProvider);
    const preferredWindow = windowForKind(currentWindows, compactLimit);
    if (preferredWindow !== null) {
      return {
        window: preferredWindow,
        actualKind: compactLimit,
        fallback: "none",
      };
    }

    const alternativeWindow = windowForKind(currentWindows, alternative);
    if (alternativeWindow !== null) {
      return {
        window: alternativeWindow,
        actualKind: alternative,
        fallback: "current-alternative",
      };
    }
  }

  if (lastKnownProvider !== undefined) {
    const lastKnownWindows = sidebarUsageWindows(lastKnownProvider);
    const preferredWindow = windowForKind(lastKnownWindows, compactLimit);
    if (preferredWindow !== null) {
      return {
        window: preferredWindow,
        actualKind: compactLimit,
        fallback: "last-known",
      };
    }

    const alternativeWindow = windowForKind(lastKnownWindows, alternative);
    if (alternativeWindow !== null) {
      return {
        window: alternativeWindow,
        actualKind: alternative,
        fallback: "last-known",
      };
    }
  }

  return { window: null, actualKind: null, fallback: "unavailable" };
}

export function sidebarUsagePrimarySelectionSummary(
  selection: SidebarUsagePrimarySelection,
): string {
  return selection.window === null
    ? "—%"
    : `${formatUsedPercent(selection.window.usedPercent)}%`;
}

export function sidebarUsagePrimaryAccessibleText(
  providerName: string,
  compactLimit: CompactLimitOption,
  selection: SidebarUsagePrimarySelection,
): string {
  const prefix = `${providerName} compact usage: ${compactLimit} configured`;
  const action = "Open five-hour and weekly details.";
  if (selection.window === null || selection.actualKind === null) {
    return `${prefix}; no usage window is available. ${action}`;
  }

  const actual = `${selection.actualKind} ${sidebarUsagePrimarySelectionSummary(selection)}`;
  switch (selection.fallback) {
    case "none":
      return `${prefix}; showing ${actual}. ${action}`;
    case "current-alternative":
      return `${prefix}; showing ${actual} as fallback because ${compactLimit} is not currently reported. ${action}`;
    case "last-known":
      return `${prefix}; showing last-known ${actual} as fallback because no current usage window is reported. ${action}`;
    case "unavailable":
      return `${prefix}; no usage window is available. ${action}`;
  }
}

export function sidebarUsagePrimaryWindow(
  provider: ProviderUsage,
  compactLimit: CompactLimitOption,
): UsageWindow | null {
  return selectSidebarUsagePrimary(provider, undefined, compactLimit).window;
}

export function sidebarUsagePrimarySummary(
  provider: ProviderUsage,
  compactLimit: CompactLimitOption,
): string {
  return sidebarUsagePrimarySelectionSummary(
    selectSidebarUsagePrimary(provider, undefined, compactLimit),
  );
}

export function mergeLastKnownWindows(
  current: ProviderUsage,
  previous: ProviderUsage | undefined,
): ProviderUsage {
  if (previous === undefined || previous.windows.length === 0) return current;

  const currentPair = sidebarUsageWindows(current);
  const previousPair = sidebarUsageWindows(previous);
  const windows = [...current.windows];

  if (currentPair.fiveHour === null && previousPair.fiveHour !== null) {
    windows.unshift(previousPair.fiveHour);
  }
  if (currentPair.weekly === null && previousPair.weekly !== null) {
    windows.push(previousPair.weekly);
  }

  return { ...current, windows };
}
