# Decisions

## D-001: Separate product presentation from install coordinates

Status: Accepted

### Evidence

The user wants version branding removed from the README presentation, while the
Git installer requires a semver range and immutable tag reference for safe,
reproducible resolution.

### Options

Remove every version token; retain all version branding; or remove promotional
version labels while preserving install-only coordinates.

### Chosen approach

Remove version text from the badge, introduction, showcase heading, image alt
text, and prose lead; retain it only in the executable Install coordinates.

### Trade-offs and risks

The Install section still necessarily contains `0.1.0`, but users can verify and
reproduce the source without turning the README into a release announcement.

### Verification

Search the pre-Install presentation separately from the Install section and
confirm the direct command still resolves the immutable tag.
