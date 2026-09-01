import type { PluginSidebarPullRequest } from "@bb/plugin-sdk";
import type { SemanticStateTone } from "./attention-state.ts";

export interface PullRequestPresentation {
  label: string;
  icon:
    | "Check"
    | "CircleX"
    | "Eye"
    | "GitMerge"
    | "GitPullRequest"
    | "GitPullRequestClosed"
    | "GitPullRequestDraft"
    | "Hourglass";
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
    return { label: "MERGED", icon: "GitMerge", tone: "merged" };
  }
  if (
    pullRequest.state === "closed" ||
    pullRequest.attention === "closed"
  ) {
    return {
      label: "CLOSED",
      icon: "GitPullRequestClosed",
      tone: "closed",
    };
  }
  if (
    pullRequest.state === "draft" ||
    pullRequest.attention === "draft"
  ) {
    return { label: "DRAFT", icon: "GitPullRequestDraft", tone: "muted" };
  }

  switch (pullRequest.attention) {
    case "changes_requested":
      return { label: "CHANGES", icon: "CircleX", tone: "destructive" };
    case "blocked":
    case "checks_failed":
    case "conflicts":
      return { label: "BLOCKED", icon: "CircleX", tone: "destructive" };
    case "checks_pending":
      return { label: "CHECKS", icon: "Hourglass", tone: "warning" };
    case "review_requested":
      return { label: "IN REVIEW", icon: "Eye", tone: "primary" };
    case "ready_to_merge":
      return { label: "READY", icon: "Check", tone: "success" };
    default:
      return { label: "OPEN", icon: "GitPullRequest", tone: "muted" };
  }
}
