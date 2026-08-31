import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  ArrowUp01Icon,
  CancelCircleIcon,
  CheckListIcon,
  CheckmarkSquare02Icon,
  Clock01Icon,
  ComputerTerminal01Icon,
  Edit02Icon,
  FilterHorizontalIcon,
  Folder01Icon,
  GitBranchIcon,
  HelpCircleIcon,
  Loading03Icon,
  PinIcon,
  Delete02Icon,
  Target02Icon,
  Tick02Icon,
  UserAdd01Icon,
  WorkflowCircle03Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Add: Add01Icon,
  ArrowTurnBackward: ArrowTurnBackwardIcon,
  Check: Tick02Icon,
  CheckSquare: CheckmarkSquare02Icon,
  ChevronDown: ArrowDown01Icon,
  ChevronLeft: ArrowLeft01Icon,
  ChevronRight: ArrowRight01Icon,
  ChevronUp: ArrowUp01Icon,
  CircleQuestion: HelpCircleIcon,
  CircleX: CancelCircleIcon,
  Clock: Clock01Icon,
  Edit: Edit02Icon,
  Filter: FilterHorizontalIcon,
  Folder: Folder01Icon,
  GitBranch: GitBranchIcon,
  ListTodo: CheckListIcon,
  Loading: Loading03Icon,
  Pin: PinIcon,
  Trash: Delete02Icon,
  Target: Target02Icon,
  Terminal: ComputerTerminal01Icon,
  UserRoundPlus: UserAdd01Icon,
  Workflow: WorkflowCircle03Icon,
} as const satisfies Record<string, IconSvgElement>;

export type IconName = keyof typeof ICON_MAP;

export function Icon({
  name,
  className,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
}: {
  name: IconName;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
}) {
  return (
    <HugeiconsIcon
      icon={ICON_MAP[name]}
      className={cn(className)}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      data-icon={name}
    />
  );
}
