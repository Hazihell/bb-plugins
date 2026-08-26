import { defineRpcContract } from "@get-bb/plugin-sdk";
import { z } from "zod";

const timestampSchema = z.number().int().nonnegative();
const bytesSchema = z.number().int().nonnegative();
const byteRateSchema = z
  .number()
  .int()
  .nonnegative()
  .max(Number.MAX_SAFE_INTEGER)
  .nullable();
const percentSchema = z.number().min(0).max(100);

export const healthThresholdsSchema = z
  .object({
    attentionPercent: z.number().min(1).lt(100),
    criticalPercent: z.number().gt(1).max(100),
  })
  .strict()
  .refine(
    ({ attentionPercent, criticalPercent }) =>
      attentionPercent < criticalPercent,
    { message: "Attention threshold must be lower than critical threshold." },
  );

export const capacitySchema = z
  .object({
    totalBytes: bytesSchema,
    usedBytes: bytesSchema,
    availableBytes: bytesSchema,
    usagePercent: percentSchema,
  })
  .strict();

export const ipAddressSchema = z.union([z.ipv4(), z.ipv6()]);

export const networkSnapshotSchema = z
  .object({
    primaryIpAddress: ipAddressSchema.nullable(),
    receiveBytesPerSecond: byteRateSchema,
    sendBytesPerSecond: byteRateSchema,
  })
  .strict()
  .superRefine((network, context) => {
    if (
      (network.receiveBytesPerSecond === null) !==
      (network.sendBytesPerSecond === null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Network receive and send rates must be available together.",
      });
    }
  });

export const machineSnapshotSchema = z
  .object({
    sampledAtMs: timestampSchema,
    durationMs: z.number().int().nonnegative(),
    system: z
      .object({
        hostname: z.string().min(1),
        osName: z.string().min(1),
        platform: z.string().min(1),
        arch: z.string().min(1),
        kernelRelease: z.string().min(1),
        kernelVersion: z.string().min(1),
        uptimeSeconds: z.number().nonnegative(),
        bootedAtMs: timestampSchema,
      })
      .strict(),
    network: networkSnapshotSchema,
    cpu: z
      .object({
        model: z.string(),
        logicalCores: z.number().int().positive(),
        usagePercent: percentSchema,
        loadAverage: z
          .tuple([
            z.number().nonnegative(),
            z.number().nonnegative(),
            z.number().nonnegative(),
          ])
          .nullable(),
      })
      .strict(),
    memory: capacitySchema,
    swap: capacitySchema.nullable(),
    disk: capacitySchema
      .extend({
        path: z.string().min(1),
      })
      .strict()
      .nullable(),
    issues: z.array(
      z
        .object({
          metric: z.enum([
            "system",
            "network",
            "cpu",
            "memory",
            "swap",
            "disk",
          ]),
          message: z.string().min(1),
        })
        .strict(),
    ),
  })
  .strict();

export type MachineSnapshot = z.infer<typeof machineSnapshotSchema>;

export const hostContract = defineRpcContract({
  snapshot: {
    input: z
      .object({
        cpuSampleMs: z.number().int().min(100).max(1_000),
      })
      .strict(),
    output: machineSnapshotSchema,
  },
});

export const hostSummarySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    status: z.enum(["connected", "disconnected"]),
    lastSeenAt: timestampSchema.nullable(),
  })
  .strict();

export const healthSchema = z.enum([
  "healthy",
  "attention",
  "critical",
  "offline",
  "unavailable",
]);

export const machineRowSchema = z
  .object({
    host: hostSummarySchema,
    snapshot: machineSnapshotSchema.nullable(),
    sampleState: z.enum(["fresh", "stale", "sampling", "error", "offline"]),
    health: healthSchema,
    error: z.string().nullable(),
    alert: z
      .object({
        metric: z.enum(["cpu", "memory", "disk"]),
        message: z.string().min(1),
      })
      .strict()
      .nullable(),
  })
  .strict();

export const dashboardSchema = z
  .object({
    generatedAtMs: timestampSchema,
    refreshIntervalMs: z.number().int().positive(),
    thresholds: healthThresholdsSchema,
    machines: z.array(machineRowSchema),
  })
  .strict();

export type Dashboard = z.infer<typeof dashboardSchema>;
export type MachineRow = z.infer<typeof machineRowSchema>;

export const preferencesSchema = z
  .object({
    sidebarThresholdColors: z.boolean(),
    thresholds: healthThresholdsSchema,
  })
  .strict();

export type HostMonitorPreferences = z.infer<typeof preferencesSchema>;

export const rpcContract = defineRpcContract({
  getPreferences: {
    input: z.null(),
    output: preferencesSchema,
  },
  dashboard: {
    input: z.null(),
    output: dashboardSchema,
  },
  refresh: {
    input: z
      .object({
        hostId: z.string().min(1).nullable(),
      })
      .strict(),
    output: dashboardSchema,
  },
});
