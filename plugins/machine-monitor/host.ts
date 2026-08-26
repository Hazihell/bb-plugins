import { experimental_defineHostEntry } from "@get-bb/plugin-sdk/host";
import { hostContract } from "./contract.js";
import { collectMachineSnapshot } from "./lib/metrics.js";

export default experimental_defineHostEntry({
  contract: hostContract,
  handlers: {
    snapshot: ({ cpuSampleMs }, context) =>
      collectMachineSnapshot({
        cpuSampleMs,
        signal: context.signal,
      }),
  },
});
