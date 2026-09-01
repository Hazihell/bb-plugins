# Security Advisory

Specialist: security

Verdict: advisory

- Informational/privacy: removing output-summary RPC/cache eliminates a sidebar
  content surface and reduces data exposure. Keep it removed.
- Informational/integrity: PR icons derive from a closed BB state mapping and
  navigation remains on UrlLink; number/icon order adds no input surface.
- Low/accessibility: icon meaning remains in aria-label/title, while PR number
  stays visible. Preserve those labels and semantic shapes/colors.

No blocking exploit was found.
