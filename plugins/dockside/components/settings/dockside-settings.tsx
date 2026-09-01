import { useSettings } from "@bb/plugin-sdk/app";
import {
  resolveDocksidePreferences,
  type DocksidePreferences,
  type SemanticColorRole,
} from "@/lib/preferences";

const THREAD_SWATCHES: ReadonlyArray<{
  role: SemanticColorRole;
  label: string;
}> = [
  { role: "working", label: "Working" },
  { role: "waiting", label: "Stalled / waiting" },
  { role: "unread", label: "Waiting to read" },
  { role: "error", label: "Error" },
  { role: "idle", label: "Stale / idle" },
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
      <PalettePreview title="Thread states" items={THREAD_SWATCHES} preferences={preferences} />
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
