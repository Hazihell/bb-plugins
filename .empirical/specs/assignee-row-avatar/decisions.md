# Assignee Row Avatar Decisions

## D-001: Derive identity locally

Status: Accepted

### Evidence

Taskboard's shared work-item contract carries a provider-neutral
  assignee display string but no portable avatar URL; the requested change is a
  row treatment, not a provider integration.

### Options

Fetch provider photos; add avatar URLs to every adapter; derive a
  compact local initials identity.

### Chosen approach

Normalize the existing display string and derive initials plus a
  stable local tone with a fixed hash.

### Trade-offs and risks

This is not a profile photo and different names can share
  a tone, but it remains fast, private, multi-provider, and deterministic.

### Verification

Pure identity tests and unchanged provider contracts.

## D-002: Preserve the 20px footprint

Status: Accepted

### Evidence

The dense row grid and Kanban metadata line already reserve a
  20px marker; increasing it would change the geometry the user approved.

### Options

Enlarge the avatar; add a name label; improve ring, surface, and
  initials inside the current footprint.

### Chosen approach

Keep 20×20px and use stronger theme-safe border, ring, tint, and
  9px bold initials across six restrained tones.

### Trade-offs and risks

Fine detail must remain restrained at small size, so the
  palette uses host-token mixes rather than saturated fills.

### Verification

CSS geometry guard plus light/dark live screenshots.

## D-003: Make the full name accessible

Status: Accepted

### Evidence

Initials and color cannot uniquely identify a person, and the
  current marker is hidden from assistive technology.

### Options

Rely on row text; keep `aria-hidden`; expose the marker as a named
  image while retaining the tooltip.

### Chosen approach

Use `role="img"` and `aria-label="Assigned to <full name>"`, with
  the existing tooltip for pointer users.

### Trade-offs and risks

The surrounding row may also mention the assignee, but a
  named marker is clearer and remains non-interactive.

### Verification

Source guard and accessibility-tree live inspection.
