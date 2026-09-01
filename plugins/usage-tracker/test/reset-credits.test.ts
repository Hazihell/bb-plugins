import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeCodexResetCreditsResponse,
} from "../lib/codex-reset-credits.ts";
import {
  formatResetCredits,
  normalizeUsage,
  withCodexResetCredits,
} from "../lib/usage.ts";

test("reads the authoritative Codex reset count", () => {
  assert.equal(
    normalizeCodexResetCreditsResponse({
      rateLimitResetCredits: { availableCount: 3, credits: null },
    }),
    3,
  );
  assert.equal(
    normalizeCodexResetCreditsResponse({
      rateLimitResetCredits: { availableCount: "4", credits: [] },
    }),
    4,
  );
  assert.equal(
    normalizeCodexResetCreditsResponse({ rateLimitResetCredits: null }),
    null,
  );
  assert.equal(normalizeCodexResetCreditsResponse({}), null);
  assert.equal(
    normalizeCodexResetCreditsResponse({
      rateLimitResetCredits: { availableCount: -1 },
    }),
    null,
  );
});

test("attaches reset availability to Codex only", () => {
  const snapshot = normalizeUsage(
    {
      codex: {
        status: "ok",
        accountEmail: null,
        planLabel: null,
        windows: [],
      },
    },
    { id: null, name: null },
  );
  const enriched = withCodexResetCredits(snapshot, 2);

  assert.deepEqual(enriched.providers[0]?.resetCredits, {
    availableCount: 2,
  });
  assert.equal(enriched.providers[1]?.resetCredits, undefined);
  assert.equal(formatResetCredits(1), "1 reset available");
  assert.equal(formatResetCredits(2), "2 resets available");
});

test("rejects invalid reset counts before they reach the UI", () => {
  const snapshot = normalizeUsage({}, { id: null, name: null });
  assert.throws(
    () => withCodexResetCredits(snapshot, -1),
    /non-negative integers/u,
  );
  assert.throws(
    () => withCodexResetCredits(snapshot, Number.MAX_SAFE_INTEGER + 1),
    /non-negative integers/u,
  );
});
