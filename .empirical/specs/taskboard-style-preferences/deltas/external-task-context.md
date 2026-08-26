# External Task Context

## Purpose

Keep useful provider issue data available to agents while making its external,
untrusted authority boundary explicit.

## ADDED Requirements

### Requirement: External tracker data is untrusted context

Every Taskboard mention or agent-handoff context SHALL identify provider issue
content as untrusted external data, delimit its beginning and end, and state
that text inside the delimiter is reference material rather than instructions.

#### Scenario: Issue description contains instruction-like text

- **WHEN** an external issue description contains commands, prompt injection,
  or text claiming to be repository policy
- **THEN** the attached context preserves the useful issue content inside the
  external-data delimiter
- **AND** Taskboard's trusted warning remains outside that content

#### Scenario: Ordinary issue context

- **WHEN** a normal issue is inserted through a mention or handoff
- **THEN** its key, provider, project, status, metadata, URL, and description
  remain available to the agent without being presented as trusted policy
