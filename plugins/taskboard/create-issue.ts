import type { WorkSource } from './contract.js';

const SOURCE_LABELS: Record<WorkSource, string> = {
  github: 'GitHub',
  jira: 'Jira',
  linear: 'Linear'
};

export function assertExpectedIssueSource(
  expectedSource: WorkSource,
  currentSource: WorkSource
): WorkSource {
  if (currentSource !== expectedSource) {
    throw new Error(
      `Taskboard changed from ${SOURCE_LABELS[expectedSource]} to ${SOURCE_LABELS[currentSource]} while this issue was being reviewed. Reopen the form before creating it.`
    );
  }
  return expectedSource;
}
