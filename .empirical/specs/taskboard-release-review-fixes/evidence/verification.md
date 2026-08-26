# Taskboard release-review fixes verification

Collected: 2026-08-26  
Branch: `dev`  
Base commit: `f3ecae77e9add2ffd649442ee880841e30fc25eb`

## Automated checks

- Signed Empirical receipt `executed-e12abbe11a5e23139e942c8c` records root
  `npm run check` passing against the final fix tree.
- Taskboard `0.3.0`: SDK contract check, TypeScript, 85/85 tests, production
  build, and metadata verification pass.
- Usage Tracker remains `0.1.2`: SDK contract check, TypeScript, 13/13 tests,
  and production build pass unchanged.
- `git diff --check` passes.

Focused coverage proves:

- legacy version-1 browse records receive an empty bounded query without losing
  saved facets; query scopes reload, clear, and provider-reset independently;
- case-variant provider facets canonicalize, deduplicate, render checked, and
  remove every variant on toggle-off;
- the strict confirmed/unknown assignee union persists only exact
  provider-confirmed native IDs, preserves the prior value after partial or
  missing evidence, and clears only an explicitly confirmed unassigned result;
- Linear explicit rejection remains retryable, while lost/malformed dispatched
  Linear results and Jira create/detail confirmation failures carry the
  outcome-uncertain marker;
- GitHub confirmation uses submitted-login membership, including multi-assignee
  results; Linear/Jira return native IDs when their responses expose them;
- external context and CLI output visibly escape full C1 plus bidi mark,
  override, embedding, and isolate controls;
- Linear list/detail issue fragments request 100 labels, matching creation's
  accepted selection maximum;
- constrained focus, no-match, overflow, metadata alert, confirmed-result, and
  durable search integration have source/CSS regression guards.

## Live BB browser walkthrough

The watched local-path plugin was exercised in the real BB app without sending
any issue creation or other provider mutation.

### Durable search and shared surfaces

- On configured Linear project `freebee`, entered `FRE-336`, observed one
  result, opened its live detail, returned, and confirmed the input/result still
  matched. A hard page reload preserved both again.
- In Taskboard's constrained right panel for `bb-plugins`, entered
  `shared-query-check`, activated **Open full Taskboard**, and confirmed the full
  project board rendered the same query on its first frame.
- Cleared both test queries afterward. The final `freebee` record has empty
  query/facets and retains List view/default collapse overrides.

### Keyboard filter interaction and facet identity

- Opened constrained Filters and confirmed `document.activeElement` was the
  `Search filter values` input.
- Entered a long no-match value; `No matching values` appeared while the values
  region reported `clientWidth = scrollWidth = 286` and computed
  `overflow-x: hidden`.
- Escape closed the menu and restored focus to the Filters trigger.
- Seeded only local device preferences with lower/upper variants of the same
  freebee assignee. Reload canonicalized them to one current
  `Mateo Cerquetella`, rendered it checked, and one toggle removed it completely.
  The test preference was restored to empty.

### Metadata error recovery

- Temporarily intercepted only the browser's
  `getCreateIssueMetadata` request with a synthetic rejected Promise containing
  secret-like text; no backend setting, credential, or provider was changed.
- The dialog rendered `Couldn't load creation options`, the fixed safe network
  message, and Retry inside `role="alert"`; none of the synthetic raw text
  appeared. Create stayed disabled and its `aria-describedby` matched the alert
  ID. Separate contract tests prove raw server errors/cause/stack are discarded
  into the strict `safeMessage` result.
- Restored the original browser fetch function, reopened the dialog, and
  confirmed native Linear properties loaded normally with no alert. The dialog
  was cancelled; no create RPC was sent.

## Replacement npm archive

- Exact archive:
  `/home/dyaus/.bb/thread-storage/thr_7my6pz67bn/taskboard-v0.3.0-release-final-candidate-v2/bb-plugin-taskboard-0.3.0.tgz`
- SHA-256:
  `9004d7495775ad696ad35517532eaacbd0e4558d429eda5eca55af9d9dca4f08`
- npm identity: `bb-plugin-taskboard@0.3.0`; 426,630 packed bytes,
  2,443,486 unpacked bytes, 53 regular entries.
- All 53 archive members are byte-identical to their current source/build
  counterparts. Required manifest/license/docs/source/app/server metadata and
  bundles are present; dotenv, npm config, tests, `node_modules`, and credential
  paths are absent.
- Packed app/server metadata identify Taskboard `0.3.0`, SDK `0.4.6`, and BB
  `0.38.0`.
- This archive supersedes the earlier pre-fix candidate. Its digest must be
  rechecked after the final release commit and immediately before publishing
  this exact file with `--ignore-scripts`.
- The fail-closed verify/publish wrapper passed in verification mode against the
  canonical regular file, pinned package/version/registry, and approved digest;
  publish mode remains unexecuted pending approval.

## Credentials and availability

- `.npm-publish.env` is ignored, untracked, mode `600`, and absent from the
  archive/evidence. Its value was never printed or read into artifacts.
- `bb-plugin-taskboard@0.3.0` and origin tag `taskboard/v0.3.0` remain absent.
- No release branch, tag, package, GitHub release, marketplace push, or PR was
  created remotely.
- After publication, exact `npm view bb-plugin-taskboard@0.3.0 version` equality
  is mandatory before the marketplace build/liveness rerun and push.

## Screenshot artifacts

- `search-restored-after-detail.png` —
  `sha256:be8f81d67d82b5b80551ee0217232cb7ae48b3ef1b6ddcf930a3dd9e18c89663`
- `full-restores-right-panel-query.png` —
  `sha256:9b470f59f3661b183cb833251f1ef363825ba76d86363ec036b34b6e8809995e`
- `constrained-filter-keyboard-focus.png` —
  `sha256:21c3f3d4047d7ebcd465627d85e45b55d234972e2c074b8c0d25f995e2f7547d`
- `create-metadata-error-alert.png` —
  `sha256:2fa7b495affa60b11bf668f4c3ce1c2fac78c564d7435138a352418aebfe587a`

## Acceptance coverage

- AC-UI-1: preference/unit guards, detail/reload/full-right walkthrough, and two
  screenshots.
- AC-2: structured adapter/RPC results and confirmed/mismatch/unassigned tests.
- AC-3: Linear/Jira ambiguity and explicit rejection tests.
- AC-4: adversarial context plus CLI plain/JSON tests.
- AC-UI-2: keyboard focus/Escape, width metrics, metadata alert recovery, and
  two screenshots.
- AC-5: canonical option/toggle tests plus live lower/upper-case reconciliation.
- AC-6: 100-label source/adapter test.
- AC-7: README review and source guard.
- AC-8: replacement archive inspection/digest/member equality, credential
  exclusion, exact-version/tag absence, and preserved remote approval gate.
