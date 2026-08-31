import type { BbPluginApi } from '@get-bb/plugin-sdk';

const LEGACY_ISSUE_DRAFT_REQUEST_PREFIX = 'issue-draft:request:';
const LEGACY_ISSUE_DRAFT_THREAD_PREFIX = 'issue-draft:thread:';
const LEGACY_ISSUE_DRAFT_CANCELLATION_PREFIX = 'issue-draft:cancellation:';
const LEGACY_ISSUE_DRAFT_TITLE = 'Draft Taskboard issue';
const LEGACY_ISSUE_DRAFT_PAGE_SIZE = 200;

interface LegacyIssueDraftThread {
  id: string;
  title: string | null;
  titleFallback: string | null;
  originPluginId: string | null;
  visibility: 'visible' | 'hidden';
  archivedAt: number | null;
}

export function isLegacyIssueDraftHelper(
  thread: LegacyIssueDraftThread,
  pluginId: string
): boolean {
  return (
    thread.originPluginId === pluginId &&
    thread.visibility === 'hidden' &&
    (thread.title === LEGACY_ISSUE_DRAFT_TITLE ||
      thread.titleFallback === LEGACY_ISSUE_DRAFT_TITLE)
  );
}

async function listLegacyIssueDraftHelpers(
  bb: BbPluginApi,
  archived: boolean
): Promise<LegacyIssueDraftThread[]> {
  const helpers: LegacyIssueDraftThread[] = [];
  for (let offset = 0; ; offset += LEGACY_ISSUE_DRAFT_PAGE_SIZE) {
    const page = await bb.sdk.threads.list({
      archived,
      includeHidden: true,
      originPluginId: bb.pluginId,
      limit: LEGACY_ISSUE_DRAFT_PAGE_SIZE,
      offset
    });
    helpers.push(
      ...page.filter(thread =>
        isLegacyIssueDraftHelper(thread, bb.pluginId)
      )
    );
    if (page.length < LEGACY_ISSUE_DRAFT_PAGE_SIZE) break;
  }
  return helpers;
}

export async function cleanupLegacyIssueDraftHelpers(
  bb: BbPluginApi
): Promise<void> {
  const keyFamilies = await Promise.all([
    bb.storage.kv.list(LEGACY_ISSUE_DRAFT_REQUEST_PREFIX),
    bb.storage.kv.list(LEGACY_ISSUE_DRAFT_THREAD_PREFIX),
    bb.storage.kv.list(LEGACY_ISSUE_DRAFT_CANCELLATION_PREFIX)
  ]);
  const helpers = new Map<string, LegacyIssueDraftThread>();
  for (const archived of [false, true]) {
    for (const thread of await listLegacyIssueDraftHelpers(bb, archived)) {
      helpers.set(thread.id, thread);
    }
  }

  for (const thread of helpers.values()) {
    if (thread.archivedAt === null) {
      await bb.sdk.threads.archive({ threadId: thread.id });
    }
    await bb.sdk.threads.stop({ threadId: thread.id });
  }

  for (const key of keyFamilies.flat()) {
    await bb.storage.kv.delete(key);
  }
}
