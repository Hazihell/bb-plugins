import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../lib/sidebar-strip.ts", import.meta.url),
  "utf8",
);
const styles = readFileSync(new URL("../app.css", import.meta.url), "utf8");
const server = readFileSync(new URL("../server.ts", import.meta.url), "utf8");

test("keeps Grok and OpenCode independently configurable", () => {
  assert.match(server, /enableGrok:\s*\{/u);
  assert.match(server, /label: "Enable Grok"/u);
  assert.match(server, /enableOpenCode:\s*\{/u);
  assert.match(server, /label: "Enable OpenCode"/u);
});

test("emits semantic severity for compact, rail, and detail presentation", () => {
  assert.match(source, /button\.dataset\.level = usageLevel/u);
  assert.match(source, /rail\.dataset\.level = usageLevel/u);
  assert.match(source, /row\.dataset\.level = usageLevel/u);
  assert.match(styles, /--usage-sidebar-warning:/u);
  assert.match(styles, /--usage-sidebar-critical:/u);
  assert.match(styles, /data-level="warning"/u);
  assert.match(styles, /data-level="critical"/u);
});

test("wraps larger provider sets into at most three rows with one refresh column", () => {
  for (const count of [3, 4, 5, 6]) {
    assert.match(styles, new RegExp(`data-provider-count="${count}"`, "u"));
  }
  assert.match(
    styles,
    /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\) 1\.75rem/u,
  );
  assert.match(styles, /grid-template-rows:\s*repeat\(2, 2rem\)/u);
  assert.match(styles, /grid-template-rows:\s*repeat\(3, 2rem\)/u);
  assert.match(styles, /grid-column:\s*3/u);
  assert.match(styles, /grid-row:\s*1 \/ -1/u);
});

test("preserves provider-specific details and focus restoration", () => {
  assert.match(source, /detailsId\(providerId\)/u);
  assert.match(source, /requestedFocus = isClosing/u);
  assert.match(source, /providerGlyph\(providerId\)/u);
  assert.match(source, /provider\.id === "codex"/u);
});
