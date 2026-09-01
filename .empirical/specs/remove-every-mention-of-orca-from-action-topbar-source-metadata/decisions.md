# Decisions: Remove Every Mention Of Orca From Action Topbar Source Metadata

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

### Evidence

- The user explicitly requested complete removal of the comparison name and
  real screenshots in both themes.
- Authored references exist in Action Topbar metadata/docs and Dockside copy.
- Repository rules place shared screenshots under `docs/media/`.

### Options

1. Replace only Action Topbar references and leave unrelated matches.
2. Remove every authored repository match and use product-owned descriptions.

### Chosen approach

Use option 2, then capture the installed plugin in the real BB UI rather than a
mockup or generated marketing image.

### Trade-offs and risks

Removing historical comparison language slightly broadens the copy edit into
Dockside, but it fulfills the repository-wide wording request without behavior
changes. Real screenshots can expose transient thread content, so frame the UI
tightly around the topbar and launcher and inspect each asset before commit.

### Verification

Search authored files case-insensitively, inspect both PNGs, verify README paths
and alt text, and run focused plus repository checks.
