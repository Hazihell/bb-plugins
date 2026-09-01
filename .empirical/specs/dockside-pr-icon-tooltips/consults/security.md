# Security Advisory

Specialist: security

Verdict: advisory

- Tooltip content is React-escaped BB PR state/title data; no HTML injection.
- Tooltip is pointer-events-none and cannot intercept navigation.
- UrlLink and accessible label remain authoritative; icon names are closed.
- Keep title truncated and avoid adding raw remote markup.

No blocking exploit was found.
