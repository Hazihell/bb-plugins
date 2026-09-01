import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pullRequestPresentation } from "../lib/pull-request-presentation.ts";

describe("pullRequestPresentation", () => {
  it("gives terminal states precedence over stale attention", () => {
    assert.deepEqual(
      pullRequestPresentation({ state: "merged", attention: "checks_failed" }),
      { label: "MERGED", icon: "GitMerge", tone: "merged" },
    );
    assert.deepEqual(
      pullRequestPresentation({ state: "closed", attention: "ready_to_merge" }),
      {
        label: "CLOSED",
        icon: "GitPullRequestClosed",
        tone: "closed",
      },
    );
    assert.deepEqual(
      pullRequestPresentation({ state: "draft", attention: "none" }),
      { label: "DRAFT", icon: "GitPullRequestDraft", tone: "muted" },
    );
  });

  it("maps open pull request attention into compact semantic states", () => {
    const cases = [
      ["changes_requested", "CHANGES", "destructive", "CircleX"],
      ["blocked", "BLOCKED", "destructive", "CircleX"],
      ["checks_failed", "BLOCKED", "destructive", "CircleX"],
      ["conflicts", "BLOCKED", "destructive", "CircleX"],
      ["checks_pending", "CHECKS", "warning", "Hourglass"],
      ["review_requested", "IN REVIEW", "primary", "Eye"],
      ["ready_to_merge", "READY", "success", "Check"],
      ["none", "OPEN", "muted", "GitPullRequest"],
    ] as const;

    for (const [attention, label, tone, icon] of cases) {
      const presentation = pullRequestPresentation({
        state: "open",
        attention,
      });
      assert.equal(presentation.label, label);
      assert.equal(presentation.tone, tone);
      assert.equal(presentation.icon, icon);
    }
  });
});
