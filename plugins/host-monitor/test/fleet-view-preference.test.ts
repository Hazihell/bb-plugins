import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_FLEET_VIEW,
  FLEET_VIEW_STORAGE_KEY,
  parseFleetViewPreference,
  readFleetViewPreference,
  writeFleetViewPreference,
  type FleetViewStorage,
} from "../lib/fleet-view-preference.ts";

function memoryStorage(initial?: string): FleetViewStorage & {
  values: Map<string, string>;
} {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(FLEET_VIEW_STORAGE_KEY, initial);
  return {
    values,
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

describe("Host Monitor fleet view preference", () => {
  it("uses cards by default for missing or unrecognized values", () => {
    assert.equal(DEFAULT_FLEET_VIEW, "cards");
    assert.equal(parseFleetViewPreference(null), "cards");
    assert.equal(parseFleetViewPreference("grid"), "cards");
    assert.equal(readFleetViewPreference(memoryStorage()), "cards");
    assert.equal(readFleetViewPreference(null), "cards");
  });

  it("round-trips both supported layouts", () => {
    const storage = memoryStorage();

    assert.equal(writeFleetViewPreference("rows", storage), true);
    assert.equal(readFleetViewPreference(storage), "rows");

    assert.equal(writeFleetViewPreference("cards", storage), true);
    assert.equal(readFleetViewPreference(storage), "cards");
  });

  it("falls back safely when browser storage is unavailable", () => {
    const unavailable: FleetViewStorage = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    };

    assert.equal(readFleetViewPreference(unavailable), "cards");
    assert.equal(writeFleetViewPreference("rows", unavailable), false);
  });
});
