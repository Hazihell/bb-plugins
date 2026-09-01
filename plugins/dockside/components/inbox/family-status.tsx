import { Icon } from "@/components/ui/icon";
import type { FamilyStatusPresentation } from "@/lib/family-status";
import { cn } from "@/lib/utils";

export function familyStatusColor(status: FamilyStatusPresentation): string {
  return `var(--dockside-status-${status.colorRole})`;
}

export function FamilyStatusIcon({
  status,
  className,
}: {
  status: FamilyStatusPresentation;
  className?: string;
}) {
  return (
    <span
      tabIndex={0}
      aria-label={`${status.label}: ${status.description}`}
      title={`${status.label}: ${status.description}`}
      className={cn(
        "group/family-status relative z-10 inline-flex size-5 shrink-0 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      style={{ color: familyStatusColor(status) }}
    >
      <Icon
        name={status.icon}
        aria-hidden
        className={cn(
          "size-3.5",
          status.animated &&
            (status.icon === "Loading" ? "animate-spin" : "animate-pulse"),
        )}
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-40 mb-1 w-max max-w-56 translate-y-0.5 rounded-md border border-border bg-popover px-2 py-1.5 text-left text-2xs leading-tight text-popover-foreground opacity-0 shadow-md transition-all group-hover/family-status:translate-y-0 group-hover/family-status:opacity-100 group-focus/family-status:translate-y-0 group-focus/family-status:opacity-100"
      >
        <span className="block font-semibold">{status.label}</span>
        <span className="mt-0.5 block whitespace-normal text-muted-foreground">
          {status.description}
        </span>
      </span>
    </span>
  );
}

export function FamilyStatusBadge({
  status,
  preview = false,
}: {
  status: FamilyStatusPresentation;
  preview?: boolean;
}) {
  return (
    <span
      data-dockside-family-status={status.kind}
      className={cn(
        "inline-flex h-4 shrink-0 items-center rounded px-1.5 text-[10px] font-semibold leading-none",
        status.receded ? "bg-muted/45" : "bg-current/10",
        preview && "h-5 px-2 text-2xs",
      )}
      style={{ color: familyStatusColor(status) }}
    >
      {status.label}
    </span>
  );
}
