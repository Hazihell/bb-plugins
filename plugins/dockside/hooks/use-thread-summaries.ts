import { useEffect, useMemo, useState } from "react";
import {
  useRpc,
  type PluginSidebarThread,
} from "@bb/plugin-sdk/app";
import type { docksideRpcContract } from "@/server";
import { threadIsWorking } from "@/lib/inbox";

const EMPTY_SUMMARIES: ReadonlyMap<string, string> = new Map();
const MAX_SUMMARIES_PER_REQUEST = 50;

interface SummaryRequest {
  threadId: string;
  updatedAt: number;
}

interface SummaryState {
  key: string;
  summaries: ReadonlyMap<string, string>;
}

/**
 * Fetch final outcomes only for quiet rows. Callers decide which descendants
 * are mounted, so collapsed child families never trigger background reads.
 */
export function useThreadSummaries(
  threads: readonly PluginSidebarThread[],
): ReadonlyMap<string, string> {
  const rpc = useRpc<typeof docksideRpcContract>();
  const requestKey = JSON.stringify(
    threads
      .filter(
        (thread) =>
          !thread.hasPendingInteraction && !threadIsWorking(thread),
      )
      .map(({ id: threadId, updatedAt }) => ({ threadId, updatedAt })),
  );
  const requests = useMemo(
    () => JSON.parse(requestKey) as SummaryRequest[],
    [requestKey],
  );
  const [state, setState] = useState<SummaryState>({
    key: "",
    summaries: EMPTY_SUMMARIES,
  });

  useEffect(() => {
    let cancelled = false;
    if (requests.length === 0) {
      setState({ key: requestKey, summaries: EMPTY_SUMMARIES });
      return () => {
        cancelled = true;
      };
    }

    const batches: SummaryRequest[][] = [];
    for (let index = 0; index < requests.length; index += MAX_SUMMARIES_PER_REQUEST) {
      batches.push(requests.slice(index, index + MAX_SUMMARIES_PER_REQUEST));
    }

    void Promise.all(
      batches.map((batch) =>
        rpc.call("listThreadSummaries", { threads: batch }),
      ),
    )
      .then((results) => {
        if (cancelled) return undefined;
        const summaries = new Map<string, string>();
        for (const result of results) {
          for (const row of result.summaries) {
            if (row.text !== null) summaries.set(row.threadId, row.text);
          }
        }
        setState({ key: requestKey, summaries });
        return undefined;
      })
      .catch(() => {
        if (!cancelled) {
          setState({ key: requestKey, summaries: EMPTY_SUMMARIES });
        }
        return undefined;
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, requests, rpc]);

  return state.key === requestKey ? state.summaries : EMPTY_SUMMARIES;
}
