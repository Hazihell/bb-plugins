import test from "node:test";
import assert from "node:assert/strict";
import {
  clearPreferences,
  listPreferences,
  preferenceKey,
  readPreference,
  writePreference,
} from "../lib/preferences.ts";

function installStorage() {
  const map = new Map<string, string>();
  const localStorage = {
    get length() {
      return map.size;
    },
    key: (index: number) => [...map.keys()][index] ?? null,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => map.set(key, value),
    removeItem: (key: string) => map.delete(key),
  };
  (globalThis as { window?: unknown }).window = { localStorage };
  return { localStorage, map };
}

test("isolates project, host, and provider selections", () => {
  installStorage();
  writePreference({
    projectId: "alpha",
    hostId: "local",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
  writePreference({
    projectId: "alpha",
    hostId: "remote",
    providerId: "codex",
    model: "o4",
    reasoningLevel: "medium",
  });
  writePreference({
    projectId: "alpha",
    hostId: "local",
    providerId: "claude",
    model: "sonnet",
    reasoningLevel: "low",
  });
  assert.equal(readPreference("alpha", "local", "codex")?.model, "o3");
  assert.equal(readPreference("alpha", "remote", "codex")?.model, "o4");
  assert.equal(readPreference("alpha", "local", "claude")?.model, "sonnet");
  assert.equal(listPreferences().length, 3);
});

test("normalizes empty and malformed hosts to browser-wide scope", () => {
  installStorage();
  writePreference({
    projectId: "alpha",
    hostId: "\u0000invalid",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
  assert.equal(
    preferenceKey("alpha", "", "codex"),
    preferenceKey("alpha", "\u0000invalid", "codex"),
  );
  assert.deepEqual(readPreference("alpha", "   ", "codex"), {
    projectId: "alpha",
    hostId: "",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
});

test("reads provider-scoped legacy values before matching unscoped values", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "unscoped");
  localStorage.setItem("bb.promptbox.reasoning", "low");
  localStorage.setItem("bb.promptbox.model-codex-1", "provider-scoped");
  localStorage.setItem("bb.promptbox.reasoning-codex-1", "xhigh");
  assert.equal(
    readPreference("alpha", "host-a", "codex")?.model,
    "provider-scoped",
  );
  assert.equal(
    readPreference("alpha", "host-a", "codex")?.reasoningLevel,
    "xhigh",
  );
});

test("uses unscoped legacy values only for their owning provider", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "o3");
  localStorage.setItem("bb.promptbox.reasoning", "high");
  assert.equal(readPreference("alpha", "host-a", "codex")?.model, "o3");
  assert.equal(readPreference("alpha", "host-a", "claude"), null);
});

test("keeps a legacy model when no reasoning was stored", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "o3");
  assert.deepEqual(readPreference("alpha", "host-a", "codex"), {
    projectId: "alpha",
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "none",
  });
});

test("contains malformed and oversized storage while listing", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.save-my-model.v2:%E0%A4%A::codex", "{}");
  localStorage.setItem(
    "bb.save-my-model.v2:alpha::oversized",
    "x".repeat(2_049),
  );
  for (let index = 0; index < 205; index += 1) {
    localStorage.setItem(
      `bb.save-my-model.v2:project-${index}::codex`,
      JSON.stringify({ model: "o3", reasoningLevel: "high" }),
    );
  }
  assert.doesNotThrow(() => listPreferences());
  assert.equal(listPreferences().length, 200);
});

test("ignores malformed values and clears only current plugin keys", () => {
  const { localStorage } = installStorage();
  localStorage.setItem(
    "bb.save-my-model.v2:project:bad:provider",
    "not-json",
  );
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("other", "keep");
  assert.equal(readPreference("project", "bad", "provider"), null);
  clearPreferences();
  assert.equal(localStorage.getItem("other"), "keep");
  assert.equal(localStorage.getItem("bb.promptbox.provider"), "codex");
});
