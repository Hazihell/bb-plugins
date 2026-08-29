# Decisions: Add Semantic Colors To Host Monitor Status Orbs Across Its

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Let connected severity determine orb color

Status: Accepted

### Evidence

Host Monitor already derives fresh health, sampling, stale/error, offline, and
unavailable presentation states. A connected host can be healthy, attention,
or critical, so connectivity alone cannot explain the requested yellow and red
orbs. Disconnected hosts can retain prior health data.

### Options

1. Color every connected host green and every disconnected host gray.
2. Color connected hosts by current severity, while forcing disconnected hosts
   gray and leaving sampling/unavailable neutral.

### Chosen approach

Choose option 2. It matches the requested Healthy/Attention/Critical colors,
keeps connectivity precedence safe, and reuses the existing presentation
functions rather than creating a parallel state model.

### Trade-offs and risks

The same connected host may change green/yellow/red as telemetry changes; that
is intentional. Compound CSS selectors and explicit offline/unavailable
fallbacks prevent stale severity and unknown states from looking healthy.

### Verification

Focused source and CSS tests cover every tone and disconnected precedence;
pure presentation tests cover state derivation and the security consult's
unexpected-state neutral fallback; the real BB UI is inspected.

## D-002: Color only decorative orbs

Status: Superseded

Superseded by: D-005

### Evidence

The user asked for orb colors. Existing Connected/Disconnected and health or
freshness labels already communicate the same states, and the dots are marked
decorative.

### Options

1. Apply tone color to entire badges and state labels.
2. Add stable orb hooks and color only the circular indicators.

### Chosen approach

Choose option 2. Health-badge copy stays neutral, existing status text remains
visible, and decorative dots remain `aria-hidden`.

### Trade-offs and risks

This adds one explicit indicator class. Host-card orbs also receive a faint
same-tone halo, as recommended by the UI/UX consult, but labels remain neutral
so color does not overwhelm small text and state remains readable without
color perception.

### Verification

Source tests retain the text labels and `aria-hidden` treatment; CSS tests
target only the indicator elements.

## D-003: Keep status colors independent of metric preferences

Status: Accepted

### Evidence

The `sidebarThresholdColors` setting was designed for numeric resource
readings. Host health/connectivity state is shown even when no percentage is
available and already has separate semantic tones.

### Options

1. Gate status-orb colors behind the numeric threshold-color preference.
2. Render semantic status-orb colors unconditionally while keeping numeric
   reading colors preference-gated.

### Chosen approach

Choose option 2. It keeps the user's requested status vocabulary consistent
across compact and full dashboard surfaces.

### Trade-offs and risks

Users who disable threshold colors will still see small semantic host-state
orbs. Their labels stay neutral and the orbs are compact, limiting visual
noise.

### Verification

CSS tests prove orb selectors are outside preference-gated blocks and retain
the existing assertion that numeric tones alone are gated.

## D-004: Tint the existing permanent sidebar icon

Status: Superseded

Superseded by: D-005

### Evidence

During live review the user clarified that critical and attention color must
be visible on the permanent Host Monitor control in BB's sidebar, not only in
the popover/floating monitor and plugin page. The earlier request to remove the
notification dot still applies. The trigger already exposes the derived fleet
status and renders a masked icon whose fill follows `currentColor`.

### Options

1. Restore a colored notification dot on the trigger.
2. Keep the trigger neutral and show color only after opening Host Monitor.
3. Tint the trigger's existing Host Monitor icon from the current fleet status.

### Chosen approach

Choose option 3. Healthy uses success green, attention uses warning yellow,
critical and load errors use destructive red, and offline/loading/empty remain
muted gray. No pseudo-element or additional badge is created.

### Trade-offs and risks

The permanent icon is more visually prominent than a neutral icon, which is
the user's intended at-a-glance result. Status text remains available through
the trigger's label/title, and coloring the masked icon child avoids changing
button geometry, hit target, hover behavior, or sidebar text.

### Verification

Focused CSS/source tests cover each status mapping and forbid a trigger
`::after`; real BB computed style and a sidebar screenshot prove the existing
icon—not a modal-only orb—receives the live fleet color.

## D-005: Color inner-sidebar status chips, not the global icon

Status: Superseded

Superseded by: D-006

Supersedes: D-002, D-004

### Evidence

The user immediately rejected coloring BB's permanent Host Monitor icon red
and clarified that the desired target is the Critical/Attention-style chips in
the inner sidebar of the Host Monitor page. The global icon must stay neutral,
and the earlier notification-dot removal still applies.

### Options

1. Color BB's global Host Monitor icon from fleet severity.
2. Restore a notification dot on the global control.
3. Keep the global control neutral and tint only the health-state chips inside
   the Host Monitor page's fleet sidebar.

### Chosen approach

Choose option 3. In `.host-monitor-dashboard`, connected Healthy, Attention,
and Critical chips receive subtle semantic backgrounds and borders while their
text remains neutral. Offline, disconnected, unavailable, loading, and unknown chips remain
muted gray. The popover/floating rows keep their small semantic orbs, and the
global Host Monitor icon receives no status-color rule.

### Trade-offs and risks

The chip surface is now colored within the requested inner sidebar,
superseding the earlier orb-only preference. The neutral word inside each chip
remains the primary state signal, so color is still additive; restrained
opacity prevents the compact sidebar from becoming visually loud.

### Verification

Focused tests require semantic dashboard-chip selectors, muted disconnected
fallbacks, and the absence of both trigger pseudo-elements and trigger-icon
status selectors. Real BB inspection captures colored inner-sidebar chips with
the global Host Monitor icon still neutral.

## D-006: Replace chips with inline status and severity rails

Status: Superseded

Supersedes: D-005

Superseded by: D-008

### Evidence

The user rejected the colored chip UI and supplied a dark-theme screenshot of
the compact popover. The pills, boxed three-cell summary, and emphasis on the
redundant Connected word made status presentation feel heavy.

### Options

1. Restyle the pills with different radii and stronger semantic fills.
2. Remove status decoration entirely and rely only on plain text.
3. Use borderless inline dot-plus-label status, attention/critical-only row
   rails, underline filters, and one compact inline fleet summary.

### Chosen approach

Choose option 3. `HealthStatus` has no border/background/padding pill chrome.
Connected Healthy/Attention/Critical use their semantic dot and readable word;
disconnected/unavailable remain muted. Only attention and critical rows gain a
thin rail. Compact popover rows make health primary and connectivity secondary,
and the summary uses one labelled definition list. The global icon remains
neutral and dot-free.

### Trade-offs and risks

Semantic text is more visible than the prior neutral chip word, but the word
itself remains present and the rail is additive, so no meaning depends on
color. Rails are limited to actionable states to avoid turning the fleet into
a rainbow.

### Verification

Source/CSS tests reject pill chrome, require filter semantics, definition-list
summary markup, health-before-connectivity copy, and attention/critical-only
rails. Real BB screenshots cover light and dark theme behavior.

## D-007: Resolve marketplace review feedback in 0.1.2 preparation

Status: Accepted

### Evidence

Marketplace PR #128 requested two fixes: disclose that Host Monitor can stop
eligible processes, and replace invalid fixed-tab icon `Activity`. BB 0.40's
authoritative registry contains `ChartColumn`; neither `Activity` nor `Cpu` is
valid there. Host Monitor's guarded stop implementation and README already
support an honest disclosure. Version `0.1.2` is prepared but not released.

### Options

1. Use `Cpu` because the review comment suggested it.
2. Use verified `ChartColumn`, update source/registration tests and manifest
   descriptions, and prepare the marketplace entry description locally.
3. Leave the entry unchanged until after release.

### Chosen approach

Choose option 2. The Processes fixed tab uses `ChartColumn`; tests explicitly
reject `Activity`. Plugin and marketplace descriptions say guarded controls can
stop eligible processes. The current PR's compatible `^0.1.0` range remains
valid for a future `0.1.2` patch tag, so no premature range mutation is needed.

### Trade-offs and risks

The local marketplace branch will remain unpushed until explicit approval.
The PR cannot be honestly pinged for re-review until the new immutable plugin
tag exists, so release preparation and PR response remain separate gates.

### Verification

Run Host Monitor registration/type/test/build checks, inspect the live fixed
tab icon, run marketplace `npm ci`, build, and liveness check against current
upstream, and present exact remote-changing commands before release approval.

## D-008: Remove colored container rails and explain each host state

Status: Accepted

Supersedes: D-006

### Evidence

The user highlighted the red and yellow inset rails in the compact sidebar and
clarified that the colored card treatment inside the Host Monitor page is also
unwanted. They asked to retain emphasis only for Critical and Needs attention,
add a hover treatment to every host, and explain why each host has its current
state.

### Options

1. Keep the rails but reduce their opacity.
2. Remove every semantic rail/background from host containers and rely on the
   small status orb plus action-state text, with a neutral hover/focus treatment
   and concise per-host explanation.
3. Remove all semantic color, including the status orbs.

### Chosen approach

Choose option 2. Cards, compact rows, desktop rows, popover rows, and floating
rows never receive a status-colored edge, background, border, or shadow.
Healthy text returns to the neutral theme color; Critical and Needs attention
remain semantically colored, and the small orb retains the established
green/yellow/red/muted mapping. Every host container gains a neutral hover and
keyboard-focus treatment. Hovering a host or focusing its interactive row
reveals a short explanation derived from a closed metric/severity mapper plus
validated percentage, or a fixed connection/freshness fallback. Raw alert
messages and refresh errors are never exposed.

### Trade-offs and risks

Removing rails makes exceptional rows slightly less prominent, but the visible
state word, semantic orb, filter, and explanation preserve fast diagnosis
without coloring the card itself. Explanations can be longer than compact rows,
so they appear as an overlaid tooltip rather than changing layout height.

### Verification

Focused tests reject every card/row severity-rail selector, require neutral
hover/focus styling, verify safe explanation precedence and the Needs attention
label, and ensure raw errors or malformed runtime data cannot enter hover copy.
Real BB screenshots cover the page and compact popover with explanations
visible while the global icon remains neutral and dot-free.
