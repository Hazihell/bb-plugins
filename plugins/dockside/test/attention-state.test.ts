import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  childSecondaryState,
  rootSecondaryState,
  semanticStateToneClass,
  type SemanticStateTone,
} from "../lib/attention-state.ts";

describe("attention-first secondary state", () => {
  it("selects family work before PR on roots", () => {
    assert.equal(
      rootSecondaryState({
        waitingForAgents: true,
        hasPullRequest: true,
      }),
      "agents-working",
    );
    assert.equal(
      rootSecondaryState({
        waitingForAgents: false,
        hasPullRequest: true,
      }),
      "pull-request",
    );
  });

  it("selects child live status before PR and never selects Done", () => {
    assert.equal(
      childSecondaryState({
        hasStatus: true,
        hasPullRequest: true,
      }),
      "status",
    );
    assert.equal(
      childSecondaryState({
        hasStatus: false,
        hasPullRequest: true,
      }),
      "pull-request",
    );
    assert.equal(
      childSecondaryState({
        hasStatus: false,
        hasPullRequest: false,
      }),
      null,
    );
  });

  it("returns no state when a row has nothing to say", () => {
    assert.equal(
      rootSecondaryState({
        waitingForAgents: false,
        hasPullRequest: false,
      }),
      null,
    );
    assert.equal(
      childSecondaryState({
        hasStatus: false,
        hasPullRequest: false,
      }),
      null,
    );
  });
});

describe("semanticStateToneClass", () => {
  it("maps every named semantic role to theme-token utilities", () => {
    const expected: Record<SemanticStateTone, string> = {
      destructive: "bg-destructive/10 text-destructive",
      merged: "bg-primary/10 text-[color:var(--pr-merged)]",
      muted: "bg-muted text-muted-foreground",
      primary: "bg-primary/10 text-primary",
      success: "bg-primary/10 text-success-foreground",
    };
    for (const [tone, className] of Object.entries(expected)) {
      assert.equal(
        semanticStateToneClass(tone as SemanticStateTone),
        className,
      );
    }
  });
});
