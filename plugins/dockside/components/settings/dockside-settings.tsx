import { useSettings } from "@bb/plugin-sdk/app";
import type { CSSProperties } from "react";
import {
  FamilyStatusBadge,
  FamilyStatusIcon,
} from "@/components/inbox/family-status";
import {
  familyStatusPresentation,
  workingActivityPresentation,
  type FamilyStatusKind,
  type WorkingActivityKind,
} from "@/lib/family-status";
import {
  docksidePreferenceStyle,
  resolveDocksidePreferences,
  type DocksidePreferences,
  type SemanticColorRole,
} from "@/lib/preferences";

const THREAD_STATES: readonly FamilyStatusKind[] = [
  "working",
  "needs-you",
  "unread",
  "failed",
  "inactive",
  "stale",
];

const WORKING_ACTIVITIES: ReadonlyArray<{
  kind: WorkingActivityKind;
  label: string;
}> = [
  { kind: "runtime", label: "Runtime" },
  { kind: "workflow", label: "Workflow" },
  { kind: "agent", label: "Agent" },
  { kind: "command", label: "Command" },
  { kind: "plan", label: "Plan" },
  { kind: "goal", label: "Goal" },
];

const PR_SWATCHES: ReadonlyArray<{
  role: SemanticColorRole;
  label: string;
}> = [
  { role: "prReview", label: "PR review" },
  { role: "prChecks", label: "PR checks" },
  { role: "prReady", label: "PR ready" },
  { role: "prMerged", label: "PR merged" },
  { role: "prDraft", label: "PR draft" },
  { role: "prBlocked", label: "PR blocked" },
  { role: "prClosed", label: "PR closed" },
];

export function DocksideSettingsSection() {
  const settings = useSettings();
  const preferences = resolveDocksidePreferences(settings.values);

  return (
    <section
      data-dockside-settings-preview=""
      style={docksidePreferenceStyle(preferences) as CSSProperties}
      className="space-y-3 rounded-lg border border-border bg-muted/20 p-3"
    >
      <div>
        <p className="text-xs font-semibold text-foreground">
          Effective palette · {preferences.palettePreset}
        </p>
        <p className="mt-1 text-2xs leading-relaxed text-muted-foreground">
          Choose Default to reset the active palette. Custom color fields are
          used only when Custom is selected, and accept six-digit hex values.
          Icon shape, animation, labels, and tooltips always remain.
        </p>
      </div>
      <StatePreview />
      <PalettePreview title="Pull requests" items={PR_SWATCHES} preferences={preferences} />
      <p className="text-2xs text-muted-foreground">
        {preferences.density === "compact" ? "Compact" : "Comfortable"} rows ·
        children {preferences.defaultChildrenExpanded ? "expanded" : "collapsed"} ·
        providers {preferences.showProviderIcons ? "shown" : "hidden"} · PR metadata{" "}
        {preferences.showPullRequestMetadata ? "shown" : "hidden"} · times{" "}
        {preferences.showRelativeTime ? "shown" : "hidden"}
      </p>
    </section>
  );
}

function StatePreview() {
  return (
    <div>
      <p className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">
        Thread states
      </p>
      <ul className="mt-1.5 grid grid-cols-2 gap-1.5">
        {THREAD_STATES.map((kind) => {
          const status = familyStatusPresentation(kind);
          return (
            <li
              key={kind}
              className="flex min-w-0 items-center gap-1 rounded border border-border/70 bg-background/50 px-1.5 py-1.5"
            >
              <FamilyStatusIcon status={status} />
              <FamilyStatusBadge status={status} preview />
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
        Working activity types
      </p>
      <ul className="mt-1.5 grid grid-cols-3 gap-1.5">
        {WORKING_ACTIVITIES.map(({ kind, label }) => {
          const status = workingActivityPresentation(kind);
          return (
            <li
              key={kind}
              className="flex min-w-0 items-center gap-1 rounded border border-border/70 bg-background/50 px-1.5 py-1"
            >
              <FamilyStatusIcon status={status} />
              <span className="truncate text-[10px] font-medium text-foreground/80">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PalettePreview({
  title,
  items,
  preferences,
}: {
  title: string;
  items: ReadonlyArray<{ role: SemanticColorRole; label: string }>;
  preferences: DocksidePreferences;
}) {
  return (
    <div>
      <p className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="mt-1.5 grid grid-cols-2 gap-1.5">
        {items.map(({ role, label }) => (
          <li
            key={role}
            className="flex min-w-0 items-center gap-1.5 rounded border border-border/70 bg-background/50 px-2 py-1.5"
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full border border-black/20"
              style={{ backgroundColor: preferences.colors[role] }}
            />
            <span className="truncate text-2xs text-foreground/85">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
