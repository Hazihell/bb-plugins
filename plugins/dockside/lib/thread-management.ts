import type { PluginSidebarThread } from "@bb/plugin-sdk";
import { threadIsWorking, type ProjectThreadGroup, type ThreadFamily } from "./inbox.ts";

export const DAY_MS = 24 * 60 * 60 * 1_000;

export const THREAD_FILTER_PRESETS = [
  "all",
  "working",
  "needs-you",
  "unread",
  "quiet",
  "quiet-1d",
  "quiet-7d",
] as const;

export type ThreadFilterPreset = (typeof THREAD_FILTER_PRESETS)[number];

export const THREAD_FILTER_LABELS: Readonly<
  Record<ThreadFilterPreset, string>
> = {
  all: "All",
  working: "Working",
  "needs-you": "Needs you",
  unread: "Unread",
  quiet: "Quiet",
  "quiet-1d": "Quiet 1d+",
  "quiet-7d": "Quiet 7d+",
};

export type BulkProtectionReason =
  | "current"
  | "working"
  | "waiting"
  | "unread"
  | "pinned";

export type BulkEligibility =
  | { eligible: true }
  | { eligible: false; reason: BulkProtectionReason };

export const BULK_PROTECTION_LABELS: Readonly<
  Record<BulkProtectionReason, string>
> = {
  current: "Currently open",
  working: "Working",
  waiting: "Needs you",
  unread: "Unread",
  pinned: "Pinned",
};

export function familyMembers(
  family: ThreadFamily,
): readonly PluginSidebarThread[] {
  return [family.root, ...family.children];
}

export function familyIsWorking(family: ThreadFamily): boolean {
  return familyMembers(family).some(threadIsWorking);
}

export function familyNeedsUser(family: ThreadFamily): boolean {
  return familyMembers(family).some(
    (thread) =>
      thread.hasPendingInteraction || thread.indicator === "waiting-for-input",
  );
}

export function familyIsUnread(family: ThreadFamily): boolean {
  return familyMembers(family).some(
    (thread) =>
      thread.isUnread ||
      thread.indicator === "unread-error" ||
      thread.indicator === "unread-success",
  );
}

export function familyIsQuiet(family: ThreadFamily): boolean {
  return (
    !familyIsWorking(family) &&
    !familyNeedsUser(family) &&
    !familyIsUnread(family)
  );
}

export function familyUpdatedAt(family: ThreadFamily): number {
  return familyMembers(family).reduce(
    (latest, thread) => Math.max(latest, thread.updatedAt),
    0,
  );
}

export function bulkEligibility(
  family: ThreadFamily,
  activeThreadId: string | null,
): BulkEligibility {
  const members = familyMembers(family);
  if (
    activeThreadId !== null &&
    members.some((thread) => thread.id === activeThreadId)
  ) {
    return { eligible: false, reason: "current" };
  }
  if (familyIsWorking(family)) {
    return { eligible: false, reason: "working" };
  }
  if (familyNeedsUser(family)) {
    return { eligible: false, reason: "waiting" };
  }
  if (familyIsUnread(family)) {
    return { eligible: false, reason: "unread" };
  }
  if (members.some((thread) => thread.isPinned)) {
    return { eligible: false, reason: "pinned" };
  }
  return { eligible: true };
}

export function filterProjectThreadGroups(
  groups: readonly ProjectThreadGroup[],
  preset: ThreadFilterPreset,
  now: number,
): ProjectThreadGroup[] {
  if (preset === "all") return [...groups];

  return groups.flatMap((group) => {
    const families = group.families.filter((family) =>
      familyMatchesPreset(family, preset, now),
    );
    return families.length === 0 ? [] : [{ ...group, families }];
  });
}

export function selectableRootIds(
  groups: readonly ProjectThreadGroup[],
  activeThreadId: string | null,
): string[] {
  return groups.flatMap((group) =>
    group.families.flatMap((family) =>
      bulkEligibility(family, activeThreadId).eligible
        ? [family.root.id]
        : [],
    ),
  );
}

export function pruneSelectedRootIds(
  selected: ReadonlySet<string>,
  groups: readonly ProjectThreadGroup[],
): Set<string> {
  const visibleRootIds = new Set(
    groups.flatMap((group) =>
      group.families.map((family) => family.root.id),
    ),
  );
  return new Set([...selected].filter((id) => visibleRootIds.has(id)));
}

/**
 * Selection is a review surface: a family that becomes protected after it was
 * checked must stay visible even when the active preset or host search no
 * longer matches it. Preserve the complete group's canonical order and add
 * only the selected roots that filtering omitted.
 */
export function includeSelectedFamilies(
  filteredGroups: readonly ProjectThreadGroup[],
  allGroups: readonly ProjectThreadGroup[],
  selectedRootIds: ReadonlySet<string>,
): ProjectThreadGroup[] {
  if (selectedRootIds.size === 0) return [...filteredGroups];

  const filteredIdsByProject = new Map(
    filteredGroups.map((group) => [
      group.project.id,
      new Set(group.families.map((family) => family.root.id)),
    ]),
  );

  return allGroups.flatMap((group) => {
    const filteredIds = filteredIdsByProject.get(group.project.id);
    const families = group.families.filter(
      (family) =>
        filteredIds?.has(family.root.id) === true ||
        selectedRootIds.has(family.root.id),
    );
    return families.length === 0 ? [] : [{ ...group, families }];
  });
}

function familyMatchesPreset(
  family: ThreadFamily,
  preset: Exclude<ThreadFilterPreset, "all">,
  now: number,
): boolean {
  switch (preset) {
    case "working":
      return familyIsWorking(family);
    case "needs-you":
      return familyNeedsUser(family);
    case "unread":
      return familyIsUnread(family);
    case "quiet":
      return familyIsQuiet(family);
    case "quiet-1d":
      return familyIsQuiet(family) && now - familyUpdatedAt(family) >= DAY_MS;
    case "quiet-7d":
      return (
        familyIsQuiet(family) && now - familyUpdatedAt(family) >= 7 * DAY_MS
      );
  }
}
