export type RowSecondaryState =
  | "agents-working"
  | "done"
  | "pull-request"
  | "status"
  | null;

export type SemanticStateTone =
  | "destructive"
  | "merged"
  | "muted"
  | "primary"
  | "success";

export function rootSecondaryState({
  waitingForAgents,
  hasPullRequest,
  hasDone,
}: {
  waitingForAgents: boolean;
  hasPullRequest: boolean;
  hasDone: boolean;
}): RowSecondaryState {
  if (waitingForAgents) return "agents-working";
  if (hasPullRequest) return "pull-request";
  if (hasDone) return "done";
  return null;
}

export function childSecondaryState({
  hasStatus,
  hasPullRequest,
}: {
  hasStatus: boolean;
  hasPullRequest: boolean;
}): RowSecondaryState {
  if (hasStatus) return "status";
  if (hasPullRequest) return "pull-request";
  return null;
}

export function semanticStateToneClass(tone: SemanticStateTone): string {
  switch (tone) {
    case "destructive":
      return "bg-destructive/10 text-destructive";
    case "merged":
      return "bg-primary/10 text-[color:var(--pr-merged)]";
    case "primary":
      return "bg-primary/10 text-primary";
    case "success":
      return "bg-primary/10 text-success-foreground";
    case "muted":
      return "bg-muted text-muted-foreground";
  }
}
