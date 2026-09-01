import test from "node:test";
import assert from "node:assert/strict";
import {
  clearPreferences,
  listPreferences,
  preferenceKey,
  providerPreferenceKey,
  readPreference,
  readProviderPreference,
  writePreference,
  writeProviderPreference,
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

test("round-trips the selected provider and its execution preference per host", () => {
  installStorage();
  writeProviderPreference("host-a", "codex");
  assert.equal(readProviderPreference("host-a"), "codex");

  writePreference({
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
  assert.deepEqual(readPreference("host-a"), {
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
});

test("isolates host and provider execution selections", () => {
  installStorage();
  writePreference({
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
  writePreference({
    hostId: "host-b",
    providerId: "codex",
    model: "o4",
    reasoningLevel: "medium",
  });
  writePreference({
    hostId: "host-a",
    providerId: "claude",
    model: "sonnet",
    reasoningLevel: "low",
  });

  assert.equal(readPreference("host-a", "codex")?.model, "o3");
  assert.equal(readPreference("host-b", "codex")?.model, "o4");
  assert.equal(readPreference("host-a", "claude")?.model, "sonnet");
  assert.equal(listPreferences().length, 3);
});

test("normalizes empty and malformed hosts to one browser-wide scope", () => {
  installStorage();
  writePreference({
    hostId: "\u0000invalid",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });

  assert.equal(
    providerPreferenceKey(""),
    providerPreferenceKey("\u0000invalid"),
  );
  assert.equal(
    preferenceKey("", "codex"),
    preferenceKey("\u0000invalid", "codex"),
  );
  assert.deepEqual(readPreference("   "), {
    hostId: "",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
});

test("recovers the selected provider from the legacy unscoped key", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  assert.equal(readProviderPreference("host-a"), "codex");
});

test("reads provider-scoped legacy values before matching unscoped values", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "unscoped");
  localStorage.setItem("bb.promptbox.reasoning", "low");
  localStorage.setItem("bb.promptbox.model-codex-1", "provider-scoped");
  localStorage.setItem("bb.promptbox.reasoning-codex-1", "xhigh");

  assert.equal(readPreference("host-a")?.model, "provider-scoped");
  assert.equal(readPreference("host-a")?.reasoningLevel, "xhigh");
});

test("recovers a complete unscoped legacy selection without a provider argument", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "o3");
  localStorage.setItem("bb.promptbox.reasoning", "high");

  assert.deepEqual(readPreference("host-a"), {
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
});

test("uses unscoped legacy values only for their owning provider", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "o3");
  localStorage.setItem("bb.promptbox.reasoning", "high");

  assert.equal(readPreference("host-a", "codex")?.model, "o3");
  assert.equal(readPreference("host-a", "claude"), null);
});

test("keeps a legacy model when no reasoning was stored", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("bb.promptbox.model", "o3");

  assert.deepEqual(readPreference("host-a"), {
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "none",
  });
});

test("changing the selected provider does not leak another provider's execution", () => {
  installStorage();
  writePreference({
    hostId: "host-a",
    providerId: "codex",
    model: "o3",
    reasoningLevel: "high",
  });
  writeProviderPreference("host-a", "claude");

  assert.equal(readPreference("host-a"), null);
  assert.equal(readPreference("host-a", "codex")?.model, "o3");
});

test("contains malformed and oversized storage while listing", () => {
  const { localStorage } = installStorage();
  localStorage.setItem(
    "bb.save-my-model.v3:execution:%E0%A4%A:codex",
    "{}",
  );
  localStorage.setItem(
    "bb.save-my-model.v3:execution:oversized:codex",
    "x".repeat(2_049),
  );
  for (let index = 0; index < 205; index += 1) {
    localStorage.setItem(
      `bb.save-my-model.v3:execution:host-${index}:codex`,
      JSON.stringify({ model: "o3", reasoningLevel: "high" }),
    );
  }

  assert.doesNotThrow(() => listPreferences());
  assert.equal(listPreferences().length, 200);
});

test("listing never turns an invalid explicit key into provider fallback", () => {
  const { localStorage } = installStorage();
  localStorage.setItem("bb.save-my-model.v3:provider:host-a", "codex");
  localStorage.setItem(
    "bb.save-my-model.v3:execution:host-a:%00invalid",
    JSON.stringify({ model: "wrong", reasoningLevel: "high" }),
  );
  localStorage.setItem(
    "bb.save-my-model.v3:execution:host-a:codex",
    JSON.stringify({ model: "right", reasoningLevel: "medium" }),
  );

  assert.deepEqual(listPreferences(), [
    {
      hostId: "host-a",
      providerId: "codex",
      model: "right",
      reasoningLevel: "medium",
    },
  ]);
});

test("bounds examined plugin records independently of valid results", () => {
  const { localStorage } = installStorage();
  for (let index = 0; index < 1_001; index += 1) {
    localStorage.setItem(
      `bb.save-my-model.v3:execution:%00bad-${index}:codex`,
      "{}",
    );
  }
  localStorage.setItem(
    "bb.save-my-model.v3:execution:host-a:codex",
    JSON.stringify({ model: "after-bound", reasoningLevel: "high" }),
  );

  assert.deepEqual(listPreferences(), []);
});

test("ignores malformed values and clears only plugin-owned keys", () => {
  const { localStorage } = installStorage();
  localStorage.setItem(
    "bb.save-my-model.v3:execution:host-a:codex",
    "not-json",
  );
  localStorage.setItem("bb.save-my-model.v3:provider:host-a", "codex");
  localStorage.setItem("bb.save-my-model.v2:project:host:codex", "old");
  localStorage.setItem("bb.promptbox.provider", "codex");
  localStorage.setItem("other", "keep");

  assert.equal(readPreference("host-a", "codex"), null);
  clearPreferences();
  assert.equal(localStorage.getItem("other"), "keep");
  assert.equal(localStorage.getItem("bb.promptbox.provider"), "codex");
  assert.equal(localStorage.getItem("bb.save-my-model.v3:provider:host-a"), null);
  assert.equal(localStorage.getItem("bb.save-my-model.v2:project:host:codex"), null);
});
