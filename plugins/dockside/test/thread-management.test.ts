import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  PluginSidebarProject,
  PluginSidebarThread,
} from "@bb/plugin-sdk";
import { groupThreadsByProject } from "../lib/inbox.ts";
import {
  bulkEligibility,
  DAY_MS,
  familyIsQuiet,
  familyUpdatedAt,
  filterProjectThreadGroups,
  includeSelectedFamilies,
  pruneSelectedRootIds,
  selectableRootIds,
} from "../lib/thread-management.ts";

function thread(
  overrides: Partial<PluginSidebarThread> = {},
): PluginSidebarThread {
  return {
    id: "thr_1",
    projectId: "proj_1",
    title: "A thread",
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

const projects: PluginSidebarProject[] = [
  { id: "proj_1", name: "One", isPersonal: false },
  { id: "proj_2", name: "Two", isPersonal: false },
];

describe("family status", () => {
  it("uses the newest member update and requires every member to be quiet", () => {
    const groups = groupThreadsByProject(
      [
        thread({ id: "root", updatedAt: 10 }),
        thread({
          id: "child",
          parentThreadId: "root",
          updatedAt: 40,
          isUnread: true,
        }),
      ],
      projects,
    );
    const family = groups[0]?.families[0];
    assert.ok(family);
    assert.equal(familyUpdatedAt(family), 40);
    assert.equal(familyIsQuiet(family), false);
  });
});

describe("filterProjectThreadGroups", () => {
  const now = 10 * DAY_MS;
  const groups = groupThreadsByProject(
    [
      thread({ id: "working", indicator: "runtime", updatedAt: now }),
      thread({
        id: "waiting",
        hasPendingInteraction: true,
        updatedAt: now - 2 * DAY_MS,
      }),
      thread({ id: "unread", isUnread: true, updatedAt: now - 8 * DAY_MS }),
      thread({ id: "quiet-new", updatedAt: now - DAY_MS + 1 }),
      thread({ id: "quiet-day", updatedAt: now - DAY_MS }),
      thread({
        id: "quiet-week",
        projectId: "proj_2",
        updatedAt: now - 7 * DAY_MS,
      }),
    ],
    projects,
  );

  function ids(preset: Parameters<typeof filterProjectThreadGroups>[1]) {
    return filterProjectThreadGroups(groups, preset, now).flatMap((group) =>
      group.families.map((family) => family.root.id),
    );
  }

  it("supports attention and quiet presets", () => {
    assert.deepEqual(ids("working"), ["working"]);
    assert.deepEqual(ids("needs-you"), ["waiting"]);
    assert.deepEqual(ids("unread"), ["unread"]);
    assert.deepEqual(ids("quiet"), ["quiet-day", "quiet-new", "quiet-week"]);
  });

  it("uses inclusive family age boundaries", () => {
    assert.deepEqual(ids("quiet-1d"), ["quiet-day", "quiet-week"]);
    assert.deepEqual(ids("quiet-7d"), ["quiet-week"]);
  });

  it("preserves project and family order without mutating the input", () => {
    const before = groups.map((group) => group.families.length);
    assert.deepEqual(
      filterProjectThreadGroups(groups, "quiet", now).map(
        (group) => group.project.id,
      ),
      ["proj_1", "proj_2"],
    );
    assert.deepEqual(
      groups.map((group) => group.families.length),
      before,
    );
  });
});

describe("bulkEligibility", () => {
  function eligibility(
    root: Partial<PluginSidebarThread>,
    child?: Partial<PluginSidebarThread>,
    activeThreadId: string | null = null,
  ) {
    const rows = [thread({ id: "root", ...root })];
    if (child) rows.push(thread({ id: "child", parentThreadId: "root", ...child }));
    const family = groupThreadsByProject(rows, projects)[0]?.families[0];
    assert.ok(family);
    return bulkEligibility(family, activeThreadId);
  }

  it("protects the current, working, waiting, unread, and pinned family", () => {
    assert.deepEqual(eligibility({}, undefined, "root"), {
      eligible: false,
      reason: "current",
    });
    assert.deepEqual(eligibility({}, { indicator: "runtime" }), {
      eligible: false,
      reason: "working",
    });
    assert.deepEqual(eligibility({ hasPendingInteraction: true }), {
      eligible: false,
      reason: "waiting",
    });
    assert.deepEqual(eligibility({}, { isUnread: true }), {
      eligible: false,
      reason: "unread",
    });
    assert.deepEqual(eligibility({ isPinned: true }), {
      eligible: false,
      reason: "pinned",
    });
  });

  it("allows a quiet read family", () => {
    assert.deepEqual(eligibility({}, {}), { eligible: true });
  });
});

describe("selection helpers", () => {
  it("selects eligible visible roots and prunes roots that disappeared", () => {
    const groups = groupThreadsByProject(
      [thread({ id: "a" }), thread({ id: "b", isUnread: true })],
      projects,
    );
    assert.deepEqual(selectableRootIds(groups, null), ["a"]);
    assert.deepEqual(
      [...pruneSelectedRootIds(new Set(["a", "missing"]), groups)],
      ["a"],
    );
  });

  it("keeps a selected family visible after it stops matching the filter", () => {
    const allGroups = groupThreadsByProject(
      [
        thread({ id: "selected", isUnread: true }),
        thread({ id: "quiet" }),
      ],
      projects,
    );
    const quietGroups = filterProjectThreadGroups(allGroups, "quiet", 1_000);

    const visible = includeSelectedFamilies(
      quietGroups,
      allGroups,
      new Set(["selected"]),
    );

    assert.deepEqual(
      visible[0]?.families.map((family) => family.root.id),
      ["quiet", "selected"],
    );
  });
});
