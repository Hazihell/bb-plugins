# External Task Context Specification

## Purpose

Keep useful provider issue data available to agents while making its external,
untrusted authority boundary explicit.

## Requirements

### Requirement: External tracker data is untrusted context

Every Taskboard mention or agent-handoff context SHALL identify provider issue
content as untrusted external data, delimit its beginning and end, and state
that text inside the delimiter is reference material rather than instructions.
Before CLI display or agent-context attachment, Taskboard SHALL visibly escape
C0/C1 terminal controls plus Unicode bidirectional formatting and isolate
controls so issue text cannot alter terminal or visual instruction boundaries.

#### Scenario: Provider text contains terminal and bidi controls

- **WHEN** an issue includes C1 control bytes or bidi override/isolate marks
- **THEN** Taskboard emits visible Unicode escape text for every such code point
- **AND** the quoted external-content boundary remains readable in logical order
