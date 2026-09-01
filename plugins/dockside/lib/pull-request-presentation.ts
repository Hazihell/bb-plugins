import type { PluginSidebarPullRequest } from "@bb/plugin-sdk";

export type PullRequestTone =
  | "destructive"
  | "merged"
  | "muted"
  | "primary"
  | "success";

export interface PullRequestPresentation {
  label: string;
  icon: "Check" | "CircleX" | "GitBranch" | "Loading" | "Target";
  tone: PullRequestTone;
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
    return { label: "MERGED", icon: "Check", tone: "merged" };
  }
  if (
    pullRequest.state === "closed" ||
    pullRequest.attention === "closed"
  ) {
    return { label: "CLOSED", icon: "CircleX", tone: "muted" };
  }
  if (
    pullRequest.state === "draft" ||
    pullRequest.attention === "draft"
  ) {
    return { label: "DRAFT", icon: "GitBranch", tone: "muted" };
  }

  switch (pullRequest.attention) {
    case "changes_requested":
      return { label: "CHANGES", icon: "CircleX", tone: "destructive" };
    case "blocked":
    case "checks_failed":
    case "conflicts":
      return { label: "BLOCKED", icon: "CircleX", tone: "destructive" };
    case "checks_pending":
      return { label: "CHECKS", icon: "Loading", tone: "primary" };
    case "review_requested":
      return { label: "IN REVIEW", icon: "Target", tone: "primary" };
    case "ready_to_merge":
      return { label: "READY", icon: "Check", tone: "success" };
    default:
      return { label: "OPEN", icon: "GitBranch", tone: "muted" };
  }
}
