import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { mountActionTopbar } from "./lib/action-topbar.js";
import "./app.css";

export default definePluginApp((app) => {
  app.contentScripts.register({
    id: "action-topbar",
    mount: ({ signal }) => mountActionTopbar(signal),
  });
});
