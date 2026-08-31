export interface OrbDirectiveRange {
  from: number;
  to: number;
}

function orbDirectivePattern(): RegExp {
  return /(?<!\S)\/orb(?!\S)/giu;
}

/** Case-insensitive standalone `/orb` tokens used for Amp execution routing. */
export function findOrbDirectiveRanges(text: string): OrbDirectiveRange[] {
  return Array.from(text.matchAll(orbDirectivePattern()), (match) => ({
    from: match.index,
    to: match.index + match[0].length,
  }));
}

/** Remove every routing token without changing any surrounding whitespace. */
export function stripOrbDirectives(text: string): {
  text: string;
  found: boolean;
} {
  let found = false;
  const stripped = text.replace(orbDirectivePattern(), () => {
    found = true;
    return "";
  });
  return { text: stripped, found };
}
