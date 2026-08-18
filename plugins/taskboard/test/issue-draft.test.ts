import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildIssueDraftPrompt,
  fallbackIssueDraft,
  parseIssueDraftOutput
} from '../issue-draft.ts';

test('parses a tagged model response into a ticket draft', () => {
  const draft = parseIssueDraftOutput(`Some ignored preface
<TASKBOARD_ISSUE_DRAFT>
{"title":"Create issues from New thread prompts","description":"Context.\\n\\n## Requested change\\nDraft the ticket.\\n\\n## Acceptance criteria\\n- [ ] The title is editable."}
</TASKBOARD_ISSUE_DRAFT>`);

  assert.deepEqual(draft, {
    title: 'Create issues from New thread prompts',
    description:
      'Context.\n\n## Requested change\nDraft the ticket.\n\n## Acceptance criteria\n- [ ] The title is editable.'
  });
});

test('rejects malformed or incomplete model output', () => {
  assert.equal(parseIssueDraftOutput('I could not produce the ticket.'), null);
  assert.equal(
    parseIssueDraftOutput(
      '<TASKBOARD_ISSUE_DRAFT>{"title":"Only a title"}</TASKBOARD_ISSUE_DRAFT>'
    ),
    null
  );
});

test('builds a read-only repository-aware worker prompt', () => {
  const prompt = buildIssueDraftPrompt({
    prompt: 'make this work from new thread',
    projectName: 'bb-plugins',
    source: 'linear'
  });

  assert.match(prompt, /inspect the repository/u);
  assert.match(prompt, /Do not edit files/u);
  assert.match(prompt, /bb-plugins/u);
  assert.match(prompt, /linear/u);
  assert.match(prompt, /make this work from new thread/u);
});

test('keeps the original prompt as an editable fallback', () => {
  assert.deepEqual(
    fallbackIssueDraft('# Fix the task title\n\nKeep the full context.'),
    {
      title: 'Fix the task title',
      description: '# Fix the task title\n\nKeep the full context.'
    }
  );
});
