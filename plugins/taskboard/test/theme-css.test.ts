import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const stylesheet = await readFile(
  new URL('../app.css', import.meta.url),
  'utf8'
);

function ruleBody(pattern: RegExp, label: string): string {
  const match = stylesheet.match(pattern);
  assert.ok(match?.[1], `Missing ${label} rule`);
  return match[1];
}

test('keeps structural headers on neutral host theme surfaces', () => {
  const listHeader = ruleBody(
    /\.tb-group-heading,\s*\.tb-project-strip\s*\{([^}]*)\}/s,
    'list header'
  );
  const kanbanColumn = ruleBody(
    /\.tb-kanban-column\[data-state-category\]\s*\{([^}]*)\}/s,
    'Kanban column'
  );
  const kanbanHeader = ruleBody(
    /\.tb-kanban-column\[data-state-category\]\s+\.tb-kanban-column-header\s*\{([^}]*)\}/s,
    'Kanban header'
  );

  assert.match(
    listHeader,
    /background:\s*var\(--surface-recessed-soft-solid\)/
  );
  assert.doesNotMatch(listHeader, /--tb-state-accent/);
  assert.doesNotMatch(
    stylesheet,
    /\.tb-group-heading\[data-status-tone\]\s*\{/
  );

  for (const rule of [kanbanColumn, kanbanHeader]) {
    assert.match(
      rule,
      /background:\s*var\(--surface-recessed-soft-solid\)/
    );
    assert.doesNotMatch(rule, /--tb-state-accent/);
  }
  assert.match(kanbanColumn, /border-color:\s*var\(--tb-border\)/);
  assert.match(kanbanHeader, /box-shadow:[^;]*var\(--tb-border\)/s);
});
