import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pullRequestPresentation } from "../lib/pull-request-presentation.ts";

describe("pullRequestPresentation", () => {
  it("gives terminal states precedence over stale attention", () => {
    assert.deepEqual(
      pullRequestPresentation({ state: "merged", attention: "checks_failed" }),
      { label: "MERGED", icon: "Check", tone: "merged" },
    );
    assert.deepEqual(
      pullRequestPresentation({ state: "closed", attention: "ready_to_merge" }),
      { label: "CLOSED", icon: "CircleX", tone: "muted" },
    );
    assert.deepEqual(
      pullRequestPresentation({ state: "draft", attention: "none" }),
      { label: "DRAFT", icon: "GitBranch", tone: "muted" },
    );
  });

  it("maps open pull request attention into compact semantic states", () => {
    const cases = [
      ["changes_requested", "CHANGES", "destructive"],
      ["blocked", "BLOCKED", "destructive"],
      ["checks_failed", "BLOCKED", "destructive"],
      ["conflicts", "BLOCKED", "destructive"],
      ["checks_pending", "CHECKS", "primary"],
      ["review_requested", "IN REVIEW", "primary"],
      ["ready_to_merge", "READY", "success"],
      ["none", "OPEN", "muted"],
    ] as const;

    for (const [attention, label, tone] of cases) {
      const presentation = pullRequestPresentation({
        state: "open",
        attention,
      });
      assert.equal(presentation.label, label);
      assert.equal(presentation.tone, tone);
    }
  });
});
