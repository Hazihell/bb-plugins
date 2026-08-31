export type FleetViewMode = "cards" | "rows";

export const FLEET_VIEW_STORAGE_KEY = "host-monitor:fleet-view:v1";
export const DEFAULT_FLEET_VIEW: FleetViewMode = "cards";

export interface FleetViewStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function parseFleetViewPreference(value: string | null): FleetViewMode {
  return value === "rows" || value === "cards" ? value : DEFAULT_FLEET_VIEW;
}

export function readFleetViewPreference(
  storage: Pick<FleetViewStorage, "getItem"> | null | undefined,
): FleetViewMode {
  if (storage === null || storage === undefined) return DEFAULT_FLEET_VIEW;
  try {
    return parseFleetViewPreference(storage.getItem(FLEET_VIEW_STORAGE_KEY));
  } catch {
    return DEFAULT_FLEET_VIEW;
  }
}

export function writeFleetViewPreference(
  mode: FleetViewMode,
  storage: Pick<FleetViewStorage, "setItem"> | null | undefined,
): boolean {
  if (storage === null || storage === undefined) return false;
  try {
    storage.setItem(FLEET_VIEW_STORAGE_KEY, mode);
    return true;
  } catch {
    return false;
  }
}
