# Usage Tracker Provider Usage Delta

## MODIFIED Requirements

### Requirement: Compatible provider response normalization

Usage Tracker SHALL map current BB usage wire keys `codex`, `claude-code`,
`acp-cursor`, `acp-grok`, and `acp-opencode` to stable plugin provider IDs
`codex`, `claudeCode`, `cursor`, `grok`, and `openCode`. It SHALL continue to
accept the existing legacy Claude Code and Cursor aliases. Current wire keys
SHALL take precedence when an alias coexists.

#### Scenario: Normalize Grok and OpenCode

- **WHEN** BB reports healthy usage under `acp-grok` and `acp-opencode`
- **THEN** the snapshot contains stable `grok` and `openCode` providers with
  the original windows intact
- **AND** the providers appear in deterministic order after existing providers

#### Scenario: A new provider is absent

- **GIVEN** Codex, Claude Code, and Grok return healthy usage
- **WHEN** no OpenCode key is present
- **THEN** the healthy providers retain their usage windows
- **AND** only OpenCode reports a provider-local unavailable error

## ADDED Requirements

### Requirement: Independently configurable visible providers

Usage Tracker SHALL expose Grok and OpenCode as independently configurable
sidebar providers enabled by default, validate them at the RPC and cache
boundaries, and preserve the current Codex reset behavior.

#### Scenario: Disable only Grok

- **GIVEN** all four visible providers are enabled
- **WHEN** the user disables Grok in plugin settings
- **THEN** Grok is omitted from the compact strip
- **AND** Claude Code, Codex, and OpenCode remain visible in stable order
