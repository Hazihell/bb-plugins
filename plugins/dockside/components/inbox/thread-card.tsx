import { useId, useState } from "react";
import {
  experimental_useSidebarThreadPullRequest as useSidebarThreadPullRequest,
  experimental_useSidebarThreadSplit as useSidebarThreadSplit,
  experimental_useSidebarThreadActions as useSidebarThreadActions,
  type PluginSidebarThread,
} from "@bb/plugin-sdk/app";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { RowContextMenu } from "@/components/inbox/row-context-menu";
import {
  ProviderGlyph,
  type ProviderGlyphInfo,
} from "@/components/inbox/provider-glyph";
import { StatusGlyph } from "@/components/inbox/status-glyph";
import { threadStatus } from "@/components/inbox/status-slot";
import {
  threadDisplayTitle,
  threadIsWorking,
} from "@/lib/inbox";
import { relativeTimeLabel } from "@/lib/relative-time";
import { resolveSnoozePresets } from "@/lib/lifecycle";

/**
 * One project-root thread and its visible descendants. Quiet roots stay a
 * compact two-line row; active families open into an Orca-style agent stack.
 */
export function ThreadCard({
  thread,
  childThreads,
  providerInfoById,
  activeThreadId,
  canPark,
  forceExpanded,
  onNavigate,
  onSettle,
  onSnooze,
  now,
  selectionMode,
  selected,
  selectionDisabledReason,
  onToggleSelected,
}: {
  thread: PluginSidebarThread;
  childThreads: readonly PluginSidebarThread[];
  providerInfoById: ReadonlyMap<string, ProviderGlyphInfo>;
  activeThreadId: string | null;
  /** False while the root is working or blocked on the user. */
  canPark: boolean;
  /** Search results reveal their matching descendants. */
  forceExpanded: boolean;
  onNavigate: () => void;
  onSettle: () => void;
  onSnooze: (snoozedUntil: number) => void;
  /** Quantized clock, shared by every row in one render. */
  now: number;
  selectionMode: boolean;
  selected: boolean;
  selectionDisabledReason: string | null;
  onToggleSelected: () => void;
}) {
  const actions = useSidebarThreadActions();
  const { splitProps, layout } = useSidebarThreadSplit(thread.id);
  const { pullRequest } = useSidebarThreadPullRequest(thread.id);
  const childListId = useId();
  const [expandedOverride, setExpandedOverride] = useState<boolean | null>(
    null,
  );

  const familyIsActive =
    thread.id === activeThreadId ||
    childThreads.some((child) => child.id === activeThreadId);
  const childNeedsAttention = childThreads.some(
    (child) =>
      child.hasPendingInteraction ||
      child.isUnread ||
      threadIsWorking(child),
  );
  const defaultExpanded = familyIsActive || childNeedsAttention;
  const expanded =
    childThreads.length > 0 &&
    (forceExpanded || (expandedOverride ?? defaultExpanded));
  const rootIsActive = thread.id === activeThreadId;

  return (
    <RowContextMenu thread={thread}>
      <li className="list-none">
        <div
          className={cn(
            "rounded-xl border transition-colors",
            expanded
              ? "border-sidebar-border bg-sidebar-accent/35 p-1"
              : "border-transparent",
            familyIsActive && "bg-sidebar-accent/60",
            !familyIsActive && layout !== null && "bg-sidebar-accent/25",
          )}
        >
          <div
            className={cn(
              "group/root relative flex min-h-12 items-start gap-2 rounded-lg px-2 py-1.5",
              rootIsActive
                ? "bg-sidebar-accent"
                : "hover:bg-sidebar-accent/60",
            )}
          >
            {/* The shortcut/split contract requires an anchor, while the
                controls remain sibling buttons above it. */}
            {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid -- bb's
                shortcut and split-drag contracts require an anchor. */}
            <a
              data-sidebar-thread-shortcut-target=""
              data-sidebar-thread-id={thread.id}
              href="#"
              aria-label={threadDisplayTitle(thread)}
              aria-current={rootIsActive ? "page" : undefined}
              {...splitProps}
              onClick={(event) => {
                event.preventDefault();
                actions.open(thread.id, {
                  split: event.metaKey || event.ctrlKey,
                });
                onNavigate();
              }}
              className="absolute inset-0 cursor-pointer rounded-lg"
            />

            {selectionMode ? (
              <input
                type="checkbox"
                checked={selected}
                aria-label={
                  selectionDisabledReason === null
                    ? `${selected ? "Deselect" : "Select"} ${threadDisplayTitle(thread)}`
                    : `${threadDisplayTitle(thread)} cannot be selected: ${selectionDisabledReason}`
                }
                title={selectionDisabledReason ?? undefined}
                disabled={selectionDisabledReason !== null}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onChange={onToggleSelected}
                className={cn(
                  "relative z-10 mt-0.5 size-4 shrink-0 cursor-pointer rounded border accent-primary transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  selectionDisabledReason !== null &&
                    "cursor-not-allowed opacity-35",
                )}
              />
            ) : null}

            <ThreadStateGlyph thread={thread} className="relative mt-0.5" />

            <div className="pointer-events-none relative min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm",
                    thread.isUnread ? "font-semibold" : "font-medium",
                    thread.isUnread || threadIsWorking(thread)
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {threadDisplayTitle(thread)}
                </span>
                {thread.isPinned ? (
                  <Icon
                    name="Pin"
                    aria-label="Pinned thread"
                    className="size-3 shrink-0 text-muted-foreground/70"
                  />
                ) : null}
              </div>
              <div className="mt-0.5 flex h-4 min-w-0 items-center gap-1.5 text-2xs text-muted-foreground">
                <ThreadLocation thread={thread} />
                {thread.activity.workflows > 0 ? (
                  <ActivityCount
                    label="workflows"
                    count={thread.activity.workflows}
                  />
                ) : null}
                {thread.activity.backgroundAgents > 0 ? (
                  <ActivityCount
                    label="background agents"
                    count={thread.activity.backgroundAgents}
                  />
                ) : null}
                {pullRequest ? (
                  <a
                    href={pullRequest.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    title={pullRequest.title}
                    className={cn(
                      "pointer-events-auto relative shrink-0 font-mono hover:underline",
                      pullRequest.state === "merged"
                        ? "text-[color:var(--pr-merged)]"
                        : pullRequest.attention === "checks_failed" ||
                            pullRequest.attention === "conflicts"
                          ? "text-destructive"
                          : pullRequest.attention === "ready_to_merge"
                            ? "text-success-foreground"
                            : "text-muted-foreground",
                    )}
                  >
                    #{pullRequest.number}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="relative z-10 flex w-16 shrink-0 flex-col items-end gap-1">
              <span
                className={cn(
                  "flex h-4 items-center justify-end",
                  canPark && !selectionMode && "group-hover/root:hidden",
                )}
              >
                <ThreadStatusLabel thread={thread} now={now} />
              </span>
              {canPark && !selectionMode ? (
                <span className="hidden h-4 items-center gap-0.5 group-hover/root:flex">
                  <ParkButton
                    label="Snooze until tomorrow"
                    icon="Clock"
                    onActivate={() => {
                      const tomorrow = resolveSnoozePresets(new Date()).find(
                        (preset) => preset.id === "tomorrow",
                      );
                      if (tomorrow) onSnooze(tomorrow.snoozedUntil);
                    }}
                  />
                  <ParkButton
                    label="Settle thread"
                    icon="Check"
                    onActivate={onSettle}
                  />
                </span>
              ) : null}
              {childThreads.length > 0 ? (
                <button
                  type="button"
                  aria-label={`${expanded ? "Hide" : "Show"} ${childThreads.length} child threads`}
                  aria-expanded={expanded}
                  aria-controls={childListId}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setExpandedOverride(!expanded);
                  }}
                  className={cn(
                    "flex h-5 items-center gap-1 rounded px-1 text-2xs font-medium text-muted-foreground",
                    "hover:bg-sidebar-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    childNeedsAttention && "text-primary",
                  )}
                >
                  <span className="tabular-nums">
                    {childThreads.length}{" "}
                    {childThreads.length === 1 ? "agent" : "agents"}
                  </span>
                  <Icon
                    name="ChevronDown"
                    className={cn(
                      "size-3 transition-transform",
                      expanded && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              ) : null}
            </div>
          </div>

          {expanded ? (
            <ul
              id={childListId}
              aria-label={`Agents for ${threadDisplayTitle(thread)}`}
              className="ml-[14px] border-l border-sidebar-border pb-0.5 pl-3"
            >
              {childThreads.map((child) => (
                <ChildThreadRow
                  key={child.id}
                  thread={child}
                  provider={providerInfoById.get(child.providerId)}
                  isActive={child.id === activeThreadId}
                  onNavigate={onNavigate}
                  now={now}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </li>
    </RowContextMenu>
  );
}

function ChildThreadRow({
  thread,
  provider,
  isActive,
  onNavigate,
  now,
}: {
  thread: PluginSidebarThread;
  provider?: ProviderGlyphInfo;
  isActive: boolean;
  onNavigate: () => void;
  now: number;
}) {
  const actions = useSidebarThreadActions();
  const { splitProps, layout } = useSidebarThreadSplit(thread.id);
  const status = threadStatus(thread);

  return (
    <RowContextMenu thread={thread}>
      <li className="relative list-none py-px">
        <span
          aria-hidden
          className="absolute -left-3 top-1/2 h-px w-3 bg-sidebar-border"
        />
        <div
          className={cn(
            "group/child relative flex min-h-10 items-start gap-1.5 rounded-md px-1.5 py-1",
            isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
            !isActive && layout !== null && "bg-sidebar-accent/25",
          )}
        >
          {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid -- bb's
              shortcut and split-drag contracts require an anchor. */}
          <a
            data-sidebar-thread-shortcut-target=""
            data-sidebar-thread-id={thread.id}
            href="#"
            aria-label={threadDisplayTitle(thread)}
            aria-current={isActive ? "page" : undefined}
            {...splitProps}
            onClick={(event) => {
              event.preventDefault();
              actions.open(thread.id, {
                split: event.metaKey || event.ctrlKey,
              });
              onNavigate();
            }}
            className="absolute inset-0 cursor-pointer rounded-md"
          />
          <ThreadStateGlyph thread={thread} className="relative mt-0.5" />
          <ProviderGlyph
            providerId={thread.providerId}
            provider={provider}
            className="relative mt-0.5"
          />
          <div className="pointer-events-none relative min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-xs",
                  thread.isUnread
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {threadDisplayTitle(thread)}
              </span>
              <span className="shrink-0 tabular-nums text-2xs text-muted-foreground/70">
                {relativeTimeLabel(thread.updatedAt, now)}
              </span>
            </div>
            <div className="mt-0.5 flex h-3.5 min-w-0 items-center gap-1.5 text-2xs">
              <ThreadLocation thread={thread} />
              {status ? (
                <span className={cn("shrink-0 font-medium", status.tone)}>
                  {status.label}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </li>
    </RowContextMenu>
  );
}

function ThreadStateGlyph({
  thread,
  className,
}: {
  thread: PluginSidebarThread;
  className?: string;
}) {
  const status = threadStatus(thread);
  if (status === null) {
    return (
      <span
        aria-hidden
        className={cn(
          "flex size-3.5 shrink-0 items-center justify-center",
          className,
        )}
      >
        <span className="size-2 rounded-full bg-muted-foreground/30" />
      </span>
    );
  }
  return (
    <StatusGlyph
      indicator={status.indicator}
      label={thread.indicatorLabel ?? status.label}
      className={className}
    />
  );
}

function ThreadStatusLabel({
  thread,
  now,
}: {
  thread: PluginSidebarThread;
  now: number;
}) {
  const status = threadStatus(thread);
  if (status !== null) {
    return (
      <span
        aria-label={thread.indicatorLabel ?? status.label}
        className={cn(
          "max-w-16 truncate text-2xs font-medium",
          status.tone,
        )}
      >
        {status.label}
      </span>
    );
  }
  return (
    <span className="tabular-nums text-2xs text-muted-foreground/70">
      {relativeTimeLabel(thread.updatedAt, now)}
    </span>
  );
}

function ThreadLocation({ thread }: { thread: PluginSidebarThread }) {
  const branch = thread.environment?.branchName;
  if (branch) {
    return (
      <span className="flex min-w-0 flex-1 items-center gap-1 truncate text-muted-foreground">
        <Icon
          name="GitBranch"
          aria-label="Branch"
          className="size-3 shrink-0 text-muted-foreground/60"
        />
        <span className="truncate font-mono">{branch}</span>
      </span>
    );
  }
  if (thread.host) {
    return (
      <span className="min-w-0 flex-1 truncate text-muted-foreground">
        {thread.host.name}
      </span>
    );
  }
  return <span className="flex-1" />;
}

function ParkButton({
  label,
  icon,
  onActivate,
}: {
  label: string;
  icon: Extract<IconName, "Clock" | "Check">;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onActivate();
      }}
      className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <Icon name={icon} className="size-3.5" />
    </button>
  );
}

function ActivityCount({ label, count }: { label: string; count: number }) {
  return (
    <span
      aria-label={`${count} ${label}`}
      className="shrink-0 rounded bg-muted px-1 font-mono text-2xs text-muted-foreground"
    >
      {count}
    </span>
  );
}
