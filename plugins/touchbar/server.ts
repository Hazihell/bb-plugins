import type { BbPluginApi } from "@get-bb/plugin-sdk";
import {
  THREAD_QUERY_LIMIT,
  buildSnapshot,
  renderCard,
  renderSummary,
  resolveCardLimit,
  type ThreadSnapshotInput,
  type TouchBarSnapshot,
} from "./lib/snapshot.js";

const USAGE = [
  "Usage:",
  "  bb touchbar snapshot [--pretty]",
  "  bb touchbar card <summary|0|1|2|3|4|5>",
  "  bb touchbar open <thread-id>",
  "  bb touchbar open-card <0|1|2|3|4|5>",
  "  bb touchbar stop <thread-id>",
].join("\n");

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function failure(message: string) {
  return { exitCode: 1, stderr: message };
}

function parseSlot(raw: string | undefined): number | null {
  if (raw === undefined || !/^[0-5]$/u.test(raw)) return null;
  return Number(raw);
}

export default async function touchBarPlugin(bb: BbPluginApi): Promise<void> {
  const settings = bb.settings.define({
    cardLimit: {
      type: "string",
      label: "Thread cards",
      description: "Number of prioritized thread cards exposed to the Touch Bar (1–24).",
      default: "24",
    },
    includeHidden: {
      type: "boolean",
      label: "Include hidden workers",
      description:
        "Show hidden child and plugin worker threads. Off by default to keep background work private.",
      default: false,
    },
  });

  async function snapshot(): Promise<TouchBarSnapshot> {
    const values = await settings.get();
    const [threads, projects] = await Promise.all([
      bb.sdk.threads.list({
        archived: false,
        includeHidden: true,
        limit: THREAD_QUERY_LIMIT,
      }),
      bb.sdk.projects.list({ includePersonal: true }),
    ]);
    const projectNames = new Map(
      projects.map((project) => [project.id, project.name] as const),
    );
    return buildSnapshot(threads as ThreadSnapshotInput[], {
      cardLimit: resolveCardLimit(values.cardLimit),
      includeHidden: values.includeHidden,
      projectNames,
    });
  }

  async function resolveThread(threadId: string) {
    try {
      const thread = await bb.sdk.threads.get({ threadId });
      if (thread.archivedAt !== null || thread.deletedAt !== null) return null;
      return thread;
    } catch (error) {
      bb.log.warn(`Could not resolve Touch Bar thread: ${errorMessage(error)}`);
      return null;
    }
  }

  async function openThread(threadId: string) {
    const thread = await resolveThread(threadId);
    if (thread === null) return failure("Thread not found or no longer open.");
    await bb.sdk.threads.open({ threadId: thread.id, file: null });
    return { exitCode: 0, stdout: `Opened ${thread.id}` };
  }

  async function stopThread(threadId: string) {
    const thread = await resolveThread(threadId);
    if (thread === null) return failure("Thread not found or no longer open.");
    if (thread.status !== "active" && thread.status !== "starting") {
      return failure("Only an active or starting thread can be stopped.");
    }
    await bb.sdk.threads.stop({ threadId: thread.id });
    return { exitCode: 0, stdout: `Stopped ${thread.id}` };
  }

  bb.cli.register({
    name: "touchbar",
    summary: "Show BB agent activity on an Intel Mac Touch Bar",
    commands: [
      {
        name: "snapshot",
        summary: "Print the bounded Touch Bar JSON snapshot",
        usage: "bb touchbar snapshot [--pretty]",
      },
      {
        name: "card",
        summary: "Render one BetterTouchTool label",
        usage: "bb touchbar card <summary|0|1|2|3|4|5>",
      },
      {
        name: "open",
        summary: "Open one exact BB thread",
        usage: "bb touchbar open <thread-id>",
      },
      {
        name: "open-card",
        summary: "Open the current thread in one Touch Bar slot",
        usage: "bb touchbar open-card <0|1|2|3|4|5>",
      },
      {
        name: "stop",
        summary: "Stop one exact active BB thread",
        usage: "bb touchbar stop <thread-id>",
      },
    ],
    async run(argv) {
      const [command, ...args] = argv;
      try {
        switch (command) {
          case undefined:
          case "help":
          case "--help":
            return { exitCode: 0, stdout: USAGE };
          case "snapshot": {
            if (args.some((arg) => arg !== "--pretty")) break;
            const current = await snapshot();
            return {
              exitCode: 0,
              stdout: args.includes("--pretty")
                ? JSON.stringify(current, null, 2)
                : JSON.stringify(current),
            };
          }
          case "card": {
            if (args.length !== 1) break;
            const current = await snapshot();
            if (args[0] === "summary") {
              return { exitCode: 0, stdout: renderSummary(current) };
            }
            const slot = parseSlot(args[0]);
            if (slot === null) break;
            return { exitCode: 0, stdout: renderCard(current, slot) };
          }
          case "open":
            if (args.length !== 1) break;
            return await openThread(args[0]!);
          case "open-card": {
            if (args.length !== 1) break;
            const slot = parseSlot(args[0]);
            if (slot === null) break;
            const thread = (await snapshot()).threads[slot];
            if (thread === undefined) return failure("That Touch Bar slot is empty.");
            return await openThread(thread.id);
          }
          case "stop":
            if (args.length !== 1) break;
            return await stopThread(args[0]!);
        }
      } catch (error) {
        bb.log.warn(`Touch Bar command failed: ${errorMessage(error)}`);
        return failure("BB Touch Bar command failed. Check the BB connection and retry.");
      }
      return failure(USAGE);
    },
  });
}
