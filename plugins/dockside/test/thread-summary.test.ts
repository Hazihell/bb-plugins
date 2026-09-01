import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PluginSidebarThread } from "@bb/plugin-sdk";
import {
  BoundedThreadSummaryCache,
  familyWaitingForAgents,
  normalizeFinalOutput,
} from "../lib/thread-summary.ts";

function thread(
  overrides: Partial<PluginSidebarThread> = {},
): PluginSidebarThread {
  return {
    id: "thr_1",
    projectId: "proj_1",
    title: "Thread",
    titleFallback: null,
    parentThreadId: null,
    sectionId: null,
    originKind: null,
    originPluginId: null,
    providerId: "codex",
    hasPendingInteraction: false,
    activity: {
      workflows: 0,
      backgroundAgents: 0,
      backgroundCommands: 0,
      planMode: 0,
      goals: 0,
    },
    indicator: "none",
    indicatorLabel: null,
    isUnread: false,
    isPinned: false,
    isArchived: false,
    environment: null,
    host: null,
    createdAt: 100,
    updatedAt: 100,
    lastReadAt: 100,
    latestAttentionAt: 100,
    ...overrides,
  };
}

describe("normalizeFinalOutput", () => {
  it("removes controls, collapses whitespace, and rejects empty output", () => {
    assert.equal(
      normalizeFinalOutput("  Done\n\twith\u0000 care\u0085  "),
      "Done with care",
    );
    assert.equal(normalizeFinalOutput("\n\t\u0000"), null);
    assert.equal(normalizeFinalOutput(null), null);
  });

  it("bounds the result with a single ellipsis", () => {
    assert.equal(normalizeFinalOutput("123456789", 6), "12345…");
    const bounded = normalizeFinalOutput("x".repeat(121));
    assert.equal(bounded?.length, 120);
    assert.equal(bounded?.endsWith("…"), true);
  });
});

describe("BoundedThreadSummaryCache", () => {
  it("keeps null hits, refreshes recency, and evicts the oldest entry", () => {
    const cache = new BoundedThreadSummaryCache(2);
    cache.set("one", 1, null);
    cache.set("two", 1, "Two");
    assert.deepEqual(cache.get("one", 1), { found: true, text: null });
    cache.set("three", 1, "Three");
    assert.deepEqual(cache.get("two", 1), { found: false, text: null });
    assert.equal(cache.size, 2);
  });

  it("invalidates every timestamp for one deleted thread", () => {
    const cache = new BoundedThreadSummaryCache();
    cache.set("one", 1, "Old");
    cache.set("one", 2, "New");
    cache.set("two", 1, "Keep");
    cache.deleteThread("one");
    assert.equal(cache.get("one", 2).found, false);
    assert.equal(cache.get("two", 1).found, true);
  });
});

describe("familyWaitingForAgents", () => {
  it("responds only to live child work", () => {
    assert.equal(familyWaitingForAgents([thread()]), false);
    assert.equal(
      familyWaitingForAgents([
        thread({ activity: { ...thread().activity, backgroundAgents: 1 } }),
      ]),
      true,
    );
  });
});
