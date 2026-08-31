import { useId, useState } from "react";
import type { PluginSidebarThread } from "@bb/plugin-sdk/app";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ThreadCard } from "@/components/inbox/thread-card";
import type { ProviderGlyphInfo } from "@/components/inbox/provider-glyph";
import type { LifecycleApi } from "@/hooks/use-lifecycle";
import {
  threadIsWorking,
  type ProjectThreadGroup,
} from "@/lib/inbox";

/** A collapsible project section, modeled after Orca's durable outer groups. */
export function ProjectGroup({
  group,
  providerInfoById,
  activeThreadId,
  forceExpanded,
  lifecycle,
  onNavigate,
  now,
}: {
  group: ProjectThreadGroup;
  providerInfoById: ReadonlyMap<string, ProviderGlyphInfo>;
  activeThreadId: string | null;
  forceExpanded: boolean;
  lifecycle: LifecycleApi;
  onNavigate: () => void;
  now: number;
}) {
  const [expandedByUser, setExpandedByUser] = useState(true);
  const projectListId = useId();
  const threads = group.families.flatMap((family) => [
    family.root,
    ...family.children,
  ]);
  const expanded = forceExpanded || expandedByUser;
  const working = threads.some(threadIsWorking);
  const unread = threads.some((thread) => thread.isUnread);
  const needsYou = threads.some((thread) => thread.hasPendingInteraction);

  return (
    <section aria-label={group.project.name} className="mt-1.5 first:mt-0">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={projectListId}
        onClick={() => setExpandedByUser(!expanded)}
        className="group/project flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-left hover:bg-sidebar-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <span
          aria-hidden
          className="flex size-5 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-2xs font-semibold uppercase text-foreground"
        >
          {projectInitial(group.project.name)}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground/90">
          {group.project.name}
        </span>
        <span className="shrink-0 tabular-nums text-2xs text-muted-foreground/70">
          {group.families.length}
        </span>
        <span className="flex shrink-0 items-center gap-1" aria-hidden>
          {needsYou ? (
            <span className="size-2 rounded-full bg-primary" />
          ) : null}
          {working ? (
            <span className="size-2.5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          ) : null}
          {unread ? (
            <span className="size-2 rounded-full border-2 border-primary" />
          ) : null}
        </span>
        <Icon
          name="ChevronDown"
          className={cn(
            "size-3 shrink-0 text-muted-foreground/70 transition-transform",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
        <span className="sr-only">{projectStatusLabel(threads)}</span>
      </button>

      {expanded ? (
        <ul id={projectListId} className="mt-0.5 flex flex-col gap-0.5">
          {group.families.map((family) => (
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
            />
          ))}
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
