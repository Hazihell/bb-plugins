import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { BbPluginApi } from '@get-bb/plugin-sdk';
import {
  cleanupLegacyIssueDraftHelpers,
  isLegacyIssueDraftHelper
} from '../legacy-issue-draft-cleanup.ts';

const activeHelper = {
  id: 'thread-active',
  title: 'Draft Taskboard issue',
  titleFallback: null,
  originPluginId: 'taskboard',
  visibility: 'hidden' as const,
  archivedAt: null
};

const archivedHelper = {
  id: 'thread-archived',
  title: null,
  titleFallback: 'Draft Taskboard issue',
  originPluginId: 'taskboard',
  visibility: 'hidden' as const,
  archivedAt: 1
};

test('recognizes only the old hidden Taskboard helper identity', () => {
  assert.equal(isLegacyIssueDraftHelper(activeHelper, 'taskboard'), true);
  assert.equal(
    isLegacyIssueDraftHelper(
      { ...activeHelper, visibility: 'visible' },
      'taskboard'
    ),
    false
  );
  assert.equal(
    isLegacyIssueDraftHelper(
      { ...activeHelper, originPluginId: 'another-plugin' },
      'taskboard'
    ),
    false
  );
  assert.equal(
    isLegacyIssueDraftHelper(
      { ...activeHelper, title: 'Ordinary thread' },
      'taskboard'
    ),
    false
  );
});

test('archives and stops legacy helpers before clearing every old key family', async () => {
  const keys = new Map([
    ['issue-draft:request:', ['issue-draft:request:req-1']],
    ['issue-draft:thread:', ['issue-draft:thread:thread-active']],
    ['issue-draft:cancellation:', ['issue-draft:cancellation:req-2']]
  ]);
  const archived: string[] = [];
  const stopped: string[] = [];
  const deleted: string[] = [];
  const unrelated = {
    ...activeHelper,
    id: 'ordinary-thread',
    title: 'Ordinary thread'
  };
  const bb = {
    pluginId: 'taskboard',
    storage: {
      kv: {
        list: async (prefix: string) => keys.get(prefix) ?? [],
        delete: async (key: string) => {
          deleted.push(key);
        }
      }
    },
    sdk: {
      threads: {
        list: async ({ archived: isArchived, offset }: {
          archived: boolean;
          offset: number;
        }) =>
          offset > 0
            ? []
            : isArchived
              ? [archivedHelper]
              : [activeHelper, unrelated],
        archive: async ({ threadId }: { threadId: string }) => {
          archived.push(threadId);
        },
        stop: async ({ threadId }: { threadId: string }) => {
          stopped.push(threadId);
          return { ok: true as const };
        }
      }
    }
  } as unknown as BbPluginApi;

  await cleanupLegacyIssueDraftHelpers(bb);

  assert.deepEqual(archived, ['thread-active']);
  assert.deepEqual(stopped.sort(), ['thread-active', 'thread-archived']);
  assert.deepEqual(deleted.sort(), [...keys.values()].flat().sort());
});

test('retains legacy keys when helper shutdown must be retried', async () => {
  const deleted: string[] = [];
  const bb = {
    pluginId: 'taskboard',
    storage: {
      kv: {
        list: async (prefix: string) => [`${prefix}legacy`],
        delete: async (key: string) => {
          deleted.push(key);
        }
      }
    },
    sdk: {
      threads: {
        list: async ({ archived, offset }: {
          archived: boolean;
          offset: number;
        }) => (!archived && offset === 0 ? [activeHelper] : []),
        archive: async () => activeHelper,
        stop: async () => {
          throw new Error('host unavailable');
        }
      }
    }
  } as unknown as BbPluginApi;

  await assert.rejects(
    cleanupLegacyIssueDraftHelpers(bb),
    /host unavailable/u
  );
  assert.deepEqual(deleted, []);
});
