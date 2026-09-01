import type { PluginSidebarPullRequest } from "@bb/plugin-sdk";
import type { SemanticStateTone } from "./attention-state.ts";

export interface PullRequestPresentation {
  label: string;
  tone: SemanticStateTone;
}

/**
 * Turn BB's rolled-up PR state into one stable, compact sidebar treatment.
 * Terminal states win first; attention then refines an open pull request.
 */
export function pullRequestPresentation(
  pullRequest: Pick<PluginSidebarPullRequest, "attention" | "state">,
): PullRequestPresentation {
  if (
    pullRequest.state === "merged" ||
    pullRequest.attention === "merged"
  ) {
    return { label: "MERGED", tone: "merged" };
  }
  if (
    pullRequest.state === "closed" ||
    pullRequest.attention === "closed"
  ) {
    return { label: "CLOSED", tone: "muted" };
  }
  if (
    pullRequest.state === "draft" ||
    pullRequest.attention === "draft"
  ) {
    return { label: "DRAFT", tone: "muted" };
  }

  switch (pullRequest.attention) {
    case "changes_requested":
      return { label: "CHANGES", tone: "destructive" };
    case "blocked":
    case "checks_failed":
    case "conflicts":
      return { label: "BLOCKED", tone: "destructive" };
    case "checks_pending":
      return { label: "CHECKS", tone: "primary" };
    case "review_requested":
      return { label: "IN REVIEW", tone: "primary" };
    case "ready_to_merge":
      return { label: "READY", tone: "success" };
    default:
      return { label: "OPEN", tone: "muted" };
  }
}
