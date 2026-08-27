import { z } from 'zod';
import {
  browsePreferencesV1Schema,
  type BrowsePreferences
} from './browse-preferences.ts';
import { bbProjectIdSchema } from './credential-contract.ts';

export const FILTER_PRESET_NAME_MAX_LENGTH = 60;
export const FILTER_PRESET_NORMALIZED_NAME_MAX_LENGTH = 240;
export const FILTER_PRESET_ID_MAX_LENGTH = 100;
export const FILTER_PRESET_PROJECT_ID_MAX_LENGTH = 500;
export const FILTER_PRESET_LIMIT = 50;
export const FILTER_PRESET_STATE_JSON_MAX_LENGTH = 1_000_000;

const unsafeControlCharacters =
  /[\u0000-\u001f\u007f-\u009f\u061c\u200e\u200f\u2028-\u202e\u2066-\u2069]/u;

function hasUnsafeControlCharacters(value: string): boolean {
  return unsafeControlCharacters.test(value);
}

export const filterPresetProjectIdSchema = bbProjectIdSchema
  .min(6)
  .max(FILTER_PRESET_PROJECT_ID_MAX_LENGTH)
  .refine(value => !hasUnsafeControlCharacters(value), {
    message: 'Project id cannot contain control characters'
  });

export const filterPresetIdSchema = z
  .string()
  .refine(value => !hasUnsafeControlCharacters(value), {
    message: 'Preset id cannot contain control characters'
  })
  .trim()
  .min(1)
  .max(FILTER_PRESET_ID_MAX_LENGTH);

export const filterPresetNameSchema = z
  .string()
  .refine(value => !hasUnsafeControlCharacters(value), {
    message: 'Preset name cannot contain control characters'
  })
  .trim()
  .min(1)
  .max(FILTER_PRESET_NAME_MAX_LENGTH);

const controlFreePresetStateInputSchema = z.unknown().superRefine(
  (input, context) => {
    const pending: Array<{
      value: unknown;
      path: Array<string | number>;
    }> = [{ value: input, path: [] }];
    const seen = new WeakSet<object>();
    let inspected = 0;
    while (pending.length > 0) {
      const current = pending.pop()!;
      inspected += 1;
      if (inspected > 2_000) {
        context.addIssue({
          code: 'custom',
          message: 'Preset state is too complex'
        });
        return;
      }
      if (typeof current.value === 'string') {
        if (hasUnsafeControlCharacters(current.value)) {
          context.addIssue({
            code: 'custom',
            path: current.path,
            message: 'Preset state cannot contain control characters'
          });
        }
        continue;
      }
      if (typeof current.value !== 'object' || current.value === null) {
        continue;
      }
      if (seen.has(current.value)) continue;
      seen.add(current.value);
      if (Array.isArray(current.value)) {
        current.value.forEach((value, index) => {
          pending.push({ value, path: [...current.path, index] });
        });
        continue;
      }
      for (const [key, value] of Object.entries(current.value)) {
        if (hasUnsafeControlCharacters(key)) {
          context.addIssue({
            code: 'custom',
            path: [...current.path, key],
            message: 'Preset state cannot contain control characters'
          });
        }
        pending.push({ value, path: [...current.path, key] });
      }
    }
  }
);

export const filterPresetStateSchema = controlFreePresetStateInputSchema
  .pipe(browsePreferencesV1Schema)
  .superRefine((state, context) => {
    if (state.provider === null) {
      context.addIssue({
        code: 'custom',
        path: ['provider'],
        message: 'A project preset must record its provider'
      });
    } else if (state.source !== 'all' && state.source !== state.provider) {
      context.addIssue({
        code: 'custom',
        path: ['source'],
        message: 'A project preset source must match its provider'
      });
    }
  });

export const filterPresetSchema = z
  .object({
    id: filterPresetIdSchema,
    projectId: filterPresetProjectIdSchema,
    name: filterPresetNameSchema,
    state: filterPresetStateSchema,
    position: z.number().int().min(0).max(FILTER_PRESET_LIMIT - 1)
  })
  .strict();
export type FilterPreset = z.infer<typeof filterPresetSchema>;

export const filterPresetOrderSchema = z
  .array(filterPresetIdSchema)
  .max(FILTER_PRESET_LIMIT);

/**
 * Persisted uniqueness must not vary with the host locale. NFKC also makes
 * compatibility-equivalent spellings (for example full-width letters)
 * collide instead of creating visually duplicate preset names.
 */
export function normalizePresetName(name: string): string {
  const normalized = filterPresetNameSchema
    .parse(name)
    .normalize('NFKC')
    .toLowerCase();
  if (normalized.length > FILTER_PRESET_NORMALIZED_NAME_MAX_LENGTH) {
    throw new Error('Normalized filter preset name is too long');
  }
  return normalized;
}

/**
 * A reorder must be an exact permutation of the visible, parseable preset
 * ids. Anything else means the client is stale, so reject rather than guess.
 */
export function resolvePresetOrder(
  currentIds: readonly string[],
  requestedIds: readonly string[]
): string[] {
  const currentValues = filterPresetOrderSchema.parse(currentIds);
  const requestedValues = filterPresetOrderSchema.parse(requestedIds);
  if (requestedValues.length !== currentValues.length) {
    throw new Error('Preset order must list every preset exactly once');
  }
  const current = new Set(currentValues);
  if (current.size !== currentValues.length) {
    throw new Error('Stored preset order contains duplicate ids');
  }
  const seen = new Set<string>();
  for (const id of requestedValues) {
    if (!current.has(id)) throw new Error(`Unknown filter preset: ${id}`);
    if (seen.has(id)) throw new Error(`Duplicate filter preset: ${id}`);
    seen.add(id);
  }
  return [...requestedValues];
}

export function serializeFilterPresetState(state: BrowsePreferences): string {
  const serialized = JSON.stringify(filterPresetStateSchema.parse(state));
  if (serialized.length > FILTER_PRESET_STATE_JSON_MAX_LENGTH) {
    throw new Error('Filter preset state is too large');
  }
  return serialized;
}
