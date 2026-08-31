// bb-plugin-dockside — a project-first replacement for bb's sidebar thread
// list. Root threads keep a stable position and expand their child agents in
// place, so activity changes state without moving the user's navigation.
import { definePluginApp } from "@bb/plugin-sdk/app";
import { ThreadInbox } from "@/components/inbox/thread-inbox";
import { ParentChip } from "@/components/inbox/parent-chip";

export default definePluginApp((app) => {
  app.slots.experimental_threadList({
    id: "inbox",
    title: "Dockside (projects)",
    description:
      "Stable project groups with expandable root threads and inline agents.",
    component: ThreadInbox,
  });

  // A child remains nested in the sidebar, and this is the direct route back
  // to its root while the user is focused in the thread itself.
  app.slots.experimental_threadHeaderAction({
    id: "parent",
    title: "Parent thread",
    component: ParentChip,
  });
});
