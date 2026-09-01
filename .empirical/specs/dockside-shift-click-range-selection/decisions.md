# Decisions: Dockside Shift Click Range Selection

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Resolve actual visible checkbox order at the interaction boundary

Status: Accepted

### Evidence

Project expansion is local to ProjectGroup, while filters, search, and
selected-family preservation are owned by ThreadInbox. Only rendered enabled
checkboxes express all of those conditions at once.

### Options

Hoist every project expansion state; use logical projectGroups order; or query
rendered selection inputs within this Dockside instance.

### Chosen approach

Add a scoped ThreadInbox ref and query only enabled visible root-selection
inputs when a checkbox changes.

### Trade-offs and risks

This is a thin DOM adapter, so a stable data attribute becomes a tested UI
contract. It avoids hidden-row selection and expansion state duplication.

### Verification

Unit-test the pure range helper and system-test the scoped data attribute and
callback wiring; exercise collapsed/filter states in BB.

## D-002: Use intended target state and preserve a valid Shift anchor

Status: Accepted

### Evidence

A checked target means Shift+click intends deselection, while an unchecked
target intends selection. Standard range selection continues from the original
ordinary-click anchor.

### Options

Always select; infer from stale selected Set state; or use the native checkbox's
intended checked state.

### Chosen approach

Pass `currentTarget.checked`, select or deselect inclusively, and retain a valid
anchor after Shift+click.

### Trade-offs and risks

Callback types become slightly richer; behavior remains predictable in forward
and reverse ranges.

### Verification

Test forward/reverse select and deselect ranges.

## D-003: Treat invalid anchors as ordinary clicks

Status: Accepted

### Evidence

Filters, search, project collapse, deletion, and live eligibility can remove
the anchor without ending selection mode.

### Options

Keep selecting from the logical hidden position; ignore the click; or fall back
to a single toggle and replace the anchor.

### Chosen approach

Fall back to the ordinary-click result and establish the target as the new
anchor.

### Trade-offs and risks

One gesture may select only one item after a visibility change, which is safer
and immediately re-establishes user intent.

### Verification

Test missing-anchor fallback, missing-target fail-closed behavior, and exercise
a filter change live.
