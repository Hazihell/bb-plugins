import {
  UrlLink,
  type PluginSidebarPullRequest,
} from "@bb/plugin-sdk/app";
import { Icon } from "@/components/ui/icon";
import { semanticStateToneClass } from "@/lib/attention-state";
import { pullRequestPresentation } from "@/lib/pull-request-presentation";

export function PullRequestMetadata({
  pullRequest,
}: {
  pullRequest: PluginSidebarPullRequest;
}) {
  const presentation = pullRequestPresentation(pullRequest);
  // Number first; the semantic PR icon deliberately owns the far-right edge.
  return (
    <UrlLink
      href={pullRequest.url}
      onClick={(event) => event.stopPropagation()}
      className="pointer-events-auto relative flex h-4 min-w-0 items-center gap-1.5 text-2xs text-muted-foreground hover:text-foreground"
      aria-label={`${presentation.label} pull request ${pullRequest.number}: ${pullRequest.title}`}
      title={`${presentation.label}: ${pullRequest.title}`}
    >
      <span className="shrink-0 font-mono text-muted-foreground/80">
        #{pullRequest.number}
      </span>
      <span
        className={`inline-flex size-4 shrink-0 items-center justify-center rounded ${semanticStateToneClass(presentation.tone)}`}
      >
        <Icon name={presentation.icon} className="size-3" aria-hidden />
      </span>
    </UrlLink>
  );
}

export function WaitingForAgentsMetadata() {
  return (
    <span
      title="Agents working"
      className={`inline-flex size-4 shrink-0 items-center justify-center rounded ${semanticStateToneClass("primary")}`}
    >
      <Icon name="Loading" className="size-3 animate-spin" aria-hidden />
      <span className="sr-only">Agents working</span>
    </span>
  );
}
