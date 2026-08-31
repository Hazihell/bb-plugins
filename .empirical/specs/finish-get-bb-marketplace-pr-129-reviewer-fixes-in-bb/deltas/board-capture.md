# Board capture

## MODIFIED Requirements

### Requirement: Composer-assisted create remains available

Direct board capture SHALL coexist with composer-assisted issue review. A
non-empty composer prompt SHALL become an editable title and description in
the visible provider-aware form without starting an agent or spending model
usage, and both paths SHALL reuse the same validated backend create operation.

#### Scenario: Review a composer prompt manually

- **WHEN** the user invokes Taskboard from a non-empty BB composer prompt
- **THEN** the review form opens with a prompt-derived editable title and the
  complete original prompt as its description
- **AND** no agent thread or model request starts
- **AND** no tracker mutation occurs until the user presses **Create issue**.
