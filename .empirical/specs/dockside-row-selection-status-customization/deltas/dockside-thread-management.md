# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Bulk deletion is explicit and state-safe

During selection mode, the complete eligible root row MUST act as the native
checkbox selection target. Ordinary row click MUST toggle one family and set
the anchor. Shift+click MUST apply the target's intended selected state across
the inclusive visible eligible range. Checkbox clicks MUST retain identical
behavior. Protected row clicks MUST neither select nor navigate.

All preview, confirmation, one-use token, descendant binding, revalidation,
partial outcome, filter/search/order, and protected-family guarantees remain.

#### Scenario: User Shift-selects by clicking row titles

- **Given** selection mode shows eligible A, protected B, and eligible C
- **And** the user clicks anywhere on A's root row
- **When** the user Shift+clicks anywhere on C's root row
- **Then** A and C are selected
- **And** B remains disabled and unselected
- **And** no thread opens

## ADDED Requirements

### Requirement: Semantic presentation is persistently customizable

Dockside MUST expose persistent plugin settings for semantic status/PR palette,
row density, default child expansion, provider marks, root PR metadata, and
relative time. Default values MUST preserve existing behavior. Palette options
MUST include Default, High contrast, Colorblind-friendly, and validated Custom
colors. Invalid values MUST fall back without applying arbitrary CSS.

Color customization MUST NOT remove state labels, icon shapes, animation,
tooltips, disabled semantics, or PR precedence.

#### Scenario: User chooses the colorblind-friendly preset

- **Given** Dockside settings are open
- **When** the user chooses Colorblind-friendly
- **Then** working, stalled/waiting, unread, error, idle, and PR icon colors use
  the documented preset
- **And** the sidebar updates without a reload
- **And** each state retains its original icon, label, and animation

#### Scenario: User supplies an invalid custom color

- **Given** Custom palette is selected
- **When** a color field is not a valid six-digit hex value
- **Then** Dockside uses that role's safe default
- **And** the invalid value is never projected into inline CSS

#### Scenario: User hides optional metadata

- **Given** provider icons, PR metadata, and relative time are visible by default
- **When** the user disables one or more settings
- **Then** only those optional elements disappear
- **And** status, title, branch, hierarchy, selection, and navigation remain
