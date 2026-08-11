// Split a legacy walkthrough.mdx into canonical multi-file MDX.
//
// Run with Bun:  bun run <skill-directory>/scripts/migrate-monolith.ts --input X --output Y

import * as fs from "node:fs";
import * as path from "node:path";

const REMOVED_DIAGRAM_HEADINGS = new Set([
  "System overview",
  "Data flow graph",
  "Code dependency graph",
  "User action graph",
]);

const FIRST_LEVEL_HEADING = /^# (.+?)\s*$/;
const SECOND_LEVEL_HEADING = /^## (.+?)\s*$/;

const USAGE = `usage: migrate-monolith.ts [-h] --input INPUT --output OUTPUT [--force]

Split a legacy walkthrough.mdx into canonical multi-file MDX.
`;

function usageError(message: string): never {
  process.stderr.write(USAGE);
  process.stderr.write(`migrate-monolith.ts: error: ${message}\n`);
  process.exit(2);
}

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseCliArgs(
  argv: string[],
  optionNames: string[],
  flagNames: string[],
): { values: Map<string, string>; flags: Set<string> } {
  const values = new Map<string, string>();
  const flags = new Set<string>();
  let index = 0;
  while (index < argv.length) {
    const token = argv[index];
    if (token === "-h" || token === "--help") {
      process.stdout.write(USAGE);
      process.exit(0);
    }
    const equals = token.indexOf("=");
    const name = equals >= 0 ? token.slice(0, equals) : token;
    if (equals < 0 && flagNames.includes(name)) {
      flags.add(name);
      index += 1;
      continue;
    }
    if (optionNames.includes(name)) {
      if (equals >= 0) {
        values.set(name, token.slice(equals + 1));
        index += 1;
        continue;
      }
      const value: string | undefined = argv[index + 1];
      if (value === undefined) usageError(`argument ${name}: expected one argument`);
      values.set(name, value);
      index += 2;
      continue;
    }
    usageError(`unrecognized arguments: ${token}`);
  }
  return { values, flags };
}

const LINE_BOUNDARIES = new Set([
  "\n",
  "\r",
  "\v",
  "\f",
  "\u001c",
  "\u001d",
  "\u001e",
  "\u0085",
  "\u2028",
  "\u2029",
]);

/** Split like Python's str.splitlines(): no trailing empty element. */
function splitLines(value: string): string[] {
  const result: string[] = [];
  let start = 0;
  let index = 0;
  while (index < value.length) {
    const character = value[index];
    if (!LINE_BOUNDARIES.has(character)) {
      index += 1;
      continue;
    }
    result.push(value.slice(start, index));
    index += character === "\r" && value[index + 1] === "\n" ? 2 : 1;
    start = index;
  }
  if (start < value.length) result.push(value.slice(start));
  return result;
}

function stripChars(value: string, chars: string): string {
  let start = 0;
  let end = value.length;
  while (start < end && chars.includes(value[start])) start += 1;
  while (end > start && chars.includes(value[end - 1])) end -= 1;
  return value.slice(start, end);
}

/** Resolve like Python's Path.resolve(): absolute, with symlinks followed. */
function resolveRealPath(target: string): string {
  const absolute = path.resolve(target);
  try {
    return fs.realpathSync(absolute);
  } catch {
    const parent = path.dirname(absolute);
    if (parent === absolute) return absolute;
    return path.join(resolveRealPath(parent), path.basename(absolute));
  }
}

function rstripWhitespace(value: string): string {
  return value.replace(/\s+$/, "");
}

function rejectLegacyLenses(lines: string[]): void {
  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const rawLine = lines[index];
    if (rawLine.trim().startsWith("- Lens:")) {
      fail(
        `line ${String(lineNumber)} uses the removed Lens syntax; delete it and keep ` +
          "reviewer guidance in the relevant Review guide group before migrating",
      );
    }
    const heading = FIRST_LEVEL_HEADING.exec(rawLine);
    if (heading && REMOVED_DIAGRAM_HEADINGS.has(heading[1])) {
      fail(
        `line ${String(lineNumber)} uses the removed diagram heading ` +
          `'${heading[1]}'; delete that diagram and move any useful prose ` +
          "into the relevant Review guide group before migrating",
      );
    }
  }
}

function slug(value: string): string {
  const result = stripChars(value.toLowerCase().replace(/[^a-z0-9]+/g, "-"), "-");
  if (!result) fail(`cannot create a filename for heading: ${value}`);
  return result;
}

function firstLevelSections(lines: string[]): Array<[string, string[]]> {
  const result: Array<[string, string[]]> = [];
  let current: [string, string[]] | null = null;
  for (const line of lines) {
    const match = FIRST_LEVEL_HEADING.exec(line);
    if (match) {
      if (current) result.push(current);
      current = [match[1], []];
    } else if (current) {
      if (line.trim() !== "</WalkthroughSource>") current[1].push(line);
    }
  }
  if (current) result.push(current);
  return result;
}

function splitGroups(lines: string[]): [string[], Array<[string, string[]]>] {
  const intro: string[] = [];
  const groups: Array<[string, string[]]> = [];
  let current: [string, string[]] | null = null;
  for (const line of lines) {
    const match = SECOND_LEVEL_HEADING.exec(line);
    if (match) {
      if (current) groups.push(current);
      current = [match[1], []];
    } else if (current) {
      current[1].push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) groups.push(current);
  return [intro, groups];
}

function main(argv: string[]): number {
  const parsed = parseCliArgs(argv, ["--input", "--output"], ["--force"]);
  const inputArg = parsed.values.get("--input");
  const outputArg = parsed.values.get("--output");
  if (inputArg === undefined) usageError("the following arguments are required: --input");
  if (outputArg === undefined) usageError("the following arguments are required: --output");
  const force = parsed.flags.has("--force");

  const source = new TextDecoder("utf-8", { fatal: true }).decode(fs.readFileSync(inputArg));
  const lines = splitLines(source);
  rejectLegacyLenses(lines);
  if (lines.length === 0 || lines[0].trim() !== "---") {
    fail("legacy walkthrough must start with frontmatter");
  }
  const frontmatterEnd = lines.indexOf("---", 1);
  if (frontmatterEnd < 0) fail("legacy walkthrough frontmatter is not closed");

  const sections = firstLevelSections(lines.slice(frontmatterEnd + 1));
  const sectionMap = new Map<string, string[]>();
  for (const [label, body] of sections) sectionMap.set(label, body);
  const reviewGuide = sectionMap.get("Review guide");
  if (reviewGuide === undefined) fail("legacy walkthrough has no Review guide");
  const [intro, groups] = splitGroups(reviewGuide);
  if (groups.length === 0) fail("legacy Review guide has no groups");

  const output = resolveRealPath(outputArg);
  if (fs.existsSync(output)) {
    if (!force) fail(`output already exists: ${output}`);
    fs.rmSync(output, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(output, "sections"), { recursive: true });

  const manifest = [...lines.slice(0, frontmatterEnd + 1), "", "# Review guide", ...intro];
  for (let position = 0; position < groups.length; position += 1) {
    const [title, body] = groups[position];
    const relative = `sections/${String(position + 1).padStart(2, "0")}-${slug(title)}.mdx`;
    manifest.push(`- Section: [${title}](${relative})`);
    fs.writeFileSync(
      path.join(output, relative),
      `${rstripWhitespace([`# ${title}`, ...body].join("\n"))}\n`,
      "utf8",
    );
  }

  fs.writeFileSync(
    path.join(output, "index.mdx"),
    `${rstripWhitespace(manifest.join("\n"))}\n`,
    "utf8",
  );
  process.stdout.write(`${output}\n`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
