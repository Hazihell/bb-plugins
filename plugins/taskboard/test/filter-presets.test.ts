import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultBrowsePreferences } from '../browse-preferences.ts';
import {
  FILTER_PRESET_LIMIT,
  filterPresetIdSchema,
  filterPresetNameSchema,
  filterPresetOrderSchema,
  filterPresetProjectIdSchema,
  filterPresetSchema,
  filterPresetStateSchema,
  normalizePresetName,
  resolvePresetOrder
} from '../filter-presets.ts';

function githubPreferences() {
  return defaultBrowsePreferences({ provider: 'github' });
}

test('accepts a complete strict project browse preference snapshot', () => {
  const state = {
    ...githubPreferences(),
    query: 'security',
    view: 'kanban' as const,
    stateCategories: ['in_progress' as const],
    statuses: ['Review'],
    assignees: ['Mateo'],
    priorities: ['High'],
    externalProjects: ['Taskboard'],
    labels: ['backend'],
    collapsedGroups: { done: false }
  };
  const preset = filterPresetSchema.parse({
    id: 'fp_1',
    projectId: 'proj_alpha',
    name: 'My work',
    state,
    position: 0
  });

  assert.deepEqual(preset.state, state);
  assert.equal(preset.name, 'My work');
  assert.throws(() =>
    filterPresetStateSchema.parse({ ...state, unexpected: true })
  );
});

test('requires a project provider and matching source', () => {
  assert.throws(() =>
    filterPresetStateSchema.parse(defaultBrowsePreferences())
  );
  assert.throws(() =>
    filterPresetStateSchema.parse({
      ...githubPreferences(),
      source: 'linear'
    })
  );
  assert.equal(
    filterPresetStateSchema.parse({
      ...githubPreferences(),
      source: 'github'
    }).source,
    'github'
  );
});

test('bounds names, ids, positions, order size, and state fields', () => {
  const base = {
    id: 'fp_1',
    projectId: 'proj_alpha',
    name: 'My work',
    state: githubPreferences(),
    position: 0
  };
  assert.throws(() => filterPresetSchema.parse({ ...base, name: '   ' }));
  assert.throws(() =>
    filterPresetSchema.parse({ ...base, name: 'x'.repeat(61) })
  );
  assert.throws(() => filterPresetIdSchema.parse('x'.repeat(101)));
  assert.throws(() => filterPresetProjectIdSchema.parse('proj_'));
  assert.throws(() =>
    filterPresetSchema.parse({ ...base, position: FILTER_PRESET_LIMIT })
  );
  assert.throws(() =>
    filterPresetOrderSchema.parse(
      Array.from({ length: FILTER_PRESET_LIMIT + 1 }, (_, index) =>
        `fp_${index}`
      )
    )
  );
  assert.throws(() =>
    filterPresetStateSchema.parse({
      ...githubPreferences(),
      query: 'x'.repeat(501)
    })
  );
  assert.throws(() =>
    filterPresetStateSchema.parse({
      ...githubPreferences(),
      labels: Array.from({ length: 101 }, (_, index) => `label-${index}`)
    })
  );
});

test('rejects control characters in preset identity and state', () => {
  for (const control of ['\n', '\u0000', '\u0085', '\u202e', '\u2067']) {
    assert.throws(() => filterPresetNameSchema.parse(`left${control}right`));
    assert.throws(() => filterPresetIdSchema.parse(`fp_${control}`));
    assert.throws(() =>
      filterPresetStateSchema.parse({
        ...githubPreferences(),
        assignees: [`left${control}right`]
      })
    );
  }
  assert.throws(() =>
    filterPresetStateSchema.parse({
      ...githubPreferences(),
      assignees: ['Mateo\n']
    })
  );
});

test('normalizes unique names without depending on locale', () => {
  assert.equal(normalizePresetName('  My Work '), 'my work');
  assert.equal(normalizePresetName('MY WORK'), normalizePresetName('my work'));
  assert.equal(normalizePresetName('\uff2d\uff59 \uff37\uff4f\uff52\uff4b'), 'my work');
  assert.equal(normalizePresetName('\u0130'), 'i\u0307');
  assert.equal(normalizePresetName('  \u0130S  '), 'i\u0307s');
  assert.equal(normalizePresetName('\u0130'.repeat(60)).length, 120);
});

test('resolves only exact preset order permutations', () => {
  assert.deepEqual(
    resolvePresetOrder(['a', 'b', 'c'], ['c', 'a', 'b']),
    ['c', 'a', 'b']
  );
  assert.throws(() => resolvePresetOrder(['a', 'b'], ['a']));
  assert.throws(() => resolvePresetOrder(['a', 'b'], ['a', 'z']));
  assert.throws(() => resolvePresetOrder(['a', 'b'], ['a', 'a']));
  assert.throws(() => resolvePresetOrder(['a', 'a'], ['a', 'a']));
});
