const RATE_UNITS = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s", "PB/s"] as const;

export interface NetworkRateSummary {
  receive: string;
  send: string;
  accessibleText: string;
  available: boolean;
}

/** Format a byte rate compactly for both the full dashboard and sidebar UI. */
export function formatNetworkRate(bytesPerSecond: number | null): string {
  if (
    bytesPerSecond === null ||
    !Number.isFinite(bytesPerSecond) ||
    bytesPerSecond < 0
  ) {
    return "—";
  }

  let value = bytesPerSecond;
  let unitIndex = 0;
  while (value >= 1_024 && unitIndex < RATE_UNITS.length - 1) {
    value /= 1_024;
    unitIndex += 1;
  }

  const digits = unitIndex === 0 || value >= 100 ? 0 : 1;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);
  return `${formatted} ${RATE_UNITS[unitIndex]}`;
}

export function networkRateSummary(
  receiveBytesPerSecond: number | null,
  sendBytesPerSecond: number | null,
): NetworkRateSummary {
  const receive = formatNetworkRate(receiveBytesPerSecond);
  const send = formatNetworkRate(sendBytesPerSecond);
  const available = receive !== "—" || send !== "—";

  return {
    receive,
    send,
    accessibleText: available
      ? `Network receive ${receive}; send ${send}`
      : "Network throughput unavailable",
    available,
  };
}
