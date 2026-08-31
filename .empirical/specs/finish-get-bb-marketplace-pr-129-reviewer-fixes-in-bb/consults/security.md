# Security consult

specialist: security  
verdict: advisory

## Findings

None.

## Assessment

Accepted decision D-003 closes the prior executable-search exploit at the
design level. Taskboard never executes a bare `gh`; it considers only an
operator-supplied absolute `GH_PATH`, fixed absolute OS locations, or entries
from absolute PATH directories, rejects relative and current-workspace
candidates, access-checks and canonicalizes the executable, and probes it with
no GitHub authentication, home, config, proxy, or PATH variables. Authenticated
calls begin only after that resolution and use the resolved absolute path.

The required POSIX and Windows cwd-shadow regressions cover the original
repository-controlled substitution path. Absolute user installation locations
and an explicit absolute `GH_PATH` remain an intentional operator trust
boundary documented by D-003, not an untrusted-workspace execution route. No
remaining design-level security finding is present in the reviewed feature
documents.
