# Design

- Add `Eye` to the shared icon map using Hugeicons ViewIcon.
- Map review-requested PRs to Eye; retain the tested remaining icon vocabulary.
- PullRequestMetadata stays `#number` then icon and becomes `group/pr`.
- Add an absolute, right-aligned, bottom-full tooltip with state + number on the
  first line and truncated title on the second; reveal on hover and focus-within.
- Keep native title/aria-label and pointer-events-none tooltip behavior.
- No ordinary completion or other row behavior changes.
