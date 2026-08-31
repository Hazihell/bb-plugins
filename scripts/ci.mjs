import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['run', 'check'], {
  env: process.env,
  stdio: 'inherit'
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
