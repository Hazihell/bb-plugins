export type ReasoningLevel = 'none' | 'low' | 'medium' | 'high' | 'xhigh' | 'max' | 'ultra';
export interface Preference { hostId: string; providerId: string; model: string; reasoningLevel: ReasoningLevel; }
const PREFIX = 'bb.save-my-model.v1';
const valid = new Set<ReasoningLevel>(['none','low','medium','high','xhigh','max','ultra']);
function storage(): Storage | null { return typeof window === 'undefined' ? null : window.localStorage; }
function key(hostId: string, providerId: string) { return `${PREFIX}:${encodeURIComponent(hostId.trim())}:${encodeURIComponent(providerId.trim())}`; }
export function preferenceKey(hostId: string, providerId: string) { return key(hostId, providerId); }
export function readPreference(hostId: string, providerId: string): Preference | null {
  const s = storage(); if (!s || !providerId.trim()) return null;
  const raw = s.getItem(key(hostId, providerId)); if (!raw) return null;
  try { const value = JSON.parse(raw) as Partial<Preference>; if (typeof value.model !== 'string' || typeof value.reasoningLevel !== 'string' || !valid.has(value.reasoningLevel as ReasoningLevel)) return null; return { hostId: hostId.trim(), providerId: providerId.trim(), model: value.model, reasoningLevel: value.reasoningLevel as ReasoningLevel }; } catch { return null; }
}
export function writePreference(preference: Preference): void { storage()?.setItem(key(preference.hostId, preference.providerId), JSON.stringify({ model: preference.model, reasoningLevel: preference.reasoningLevel })); }
export function clearPreferences(): void { const s = storage(); if (!s) return; for (let i=s.length-1;i>=0;i--) { const k=s.key(i); if (k?.startsWith(`${PREFIX}:`)) s.removeItem(k); } }
export function listPreferences(): Preference[] { const s=storage(); const result: Preference[]=[]; if (!s) return result; for(let i=0;i<s.length;i++){const k=s.key(i); if(!k?.startsWith(`${PREFIX}:`)) continue; const parts=k.split(':'); if(parts.length!==3) continue; const host=decodeURIComponent(parts[1]); const provider=decodeURIComponent(parts[2]); const value=readPreference(host,provider); if(value) result.push(value);} return result; }
