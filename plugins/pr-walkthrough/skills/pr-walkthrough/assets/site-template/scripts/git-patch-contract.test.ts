// Focused regression tests for Git path and patch byte preservation.
//
// Run with:  bun test scripts/git-patch-contract.test.ts

import { expect, test } from "bun:test";

import { parsePatch } from "./compile-walkthrough";
import { decodeGitPath, indexPatch, lineRef, refKey, synthesizePatch } from "./guide-contract";

const QUOTED_OLD = '"a/src/caf\\303\\251\\t\\"quoted\\".txt"';
const QUOTED_NEW = '"b/src/caf\\303\\251\\t\\"quoted\\".txt"';

test("unquoted modified path with spaces matches in both indexes", () => {
  const filePath = "src/file with spaces.txt";
  const patch =
    `diff --git a/${filePath} b/${filePath}\n` +
    "index 3367afd..3e75765 100644\n" +
    `--- a/${filePath}\t\n+++ b/${filePath}\t\n` +
    "@@ -1 +1 @@\n-old\n+new\n";
  expect(parsePatch(patch, "")[0].path).toBe(filePath);
  expect(indexPatch(patch).get(filePath)?.path).toBe(filePath);
});

test("C-quoted UTF-8 and escapes match in both indexes", () => {
  const filePath = 'src/café\t"quoted".txt';
  const patch =
    `diff --git ${QUOTED_OLD} ${QUOTED_NEW}\n` +
    `--- ${QUOTED_OLD}\n` +
    `+++ ${QUOTED_NEW}\n` +
    "@@ -1 +1 @@\n-old\n+new\n";
  expect(parsePatch(patch, "")[0].path).toBe(filePath);
  expect(indexPatch(patch).get(filePath)?.path).toBe(filePath);
});

test("rename and copy metadata preserve spaces and decode quotes", () => {
  const rename =
    "diff --git a/old.txt b/placeholder.txt\n" +
    "similarity index 100%\nrename from old name.txt\n" +
    'rename to "new caf\\303\\251\\t\\"name\\".txt"\n';
  const renamedPath = 'new café\t"name".txt';
  const compiled = parsePatch(rename, "")[0];
  expect([compiled.previousPath, compiled.path]).toEqual(["old name.txt", renamedPath]);
  expect(indexPatch(rename).has(renamedPath)).toBe(true);

  const copy =
    "diff --git a/source name.txt b/copied name.txt\n" +
    "similarity index 100%\ncopy from source name.txt\ncopy to copied name.txt\n";
  const copied = parsePatch(copy, "")[0];
  expect([copied.previousPath, copied.path]).toEqual(["source name.txt", "copied name.txt"]);
  expect(indexPatch(copy).has("copied name.txt")).toBe(true);
});

test("all git letter escapes decode", () => {
  expect(decodeGitPath('"a\\ab\\bc\\td\\ne\\vf\\fg\\rh"')).toBe(
    "a\u0007b\u0008c\u0009d\u000ae\u000bf\u000cg\u000dh",
  );
});

test("hunk content that looks like file markers remains content", () => {
  const patch =
    "diff --git a/file.txt b/file.txt\n" +
    "--- a/file.txt\n+++ b/file.txt\n" +
    "@@ -1 +1 @@\n--- old option\n+++ new option\n";
  const compiled = parsePatch(patch, "")[0];
  const indexed = indexPatch(patch).get("file.txt");
  expect([compiled.path, compiled.deletions, compiled.additions]).toEqual(["file.txt", 1, 1]);
  expect([...(indexed?.changedRefs ?? [])].toSorted()).toEqual(
    [refKey(lineRef("deletions", 1)), refKey(lineRef("additions", 1))].toSorted(),
  );
});

test("original and synthesized patches preserve trailing whitespace", () => {
  const patch =
    "diff --git a/file.txt b/file.txt\n--- a/file.txt\n+++ b/file.txt\n" +
    "@@ -1,2 +1,2 @@\n-old  \r\n+new\t\r\n context \t\r\n" +
    "\\ No newline at end of file\n";
  const compiledPatch = parsePatch(patch, "")[0].patch;
  const indexed = indexPatch(patch).get("file.txt");
  expect(indexed).toBeDefined();
  expect(compiledPatch).toBe(patch);
  expect(indexed?.originalPatch).toBe(patch);

  const [synthesized] = synthesizePatch(
    indexed as NonNullable<typeof indexed>,
    [lineRef("deletions", 1), lineRef("additions", 1)],
    1,
  );
  expect(synthesized).toContain("-old  \r\n");
  expect(synthesized).toContain("+new\t\r\n");
  expect(synthesized).toContain(" context \t\r\n");
  expect(synthesized.endsWith("\\ No newline at end of file\n")).toBe(true);
});

test("malformed quoted path is stable and does not crash", () => {
  const patch = 'diff --git a/file.txt b/file.txt\nrename to "bad\\q.txt"\n';
  expect(parsePatch(patch, "")[0].path).toBe('"bad\\q.txt"');
  expect(indexPatch(patch).has('"bad\\q.txt"')).toBe(true);
});
