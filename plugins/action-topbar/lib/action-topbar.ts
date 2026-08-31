import {
  ACTION_CATALOG_STORAGE_KEY,
  actionKind,
  applyDiscoveredCatalog,
  catalogFingerprint,
  compactActionLabel,
  initialActionCatalog,
  serializeActionCatalog,
  uniqueActions,
  type ActionDescriptor,
  type ActionKind,
} from "./action-catalog.js";

const ROOT_ATTRIBUTE = "data-action-topbar";
const HEADER_ACTIONS_SELECTOR = "[data-thread-header-pane-actions]";
const HEADER_ROW_SELECTOR = '[data-testid="app-page-header-content-row"]';
const NEW_TAB_ACTIONS_SELECTOR = '[data-testid="new-tab-actions"]';
const PANE_SELECTOR = "[data-split-pane-id]";
const FOCUSED_PANE_SELECTOR = `${PANE_SELECTOR}[data-focused="true"]`;
const PANEL_CHROME_SELECTOR =
  '[data-testid="thread-secondary-panel-top-chrome"]';
const POINTER_DRAG_DISTANCE_PX = 7;
const ELEMENT_WAIT_TIMEOUT_MS = 1_500;
const ELEMENT_WAIT_STEP_MS = 30;

type Feedback = "idle" | "loading" | "success" | "error";

interface DragState {
  action: ActionDescriptor;
  button: HTMLButtonElement;
  engaged: boolean;
  overlay: HTMLDivElement | null;
  ghost: HTMLDivElement | null;
  startX: number;
  startY: number;
  target: HTMLElement | null;
}

function isVisible(element: HTMLElement): boolean {
  return (
    !element.hidden &&
    element.getAttribute("aria-hidden") !== "true" &&
    element.getClientRects().length > 0
  );
}

function visibleElement<T extends HTMLElement>(selector: string): T | null {
  return (
    Array.from(document.querySelectorAll<T>(selector)).find(isVisible) ?? null
  );
}

function threadHeaderRowIn(scope: ParentNode): HTMLElement | null {
  return scope
    .querySelector<HTMLElement>(HEADER_ACTIONS_SELECTOR)
    ?.closest<HTMLElement>(HEADER_ROW_SELECTOR) ?? null;
}

function activeThreadHeaderRow(): HTMLElement | null {
  const focusedPane = document.querySelector<HTMLElement>(
    FOCUSED_PANE_SELECTOR,
  );
  const focusedRow = focusedPane === null ? null : threadHeaderRowIn(focusedPane);
  if (focusedRow !== null) return focusedRow;
  return (
    Array.from(document.querySelectorAll<HTMLElement>(HEADER_ACTIONS_SELECTOR))
      .map((actions) => actions.closest<HTMLElement>(HEADER_ROW_SELECTOR))
      .find((row): row is HTMLElement => row !== null && isVisible(row)) ?? null
  );
}

function headerMountTarget(row: HTMLElement): HTMLElement | null {
  const target = row.firstElementChild;
  return target instanceof HTMLElement ? target : null;
}

function longestTextNode(element: HTMLElement): string {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let best = "";
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    const text = node.textContent?.trim().replace(/\s+/g, " ") ?? "";
    if (text.length > best.length) best = text;
  }
  return best;
}

function discoverLauncherActions(): ActionDescriptor[] {
  if (activeThreadHeaderRow() === null) return [];
  const launcher = visibleElement<HTMLElement>(NEW_TAB_ACTIONS_SELECTOR);
  if (launcher === null) return [];
  return uniqueActions(
    Array.from(launcher.querySelectorAll<HTMLButtonElement>("button[id]")).map(
      (button) => ({ id: button.id, label: longestTextNode(button) }),
    ),
  );
}

function glyphText(kind: ActionKind, label: string): string {
  switch (kind) {
    case "browser":
      return "◎";
    case "terminal":
      return ">_";
    case "recap":
      return "≋";
    case "files":
      return "▱";
    case "git":
      return "⑂";
    case "chat":
      return "…";
    case "task":
      return "□";
    case "workflow":
      return "⌘";
    case "generic":
      return compactActionLabel(label).slice(0, 1).toUpperCase();
  }
}

function buttonWithAriaPrefix(
  prefix: string,
  preferredScope?: ParentNode,
): HTMLButtonElement | null {
  const matches = (scope: ParentNode): HTMLButtonElement | null =>
    Array.from(scope.querySelectorAll<HTMLButtonElement>("button[aria-label]")).find(
      (button) =>
        button.getAttribute("aria-label")?.startsWith(prefix) === true &&
        isVisible(button),
    ) ?? null;
  return (preferredScope ? matches(preferredScope) : null) ?? matches(document);
}

function actionButton(action: ActionDescriptor): HTMLButtonElement | null {
  const exact = document.getElementById(action.id);
  if (exact instanceof HTMLButtonElement && isVisible(exact)) return exact;

  const wanted = compactActionLabel(action.label).toLowerCase();
  const launcher = visibleElement<HTMLElement>(NEW_TAB_ACTIONS_SELECTOR);
  if (launcher === null) return null;
  return (
    Array.from(launcher.querySelectorAll<HTMLButtonElement>("button[id]")).find(
      (button) =>
        compactActionLabel(longestTextNode(button)).toLowerCase() === wanted,
    ) ?? null
  );
}

function abortableDelay(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      // The timer and abort listener disarm one another before settling.
      // oxlint-disable-next-line promise/no-multiple-resolved
      resolve();
    };
    const timer = window.setTimeout(finish, ms);
    signal.addEventListener("abort", finish, { once: true });
  });
}

async function waitFor<T>(
  read: () => T | null,
  signal: AbortSignal,
): Promise<T | null> {
  const deadline = Date.now() + ELEMENT_WAIT_TIMEOUT_MS;
  while (!signal.aborted && Date.now() < deadline) {
    const value = read();
    if (value !== null) return value;
    await abortableDelay(ELEMENT_WAIT_STEP_MS, signal);
  }
  return null;
}

async function focusPane(
  pane: HTMLElement | null,
  signal: AbortSignal,
): Promise<void> {
  if (pane === null || pane.dataset.focused === "true") return;
  const EventConstructor = window.PointerEvent ?? window.MouseEvent;
  pane.dispatchEvent(
    new EventConstructor("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: pane.getBoundingClientRect().left + 8,
      clientY: pane.getBoundingClientRect().top + 8,
    }),
  );
  await waitFor(() => (pane.dataset.focused === "true" ? pane : null), signal);
  await abortableDelay(ELEMENT_WAIT_STEP_MS, signal);
}

async function ensureNewTab(
  preferredPane: HTMLElement | null,
  signal: AbortSignal,
): Promise<boolean> {
  if (visibleElement<HTMLElement>(NEW_TAB_ACTIONS_SELECTOR) !== null) return true;

  if (visibleElement<HTMLElement>(PANEL_CHROME_SELECTOR) === null) {
    const showPanel = buttonWithAriaPrefix("Show right panel", preferredPane ?? undefined);
    showPanel?.click();
    if (
      (await waitFor(
        () => visibleElement<HTMLElement>(PANEL_CHROME_SELECTOR),
        signal,
      )) === null
    ) {
      return false;
    }
  }

  const openNewTab = buttonWithAriaPrefix("Open new tab");
  if (openNewTab === null) return false;
  openNewTab.click();
  return (
    (await waitFor(
      () => visibleElement<HTMLElement>(NEW_TAB_ACTIONS_SELECTOR),
      signal,
    )) !== null
  );
}

async function launchAction(
  action: ActionDescriptor,
  pane: HTMLElement | null,
  signal: AbortSignal,
): Promise<boolean> {
  await focusPane(pane, signal);
  let launcherButton = actionButton(action);
  if (launcherButton === null) {
    if (!(await ensureNewTab(pane, signal))) return false;
    launcherButton = await waitFor(() => actionButton(action), signal);
  }
  if (launcherButton === null || signal.aborted) return false;
  launcherButton.click();
  return true;
}

async function openNewTab(
  pane: HTMLElement | null,
  signal: AbortSignal,
): Promise<boolean> {
  await focusPane(pane, signal);
  if (visibleElement<HTMLElement>(PANEL_CHROME_SELECTOR) === null) {
    const showPanel = buttonWithAriaPrefix("Show right panel", pane ?? undefined);
    showPanel?.click();
    if (
      (await waitFor(
        () => visibleElement<HTMLElement>(PANEL_CHROME_SELECTOR),
        signal,
      )) === null
    ) {
      return false;
    }
  }
  const button = buttonWithAriaPrefix("Open new tab");
  if (button === null) return false;
  button.click();
  return true;
}

function paneAt(clientX: number, clientY: number): HTMLElement | null {
  for (const element of document.elementsFromPoint(clientX, clientY)) {
    if (!(element instanceof HTMLElement)) continue;
    const pane = element.closest<HTMLElement>(PANE_SELECTOR);
    if (pane !== null && pane.getAttribute("aria-hidden") !== "true") return pane;
  }
  return null;
}

function singlePaneDropTarget(
  clientX: number,
  clientY: number,
  root: HTMLElement,
): HTMLElement | null {
  if (document.querySelector(PANE_SELECTOR) !== null) return null;
  if (document.elementsFromPoint(clientX, clientY).some((node) => root.contains(node))) {
    return null;
  }
  const header = activeThreadHeaderRow()?.closest<HTMLElement>("header");
  const container = header?.parentElement ?? null;
  if (container === null) return null;
  const rect = container.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    ? container
    : null;
}

function makeDragOverlay(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.className = "action-topbar__drop-overlay";
  const label = document.createElement("span");
  label.className = "action-topbar__drop-label";
  overlay.append(label);
  document.body.append(overlay);
  return overlay;
}

function positionDragOverlay(
  overlay: HTMLDivElement,
  target: HTMLElement | null,
  action: ActionDescriptor,
): void {
  if (target === null) {
    overlay.hidden = true;
    return;
  }
  const rect = target.getBoundingClientRect();
  overlay.hidden = false;
  overlay.style.left = `${rect.left + 6}px`;
  overlay.style.top = `${rect.top + 6}px`;
  overlay.style.width = `${Math.max(0, rect.width - 12)}px`;
  overlay.style.height = `${Math.max(0, rect.height - 12)}px`;
  const label = overlay.firstElementChild;
  if (label instanceof HTMLElement) {
    label.textContent = `Open ${compactActionLabel(action.label)} here`;
  }
}

function makeDragGhost(action: ActionDescriptor): HTMLDivElement {
  const ghost = document.createElement("div");
  ghost.className = "action-topbar__drag-ghost";
  ghost.textContent = compactActionLabel(action.label);
  document.body.append(ghost);
  return ghost;
}

export function mountActionTopbar(signal: AbortSignal): () => void {
  const root = document.createElement("div");
  root.className = "action-topbar";
  root.setAttribute(ROOT_ATTRIBUTE, "");
  root.setAttribute("role", "toolbar");
  root.setAttribute("aria-label", "Thread actions");

  const viewport = document.createElement("div");
  viewport.className = "action-topbar__viewport";
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "action-topbar__add";
  addButton.setAttribute("aria-label", "Open BB New tab");
  addButton.title = "Open BB New tab";
  addButton.textContent = "+";
  const live = document.createElement("span");
  live.className = "action-topbar__live";
  live.setAttribute("aria-live", "polite");
  root.append(viewport, addButton, live);

  let actions = initialActionCatalog(
    (() => {
      try {
        return localStorage.getItem(ACTION_CATALOG_STORAGE_KEY);
      } catch {
        return null;
      }
    })(),
  );
  let actionFingerprint = catalogFingerprint(actions);
  let reconcileFrame: number | null = null;
  let drag: DragState | null = null;
  let ignoreClicksUntil = 0;
  let disposed = false;
  const feedback = new Map<string, Feedback>();
  const buttons = new Map<string, HTMLButtonElement>();
  const feedbackTimers = new Set<number>();

  const setFeedback = (action: ActionDescriptor, value: Feedback): void => {
    feedback.set(action.id, value);
    const button = buttons.get(action.id);
    if (button !== undefined) {
      button.dataset.feedback = value;
      button.disabled = value === "loading";
    }
    if (value === "error") {
      live.textContent = `${action.label} is unavailable. Open BB New tab to refresh the action list.`;
    } else if (value === "success") {
      live.textContent = `${action.label} opened.`;
    }
  };

  const settleFeedback = (action: ActionDescriptor, value: Feedback): void => {
    setFeedback(action, value);
    const timer = window.setTimeout(() => {
      feedbackTimers.delete(timer);
      if (!disposed) setFeedback(action, "idle");
    }, value === "error" ? 2_400 : 1_000);
    feedbackTimers.add(timer);
  };

  const requestLaunch = async (
    action: ActionDescriptor,
    pane: HTMLElement | null,
  ): Promise<void> => {
    if (feedback.get(action.id) === "loading") return;
    setFeedback(action, "loading");
    const opened = await launchAction(action, pane, signal).catch(() => false);
    if (!signal.aborted) settleFeedback(action, opened ? "success" : "error");
  };

  const endDrag = (drop: boolean): void => {
    const current = drag;
    if (current === null) return;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerCancel);
    current.overlay?.remove();
    current.ghost?.remove();
    current.button.dataset.dragging = "false";
    document.body.classList.remove("action-topbar-is-dragging");
    drag = null;
    if (!current.engaged) return;
    ignoreClicksUntil = Date.now() + 350;
    if (drop && current.target !== null) {
      const pane = current.target.matches(PANE_SELECTOR) ? current.target : null;
      void requestLaunch(current.action, pane);
    }
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (drag === null) return;
    if (!drag.engaged) {
      const distance = Math.hypot(
        event.clientX - drag.startX,
        event.clientY - drag.startY,
      );
      if (distance < POINTER_DRAG_DISTANCE_PX) return;
      drag.engaged = true;
      drag.overlay = makeDragOverlay();
      drag.ghost = makeDragGhost(drag.action);
      drag.button.dataset.dragging = "true";
      document.body.classList.add("action-topbar-is-dragging");
    }
    event.preventDefault();
    if (drag.ghost !== null) {
      drag.ghost.style.left = `${event.clientX + 12}px`;
      drag.ghost.style.top = `${event.clientY + 8}px`;
    }
    drag.target =
      paneAt(event.clientX, event.clientY) ??
      singlePaneDropTarget(event.clientX, event.clientY, root);
    if (drag.overlay !== null) {
      positionDragOverlay(drag.overlay, drag.target, drag.action);
    }
  };

  const handlePointerUp = (): void => endDrag(true);
  const handlePointerCancel = (): void => endDrag(false);

  const beginDrag = (
    event: PointerEvent,
    action: ActionDescriptor,
    button: HTMLButtonElement,
  ): void => {
    if (event.button !== 0 || feedback.get(action.id) === "loading") return;
    endDrag(false);
    drag = {
      action,
      button,
      engaged: false,
      overlay: null,
      ghost: null,
      startX: event.clientX,
      startY: event.clientY,
      target: null,
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp, { once: true });
    window.addEventListener("pointercancel", handlePointerCancel, { once: true });
  };

  const render = (): void => {
    buttons.clear();
    const fragment = document.createDocumentFragment();
    for (const action of actions) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "action-topbar__item";
      button.dataset.actionId = action.id;
      button.dataset.kind = actionKind(action);
      button.dataset.feedback = feedback.get(action.id) ?? "idle";
      button.setAttribute(
        "aria-label",
        `${action.label}. Click to open in the focused pane; drag to another split pane.`,
      );
      button.title = `${action.label} · Click to open · Drag to a pane`;
      const glyph = document.createElement("span");
      glyph.className = "action-topbar__glyph";
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = glyphText(actionKind(action), action.label);
      const label = document.createElement("span");
      label.className = "action-topbar__label";
      label.textContent = compactActionLabel(action.label);
      button.append(glyph, label);
      button.addEventListener("pointerdown", (event) =>
        beginDrag(event, action, button),
      );
      button.addEventListener("click", () => {
        if (Date.now() < ignoreClicksUntil) return;
        void requestLaunch(action, null);
      });
      fragment.append(button);
      buttons.set(action.id, button);
    }
    viewport.replaceChildren(fragment);
  };

  const saveActions = (): void => {
    try {
      localStorage.setItem(
        ACTION_CATALOG_STORAGE_KEY,
        serializeActionCatalog(actions),
      );
    } catch {
      // Local storage only keeps the learned inventory between app launches.
    }
  };

  const reconcile = (): void => {
    reconcileFrame = null;
    if (disposed || signal.aborted) return;
    const headerRow = activeThreadHeaderRow();
    const target = headerRow === null ? null : headerMountTarget(headerRow);
    if (target === null) {
      root.remove();
    } else if (root.parentElement !== target) {
      target.append(root);
    }

    const discovered = discoverLauncherActions();
    const nextActions = applyDiscoveredCatalog(actions, discovered);
    const nextFingerprint = catalogFingerprint(nextActions);
    if (nextFingerprint !== actionFingerprint) {
      actions = nextActions;
      actionFingerprint = nextFingerprint;
      saveActions();
      render();
    }
  };

  const scheduleReconcile = (): void => {
    if (reconcileFrame !== null || disposed) return;
    reconcileFrame = window.requestAnimationFrame(reconcile);
  };

  addButton.addEventListener("click", () => {
    void openNewTab(null, signal).then((opened) => {
      live.textContent = opened
        ? "BB New tab opened."
        : "The current surface has no thread right panel.";
      return undefined;
    });
  });

  const observer = new MutationObserver(scheduleReconcile);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-focused", "aria-hidden"],
  });

  render();
  reconcile();

  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    endDrag(false);
    if (reconcileFrame !== null) window.cancelAnimationFrame(reconcileFrame);
    for (const timer of feedbackTimers) window.clearTimeout(timer);
    feedbackTimers.clear();
    root.remove();
  };
  signal.addEventListener("abort", dispose, { once: true });
  return dispose;
}
