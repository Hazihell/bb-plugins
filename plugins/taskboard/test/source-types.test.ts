import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertExpectedIssueSource } from '../create-issue.ts';
import type { ExternalWorkItemDetail } from '../sources/types.ts';
import { withoutComments } from '../sources/types.ts';
import { jiraProjectKeysFromJql } from '../sources/jira-scope.ts';

test('cached summaries never retain provider comments', () => {
  const detail: ExternalWorkItemDetail = {
    source: 'linear',
    locator: 'TASK-42',
    key: 'TASK-42',
    title: 'Polish the Taskboard release',
    description: 'Prepare the public launch.',
    url: 'https://linear.app/example/issue/TASK-42',
    status: 'In progress',
    stateCategory: 'in_progress',
    priority: 'High',
    assignee: 'Mateo',
    project: 'Taskboard',
    labels: ['release'],
    updatedAt: '2026-08-11T12:00:00.000Z',
    comments: [
      {
        author: 'Review bot',
        body: 'This stays in the live detail response only.',
        createdAt: '2026-08-11T12:05:00.000Z'
      }
    ]
  };

  const summary = withoutComments(detail);

  assert.equal('comments' in summary, false);
  assert.equal(summary.key, 'TASK-42');
  assert.deepEqual(summary.labels, ['release']);
});

test('finds Jira project keys from common configured JQL scopes', () => {
  assert.deepEqual(
    jiraProjectKeysFromJql(
      'project = eng OR project in ("Web", mobile) ORDER BY updated DESC'
    ),
    ['ENG', 'WEB', 'MOBILE']
  );
  assert.deepEqual(
    jiraProjectKeysFromJql(
      'assignee = currentUser() AND resolution = Unresolved'
    ),
    []
  );
  assert.deepEqual(jiraProjectKeysFromJql('project = "Engineering Team"'), []);
});

test('binds issue creation to the tracker reviewed in the modal', () => {
  assert.equal(assertExpectedIssueSource('linear', 'linear'), 'linear');
  assert.throws(
    () => assertExpectedIssueSource('linear', 'jira'),
    /changed from Linear to Jira/u
  );
});
