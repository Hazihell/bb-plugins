# Decisions

## D-001: Keep release media plugin-owned

Status: Accepted

### Evidence

Repository convention requires shared plugin media under the
  owning plugin's `docs/media/`; the final captures are already verified PNGs.

### Options

Remote image URLs; root `docs/media`; plugin-local media.

### Chosen approach

Vendor all three under `plugins/dockside/docs/media/`.

### Trade-offs and risks

Repository size grows by roughly 330 KB, but the README remains
  durable and independent of thread storage or external hosting.

### Verification

Validate tracked paths, PNG signatures, dimensions, and README references.

## D-002: Describe marketplace state without overstating availability

Status: Accepted

### Evidence

`dockside/v0.1.0` is public and marketplace PR #162 is validated
  but still requires a `get-bb/marketplace` maintainer merge.

### Options

Claim marketplace availability; omit marketplace; state the
  validated pending submission and provide the direct Git install.

### Chosen approach

State the pending submission and make immutable Git the current
  install path.

### Trade-offs and risks

Copy needs a small follow-up after marketplace merge, but is
  accurate today.

### Verification

Resolve the public tag and inspect marketplace PR #162 state.

## D-003: Show theme parity before the detailed feature guide

Status: Accepted

### Evidence

The requested final assets deliberately demonstrate light,
  dark, and expanded-subagent presentation at the shipped compact width.

### Options

One hero only; three stacked images; side-by-side themes plus one
  full-width child-agent detail.

### Chosen approach

Side-by-side light/dark captures, followed by the focused subagent
  image.

### Trade-offs and risks

The table becomes stacked on very narrow Markdown viewers, but
  each image remains readable and independently labeled.

### Verification

Review the rendered Markdown layout and alt text at desktop and narrow widths.
