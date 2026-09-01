import { writeFile } from "node:fs/promises";

const cdpPort = 9223;
const appUrl = "http://127.0.0.1:38886";
const evidenceRoot = new URL("../artifacts/", import.meta.url);
const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(appUrl)}`,
  { method: "PUT" },
).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const eventWaiters = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const waiter = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) waiter?.reject(new Error(JSON.stringify(message.error)));
    else waiter?.resolve(message.result);
    return;
  }
  const waiters = eventWaiters.get(message.method) ?? [];
  eventWaiters.delete(message.method);
  for (const resolve of waiters) resolve(message.params);
});

function send(method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function once(method) {
  return new Promise((resolve) => {
    const waiters = eventWaiters.get(method) ?? [];
    waiters.push(resolve);
    eventWaiters.set(method, waiters);
  });
}

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function navigate(url) {
  const loaded = once("Page.loadEventFired");
  await send("Page.navigate", { url });
  await loaded;
  await sleep(2_500);
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

async function waitForSelector(selector, timeoutMs = 12_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return;
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${selector}`);
}

async function screenshot(filename, clip) {
  const capture = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true,
    clip: { ...clip, scale: 1 },
  });
  await writeFile(new URL(filename, evidenceRoot), Buffer.from(capture.data, "base64"));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1200,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await navigate(appUrl);
await evaluate(`localStorage.setItem("bb.sidebar.threadListProvider", JSON.stringify("dockside/inbox"))`);

await navigate(`${appUrl}/settings/plugins/dockside`);
const settings = await evaluate(`(() => {
  const preview = document.querySelector("[data-dockside-settings-preview]");
  const kinds = ["working", "needs-you", "unread", "failed", "inactive", "stale"];
  const templates = Object.fromEntries(kinds.map((kind) => {
    const badge = preview?.querySelector('[data-dockside-family-status="' + kind + '"]');
    const item = badge?.closest("li");
    const icon = item?.querySelector('[data-dockside-family-status-icon="' + kind + '"]');
    return [kind, { badge: badge?.outerHTML ?? "", icon: icon?.outerHTML ?? "" }];
  }));
  const activityRoles = [...(preview?.querySelectorAll("[data-dockside-status-color-role]") ?? [])]
    .map((node) => node.getAttribute("data-dockside-status-color-role"));
  return {
    templates,
    activityRoles: [...new Set(activityRoles)],
    previewVisible: Boolean(preview),
    text: preview?.textContent ?? "",
  };
})()`);

await navigate(appUrl);
await waitForSelector('[data-dockside-root-card]');
const projectBefore = await evaluate(`(() => {
  const projects = [...document.querySelectorAll('section[data-dockside-project]')];
  const initial = projects.map((section) => section.getAttribute('data-dockside-project'));
  if (projects.length >= 2) {
    const source = projects[0].querySelector(':scope > div > button[draggable="true"]');
    const target = projects[1];
    const transfer = new DataTransfer();
    source?.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: transfer }));
    const header = target.firstElementChild.getBoundingClientRect();
    target.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
      clientY: header.bottom - 1,
    }));
    target.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
      clientY: header.bottom - 1,
    }));
  }
  return { initial };
})()`);
await sleep(400);
const projectAfter = await evaluate(`(() => ({
  order: [...document.querySelectorAll('section[data-dockside-project]')]
    .map((section) => section.getAttribute('data-dockside-project')),
  stored: localStorage.getItem('bb.dockside.project-order.v1'),
}))()`);
await navigate(appUrl);
await waitForSelector('[data-dockside-root-card]');
const projectPersisted = await evaluate(`(() => ({
  order: [...document.querySelectorAll('section[data-dockside-project]')]
    .map((section) => section.getAttribute('data-dockside-project')),
  stored: localStorage.getItem('bb.dockside.project-order.v1'),
}))()`);

const realBefore = await evaluate(`(() => {
  const sections = [...document.querySelectorAll('[data-dockside-palette] section')];
  const project = sections.find((section) =>
    section.querySelectorAll('li[data-dockside-family]').length >= 2
  );
  const rows = project ? [...project.querySelectorAll('li[data-dockside-family]')]
    .filter((row) => !row.querySelector('[data-icon="Pin"]')) : [];
  const initial = rows.map((row) => row.getAttribute('data-dockside-family'));
  if (rows.length >= 2) {
    const source = rows[0].querySelector('[data-dockside-family-status-icon]');
    const target = rows[1];
    const transfer = new DataTransfer();
    source?.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: transfer }));
    const bounds = target.getBoundingClientRect();
    target.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
      clientY: bounds.bottom - 1,
    }));
    target.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: transfer,
      clientY: bounds.bottom - 1,
    }));
  }
  return {
    initial,
    projectName: project?.getAttribute('aria-label') ?? null,
    prTemplates: Object.fromEntries(['ready', 'merged', 'blocked'].map((kind) => {
      const state = document.querySelector('[data-dockside-pr-state="' + kind + '"]');
      return [kind, state?.closest('a')?.outerHTML ?? ''];
    })),
    actualKinds: [...document.querySelectorAll('[data-dockside-family-status]')]
      .map((node) => node.getAttribute('data-dockside-family-status')),
  };
})()`);
await sleep(400);
const afterDrag = await evaluate(`(() => ({
  stored: localStorage.getItem("bb.dockside.family-order.v1"),
  order: [...document.querySelectorAll('section[aria-label="' + ${JSON.stringify(
    realBefore.projectName,
  )} + '"] li[data-dockside-family]')]
    .map((row) => row.getAttribute('data-dockside-family')),
}))()`);

await navigate(appUrl);
await waitForSelector('[data-dockside-root-card]');
const persistedOrder = await evaluate(`(() => ({
  order: [...document.querySelectorAll('section[aria-label="' + ${JSON.stringify(
    realBefore.projectName,
  )} + '"] li[data-dockside-family]')]
    .map((row) => row.getAttribute('data-dockside-family')),
  stored: localStorage.getItem("bb.dockside.family-order.v1"),
}))()`);

const fixture = await evaluate(`(() => {
  const templates = ${JSON.stringify(settings.templates)};
  const prTemplates = ${JSON.stringify({})};
  Object.assign(prTemplates, ${JSON.stringify(realBefore.prTemplates)});
  const states = [
    ["working", "Run release workflow across every production environment", "feature/release-workflow-all-production-environments", "now", "ready"],
    ["needs-you", "Approve production deployment after security review", "feature/deploy-approval-security-review", "4m", null],
    ["unread", "Review completed accessibility audit recommendations", "feature/accessibility-audit-recommendations", "18m", "merged"],
    ["failed", "Repair failed integration checks for provider bridge", "fix/provider-bridge-integration-failure", "31m", "blocked"],
    ["inactive", "Prepare next sprint outline and dependency inventory", "chore/sprint-outline-dependency-inventory", "2h", null],
    ["stale", "Archive old migration experiment and compatibility notes", "archive/migration-v1-compatibility-notes", "3w", null],
  ];
  const dockside = document.querySelector('[data-dockside-palette]');
  const scroller = dockside?.querySelector('.overflow-y-auto');
  const base = [...document.querySelectorAll('[data-dockside-root-card]')]
    .find((card) => card.querySelector('[data-dockside-pr-state="ready"]')) ??
    document.querySelector('[data-dockside-root-card]');
  if (!dockside || !scroller || !base) throw new Error("Dockside fixture surface unavailable");
  const section = document.createElement('section');
  section.setAttribute('aria-label', 'Dockside state reference');
  section.className = 'mt-1.5';
  section.innerHTML = '<div class="flex h-8 items-center px-2 text-xs font-semibold">' +
    '<span>Dockside state reference</span><span class="ml-auto text-2xs text-muted-foreground">controlled live fixture</span></div>';
  const list = document.createElement('ul');
  list.className = 'mt-0.5 flex flex-col gap-1';
  const parser = document.createElement('template');
  states.forEach(([kind, title, branch, age, prKind], index) => {
    const row = base.closest('li').cloneNode(true);
    row.querySelectorAll('ul').forEach((node) => node.remove());
    row.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    row.setAttribute('data-controlled-state', kind);
    const card = row.querySelector('[data-dockside-root-card]');
    card.classList.remove('bg-sidebar-accent');
    const oldIcon = row.querySelector('[data-dockside-family-status-icon]');
    parser.innerHTML = templates[kind].icon;
    oldIcon?.replaceWith(parser.content.firstElementChild.cloneNode(true));
    const oldBadge = row.querySelector('[data-dockside-family-status]');
    parser.innerHTML = templates[kind].badge;
    oldBadge?.replaceWith(parser.content.firstElementChild.cloneNode(true));
    const titleNode = row.querySelector('[data-dockside-root-title-row] span[title]');
    if (titleNode) { titleNode.textContent = title; titleNode.setAttribute('title', title); }
    let branchNode = row.querySelector('[data-dockside-root-detail-row] .font-mono');
    if (!branchNode) {
      const detail = row.querySelector('[data-dockside-root-detail-row]');
      if (detail) {
        detail.innerHTML = '<span aria-hidden>⑂</span><span class="min-w-0 flex-1 truncate font-mono"></span>';
        branchNode = detail.querySelector('.font-mono');
      }
    }
    if (branchNode) branchNode.textContent = branch;
    const timeNode = row.querySelector('[data-dockside-root-time] span');
    if (timeNode) timeNode.textContent = age;
    const currentPr = row.querySelector('[data-dockside-pr-state]')?.closest('a');
    if (prKind && prTemplates[prKind]) {
      parser.innerHTML = prTemplates[prKind];
      const replacement = parser.content.firstElementChild.cloneNode(true);
      if (currentPr) currentPr.replaceWith(replacement);
      else row.querySelector('[data-dockside-family-status]')?.before(replacement);
    } else {
      currentPr?.remove();
    }
    if (kind === 'working') {
      const metadata = row.querySelector('[data-dockside-root-metadata]');
      const badge = row.querySelector('[data-dockside-family-status]');
      const disclosure = document.createElement('button');
      disclosure.type = 'button';
      disclosure.setAttribute('aria-label', 'Show 2 child threads');
      disclosure.className = 'flex h-4 items-center gap-0.5 rounded px-0.5 text-2xs font-medium text-muted-foreground';
      disclosure.innerHTML = '<span aria-hidden>⌃</span><span class="tabular-nums">2</span>';
      metadata?.insertBefore(disclosure, badge);
      const agents = document.createElement('ul');
      agents.setAttribute('aria-label', 'Agents for Run release workflow');
      agents.className = 'ml-[14px] border-l border-[color:var(--dockside-status-working)] pb-0.5 pl-3';
      [
        ['working', 'Agent · run test matrix', 'agent/test-matrix', '1m'],
        ['inactive', 'Agent · audit accessibility', 'agent/accessibility-audit', '6m'],
      ].forEach(([agentKind, agentTitle, agentBranch, agentAge]) => {
        const child = document.createElement('li');
        child.className = 'relative list-none';
        parser.innerHTML = templates[agentKind].icon;
        const childIcon = parser.content.firstElementChild.outerHTML;
        child.innerHTML = '<span class="absolute -left-3 top-1/2 h-px w-3 bg-sidebar-border"></span>' +
          '<div class="relative grid min-h-10 grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[1rem_1rem] items-center gap-x-1.5 rounded-md px-1.5 py-1">' +
          childIcon +
          '<span class="col-start-2 row-start-1 truncate text-xs text-foreground">' + agentTitle + '</span>' +
          '<span class="col-start-3 row-start-1 tabular-nums text-2xs text-muted-foreground">' + agentAge + '</span>' +
          '<span class="col-start-2 row-start-2 truncate font-mono text-2xs text-muted-foreground">' + agentBranch + '</span>' +
          '<span class="col-start-3 row-start-2 text-2xs text-muted-foreground">Codex</span>' +
          '</div>';
        agents.append(child);
      });
      row.querySelector('[data-dockside-root-card]')?.parentElement?.append(agents);
      const shell = row.querySelector('[data-dockside-root-card]')?.parentElement;
      shell?.classList.add('rounded-xl', 'border', 'border-sidebar-border', 'bg-sidebar-accent/35', 'py-1');
    }
    row.querySelectorAll('a').forEach((node) => node.removeAttribute('href'));
    list.append(row);
  });
  section.append(list);
  scroller.replaceChildren(section);
  scroller.scrollTop = 0;
  dockside.setAttribute('data-bb-plugin', 'dockside');
  dockside.setAttribute('data-bb-plugin-root', '');
  document.body.append(dockside);
  dockside.style.position = 'fixed';
  dockside.style.left = '0';
  dockside.style.top = '0';
  dockside.style.zIndex = '2147483647';
  dockside.style.height = '900px';
  dockside.style.background = 'var(--sidebar, var(--background))';
  scroller.style.overflow = 'visible';
  dockside.style.width = '610px';
  dockside.style.maxWidth = '610px';
  return true;
})()`);
await sleep(300);

const normalMetrics = await evaluate(`(() => {
  const dockside = document.querySelector('[data-dockside-palette]');
  const cards = [...document.querySelectorAll('[data-controlled-state]')];
  const badges = cards.map((row) => row.querySelector('[data-dockside-family-status]').getBoundingClientRect());
  const rows = cards.map((row) => ({
    kind: row.getAttribute('data-controlled-state'),
    cardHeight: row.querySelector('[data-dockside-root-card]').getBoundingClientRect().height,
    titleY: row.querySelector('[data-dockside-root-title-row]').getBoundingClientRect().y,
    detailY: row.querySelector('[data-dockside-root-detail-row]').getBoundingClientRect().y,
    badgeWidth: row.querySelector('[data-dockside-family-status]').getBoundingClientRect().width,
    badgeRight: row.querySelector('[data-dockside-family-status]').getBoundingClientRect().right,
    titleOverflow: row.querySelector('[data-dockside-root-title-row] span[title]').scrollWidth >
      row.querySelector('[data-dockside-root-title-row] span[title]').clientWidth,
    branchOverflow: row.querySelector('[data-dockside-root-detail-row] .font-mono').scrollWidth >
      row.querySelector('[data-dockside-root-detail-row] .font-mono').clientWidth,
  }));
  const ready = document.querySelector('[data-dockside-pr-state="ready"]');
  const bounds = dockside.getBoundingClientRect();
  return {
    bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: Math.min(bounds.height, 895) },
    rows,
    badgeWidthSpread: Math.max(...badges.map((badge) => badge.width)) - Math.min(...badges.map((badge) => badge.width)),
    badgeRightSpread: Math.max(...badges.map((badge) => badge.right)) - Math.min(...badges.map((badge) => badge.right)),
    dedicatedDragIcons: document.querySelectorAll('button[aria-label^="Reorder thread family"]').length,
    statusDragTargets: document.querySelectorAll('[data-dockside-family-status-icon]').length,
    readyBackground: ready ? getComputedStyle(ready).backgroundColor : null,
    readyColor: ready ? getComputedStyle(ready).color : null,
  };
})()`);
await screenshot("dockside-six-states-normal.png", normalMetrics.bounds);

const narrowMetrics = await evaluate(`(() => {
  const dockside = document.querySelector('[data-dockside-palette]');
  dockside.style.width = '390px';
  dockside.style.maxWidth = '390px';
  const bounds = dockside.getBoundingClientRect();
  return { bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: Math.min(bounds.height, 895) } };
})()`);
await sleep(200);
const narrowRows = await evaluate(`(() => [...document.querySelectorAll('[data-controlled-state]')].map((row) => ({
  kind: row.getAttribute('data-controlled-state'),
  cardHeight: row.querySelector('[data-dockside-root-card]').getBoundingClientRect().height,
  badgeWidth: row.querySelector('[data-dockside-family-status]').getBoundingClientRect().width,
  badgeRight: row.querySelector('[data-dockside-family-status]').getBoundingClientRect().right,
  titleOverflow: row.querySelector('[data-dockside-root-title-row] span[title]').scrollWidth >
    row.querySelector('[data-dockside-root-title-row] span[title]').clientWidth,
  branchOverflow: row.querySelector('[data-dockside-root-detail-row] .font-mono').scrollWidth >
    row.querySelector('[data-dockside-root-detail-row] .font-mono').clientWidth,
})))()`);
await screenshot("dockside-six-states-narrow.png", narrowMetrics.bounds);

const result = {
  schemaVersion: 1,
  surface: "live BB Dockside sidebar with controlled six-state fixture",
  settings: {
    previewVisible: settings.previewVisible,
    activityRoles: settings.activityRoles,
    containsEveryState: ["Working", "Needs you", "Unread", "Failed", "Inactive", "Stale"]
      .every((label) => settings.text.includes(label)),
  },
  realSidebar: {
    actualKindsBeforeFixture: [...new Set(realBefore.actualKinds)],
    projectName: realBefore.projectName,
    dragInitialOrder: realBefore.initial,
    dragResultOrder: afterDrag.order,
    persistedOrder: persistedOrder.order,
    orderStored: Boolean(afterDrag.stored && persistedOrder.stored),
    projectDragInitialOrder: projectBefore.initial,
    projectDragResultOrder: projectAfter.order,
    projectPersistedOrder: projectPersisted.order,
    projectOrderStored: Boolean(projectAfter.stored && projectPersisted.stored),
  },
  controlledFixture: {
    kindOrder: normalMetrics.rows.map((row) => row.kind),
    normalRows: normalMetrics.rows,
    narrowRows,
    badgeWidthSpread: normalMetrics.badgeWidthSpread,
    badgeRightSpread: normalMetrics.badgeRightSpread,
    dedicatedDragIcons: normalMetrics.dedicatedDragIcons,
    statusDragTargets: normalMetrics.statusDragTargets,
    readyBackground: normalMetrics.readyBackground,
    readyColor: normalMetrics.readyColor,
  },
};
await writeFile(
  new URL("live-result.json", evidenceRoot),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
socket.close();
