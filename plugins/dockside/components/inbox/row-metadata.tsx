import {
  UrlLink,
  type PluginSidebarPullRequest,
} from "@bb/plugin-sdk/app";
import { semanticStateToneClass } from "@/lib/attention-state";
import { pullRequestPresentation } from "@/lib/pull-request-presentation";

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
      className="pointer-events-auto relative flex h-4 min-w-0 items-center gap-1.5 text-2xs text-muted-foreground hover:text-foreground"
      aria-label={`${presentation.label} pull request ${pullRequest.number}: ${pullRequest.title}`}
      title={pullRequest.title}
    >
      <span
        className={`inline-flex h-4 shrink-0 items-center rounded px-1 font-semibold tracking-wide ${semanticStateToneClass(presentation.tone)}`}
      >
        {presentation.label}
      </span>
      <span className="shrink-0 font-mono text-muted-foreground/80">
        #{pullRequest.number}
      </span>
    </UrlLink>
  );
}

export function DoneMetadata() {
  return (
    <span
      className={`inline-flex h-4 shrink-0 items-center rounded px-1 text-2xs font-semibold tracking-wide ${semanticStateToneClass("success")}`}
    >
      DONE
    </span>
  );
}

export function WaitingForAgentsMetadata() {
  return (
    <span
      className={`shrink-0 rounded px-1 font-semibold ${semanticStateToneClass("primary")}`}
    >
      Agents working
    </span>
  );
}
