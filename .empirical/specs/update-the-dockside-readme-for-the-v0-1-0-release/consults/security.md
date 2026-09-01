# Security Advisory

- **Specialist:** documentation and distribution security review
- **Verdict:** advisory

## Findings

### Medium — Installation documentation executes third-party code

- **Category:** supply-chain clarity
- **Location:** `plugins/dockside/README.md`, Install
- **Recommendation:** name the exact public repository, semver range,
  subdirectory, and tag prefix; link the immutable tag and reviewed PR so users
  can verify the source before accepting BB's install confirmation.
- **Resolution:** implemented.

### Low — Do not promote an unreviewed similarly named npm package

- **Category:** dependency confusion
- **Location:** `plugins/dockside/README.md`, Install
- **Recommendation:** explicitly direct users away from a bare npm package and
  marketplace name until the Community listing is merged.
- **Resolution:** implemented.

### Low — Keep documentation media inert and repository-local

- **Category:** active content
- **Location:** `plugins/dockside/docs/media/`
- **Recommendation:** use plain PNGs without remote resources, metadata-driven
  scripts, or credentials; reference them through repository-relative paths.
- **Resolution:** all three assets are validated RGB PNGs and contain no active
  content.

No blocking security issue was found. The update changes documentation and
inert raster media only; it does not alter runtime permissions, persistence, or
network behavior.
