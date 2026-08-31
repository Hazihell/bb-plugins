import { useId, useState } from "react";
import {
  experimental_useSidebarThreadActions as useSidebarThreadActions,
  type PluginSidebarThread,
} from "@bb/plugin-sdk/app";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ThreadCard } from "@/components/inbox/thread-card";
import type { ProviderGlyphInfo } from "@/components/inbox/provider-glyph";
import type { LifecycleApi } from "@/hooks/use-lifecycle";
import {
  threadIsWorking,
  type ProjectThreadGroup,
} from "@/lib/inbox";
import {
  BULK_PROTECTION_LABELS,
  bulkEligibility,
} from "@/lib/thread-management";

/** A collapsible project section, modeled after Orca's durable outer groups. */
export function ProjectGroup({
  group,
  providerInfoById,
  activeThreadId,
  forceExpanded,
  lifecycle,
  onNavigate,
  now,
  selectionMode,
  selectedRootIds,
  onToggleRoot,
}: {
  group: ProjectThreadGroup;
  providerInfoById: ReadonlyMap<string, ProviderGlyphInfo>;
  activeThreadId: string | null;
  forceExpanded: boolean;
  lifecycle: LifecycleApi;
  onNavigate: () => void;
  now: number;
  selectionMode: boolean;
  selectedRootIds: ReadonlySet<string>;
  onToggleRoot: (threadId: string) => void;
}) {
  const actions = useSidebarThreadActions();
  const [expandedByUser, setExpandedByUser] = useState(true);
  const projectListId = useId();
  const threads = group.families.flatMap((family) => [
    family.root,
    ...family.children,
  ]);
  const expanded = forceExpanded || expandedByUser;

  return (
    <section aria-label={group.project.name} className="mt-1.5 first:mt-0">
      <div className="group/project relative flex h-8 w-full items-center gap-2 rounded-md px-1.5 hover:bg-sidebar-accent/60">
        <button
          type="button"
          aria-label={`${expanded ? "Collapse" : "Expand"} ${group.project.name}`}
          aria-expanded={expanded}
          aria-controls={projectListId}
          onClick={() => setExpandedByUser(!expanded)}
          className="absolute inset-0 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <span
          aria-hidden
          className="pointer-events-none relative flex size-5 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-2xs font-semibold uppercase text-foreground"
        >
          {projectInitial(group.project.name)}
        </span>
        <span className="pointer-events-none relative min-w-0 flex-1 truncate text-xs font-semibold text-foreground/90">
          {group.project.name}
        </span>
        <span className="pointer-events-none relative shrink-0 tabular-nums text-2xs text-muted-foreground/70">
          {group.families.length}
        </span>
        <button
          type="button"
          aria-label={`New thread in ${group.project.name}`}
          title={`New thread in ${group.project.name}`}
          onClick={() => {
            actions.openNewThread({
              projectId: group.project.id,
              focusPrompt: true,
            });
            onNavigate();
          }}
          className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-70 hover:bg-sidebar-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Icon name="Add" className="size-3.5" aria-hidden />
        </button>
        <Icon
          name="ChevronDown"
          className={cn(
            "pointer-events-none relative size-3 shrink-0 text-muted-foreground/70 transition-transform",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
        <span className="sr-only">{projectStatusLabel(threads)}</span>
      </div>

      {expanded ? (
        <ul id={projectListId} className="mt-0.5 flex flex-col gap-0.5">
          {group.families.map((family) => {
            const eligibility = bulkEligibility(family, activeThreadId);
            return (
              <ThreadCard
                key={family.root.id}
                thread={family.root}
                childThreads={family.children}
                providerInfoById={providerInfoById}
                activeThreadId={activeThreadId}
                canPark={lifecycle.canPark(family.root)}
                forceExpanded={forceExpanded}
                onNavigate={onNavigate}
                onSettle={() => lifecycle.settle(family.root.id)}
                onSnooze={(until) => lifecycle.snooze(family.root.id, until)}
                now={now}
                selectionMode={selectionMode}
                selected={selectedRootIds.has(family.root.id)}
                selectionDisabledReason={
                  eligibility.eligible
                    ? null
                    : BULK_PROTECTION_LABELS[eligibility.reason]
                }
                onToggleSelected={() => onToggleRoot(family.root.id)}
              />
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

function projectInitial(name: string): string {
  const first = Array.from(name.trim())[0];
  return first?.toLocaleUpperCase() ?? "•";
}

function projectStatusLabel(threads: readonly PluginSidebarThread[]): string {
  const labels: string[] = [];
  if (threads.some((thread) => thread.hasPendingInteraction)) {
    labels.push("needs you");
  }
  if (threads.some(threadIsWorking)) labels.push("working");
  if (threads.some((thread) => thread.isUnread)) labels.push("unread");
  return labels.length > 0 ? labels.join(", ") : "No active status";
}
