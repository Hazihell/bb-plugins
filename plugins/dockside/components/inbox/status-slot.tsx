import type {
  PluginSidebarThread,
  PluginSidebarThreadIndicator,
} from "@bb/plugin-sdk/app";
import { cn } from "@/lib/utils";
import { relativeTimeLabel } from "@/lib/relative-time";
import { threadIsWorking } from "@/lib/inbox";

/**
 * The row's trailing slot: one fixed width, right-aligned, on every row.
 *
 * Fixed rather than intrinsic because status labels range from "7m" to
 * "Needs you". The width keeps the title and actions from moving as state
 * changes.
 */
export const STATUS_SLOT_CLASS = "flex w-16 shrink-0 items-center justify-end";

/**
 * The box every trailing glyph sits in, whatever its artwork measures.
 *
 * The status glyph, the provider glyph and a shelf's chevron all end a line at
 * the same inset, but they are drawn at different sizes. A shared box centres
 * each one on the same vertical axis, so right-aligning the boxes lines the
 * icons up instead of leaving them one or two pixels apart.
 */
export const TRAILING_GLYPH_BOX_CLASS =
  "flex size-3.5 shrink-0 items-center justify-center";

/**
 * Status OR age, never both: the glyph already implies the row is current, and
 * the age only earns its place once the thread has nothing to say.
 */
export function StatusOrTime({
  thread,
  now,
}: {
  thread: PluginSidebarThread;
  /** Quantized clock, shared by every row in one render. */
  now: number;
}) {
  const status = threadStatus(thread);
  if (status !== null) {
    return (
      <span
        aria-label={thread.indicatorLabel ?? status.label}
        className={cn(
          "max-w-full truncate text-2xs font-medium",
          status.tone,
        )}
      >
        {status.label}
      </span>
    );
  }
  return (
    <span className="tabular-nums text-2xs text-muted-foreground">
      {relativeTimeLabel(thread.updatedAt, now)}
    </span>
  );
}

export interface ThreadStatus {
  label: string;
  indicator: PluginSidebarThreadIndicator;
  tone: string;
}

/**
 * A readable status for the row. Live work wins over a stale unread-success
 * indicator, while a failure and a raised hand remain higher priority.
 */
export function threadStatus(
  thread: PluginSidebarThread,
): ThreadStatus | null {
  if (thread.hasPendingInteraction || thread.indicator === "waiting-for-input") {
    return {
      label: "Needs you",
      indicator: "waiting-for-input",
      tone: "text-primary",
    };
  }
  if (thread.indicator === "unread-error") {
    return {
      label: "Failed",
      indicator: "unread-error",
      tone: "text-destructive",
    };
  }
  if (threadIsWorking(thread)) {
    return { label: "Working", indicator: "runtime", tone: "text-primary" };
  }
  if (thread.isUnread || thread.indicator === "unread-success") {
    return { label: "Unread", indicator: "unread-success", tone: "text-primary" };
  }

  switch (thread.indicator) {
    case "draft":
      return {
        label: "Draft",
        indicator: "draft",
        tone: "text-muted-foreground",
      };
    case "working-draft":
      return {
        label: "Drafting",
        indicator: "working-draft",
        tone: "text-primary",
      };
    case "workflow":
      return {
        label: "Workflow",
        indicator: "workflow",
        tone: "text-primary",
      };
    case "background-agent":
      return {
        label: "Agent",
        indicator: "background-agent",
        tone: "text-primary",
      };
    case "background-command":
      return {
        label: "Command",
        indicator: "background-command",
        tone: "text-primary",
      };
    case "plan-mode":
      return {
        label: "Planning",
        indicator: "plan-mode",
        tone: "text-primary",
      };
    case "goal":
      return { label: "Goal", indicator: "goal", tone: "text-primary" };
    case "runtime":
      return { label: "Working", indicator: "runtime", tone: "text-primary" };
    case "none":
    default:
      return null;
  }
}
