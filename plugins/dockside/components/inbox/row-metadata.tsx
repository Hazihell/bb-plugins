import {
  UrlLink,
  type PluginSidebarPullRequest,
} from "@bb/plugin-sdk/app";
import { Icon } from "@/components/ui/icon";
import { pullRequestPresentation } from "@/lib/pull-request-presentation";
import { cn } from "@/lib/utils";

export function PullRequestMetadata({
  pullRequest,
}: {
  pullRequest: PluginSidebarPullRequest;
}) {
  const presentation = pullRequestPresentation(pullRequest);
  return (
    <UrlLink
      href={pullRequest.url}
      onClick={(event) => event.stopPropagation()}
      className="pointer-events-auto relative mt-0.5 flex h-4 min-w-0 items-center gap-1.5 text-2xs text-muted-foreground hover:text-foreground"
      aria-label={`${presentation.label} pull request ${pullRequest.number}: ${pullRequest.title}`}
    >
      <span
        className={cn(
          "inline-flex h-4 shrink-0 items-center gap-1 rounded px-1 font-semibold tracking-wide",
          presentation.tone === "destructive" &&
            "bg-destructive/10 text-destructive",
          presentation.tone === "merged" &&
            "bg-primary/10 text-[color:var(--pr-merged)]",
          presentation.tone === "muted" &&
            "bg-muted text-muted-foreground",
          presentation.tone === "primary" && "bg-primary/10 text-primary",
          presentation.tone === "success" &&
            "bg-primary/10 text-success-foreground",
        )}
      >
        <Icon name={presentation.icon} className="size-3" aria-hidden />
        {presentation.label}
      </span>
      <span className="shrink-0 font-mono text-muted-foreground/80">
        #{pullRequest.number}
      </span>
      <span className="min-w-0 truncate">{pullRequest.title}</span>
    </UrlLink>
  );
}

export function DoneMetadata({ summary }: { summary: string }) {
  return (
    <div className="mt-0.5 flex h-4 min-w-0 items-center gap-1.5 text-2xs text-muted-foreground">
      <span className="inline-flex h-4 shrink-0 items-center gap-1 rounded bg-muted px-1 font-semibold tracking-wide text-muted-foreground">
        <Icon name="Check" className="size-3" aria-hidden />
        DONE
      </span>
      <span className="min-w-0 truncate">{summary}</span>
    </div>
  );
}

export function WaitingForAgentsMetadata() {
  return (
    <div className="mt-0.5 flex h-4 min-w-0 items-center gap-1 text-2xs font-medium text-primary">
      <Icon name="Loading" className="size-3 shrink-0" aria-hidden />
      <span className="truncate">Waiting for agents</span>
    </div>
  );
}
