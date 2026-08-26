#!/usr/bin/env bash
set -euo pipefail

readonly expected_package='bb-plugin-taskboard'
readonly expected_version='0.3.0'
readonly registry='https://registry.npmjs.org/'

usage() {
  echo "usage: $0 --archive /absolute/path.tgz --sha256 HEX [--publish]" >&2
  exit 2
}

archive=''
expected_sha256=''
mode='verify'
while (($# > 0)); do
  case "$1" in
    --archive)
      (($# >= 2)) || usage
      archive=$2
      shift 2
      ;;
    --sha256)
      (($# >= 2)) || usage
      expected_sha256=$2
      shift 2
      ;;
    --publish)
      mode='publish'
      shift
      ;;
    *) usage ;;
  esac
done

[[ "$archive" == /* ]] || { echo 'archive path must be absolute' >&2; exit 1; }
[[ "$expected_sha256" =~ ^[0-9a-f]{64}$ ]] || {
  echo 'expected SHA-256 must be 64 lowercase hexadecimal characters' >&2
  exit 1
}
[[ -f "$archive" && ! -L "$archive" ]] || {
  echo 'archive must be a regular non-symlink file' >&2
  exit 1
}
canonical_archive=$(realpath -e -- "$archive")
[[ "$canonical_archive" == "$archive" ]] || {
  echo 'archive path must already be canonical and contain no symlink component' >&2
  exit 1
}
actual_sha256=$(sha256sum "$canonical_archive" | awk '{print $1}')
[[ "$actual_sha256" == "$expected_sha256" ]] || {
  echo 'archive SHA-256 does not match the approved digest' >&2
  exit 1
}

metadata=$(tar -xOf "$canonical_archive" package/package.json | node -e '
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
    const value = JSON.parse(input);
    process.stdout.write(`${value.name ?? ""}\t${value.version ?? ""}`);
  });
')
[[ "$metadata" == "${expected_package}"$'\t'"${expected_version}" ]] || {
  echo 'archive package name/version does not match the approved release' >&2
  exit 1
}
if tar -tzf "$canonical_archive" | grep -Eq '(^|/)(\.env|\.npmrc|node_modules)(/|$)|(^|/)\.\.?(/|$)'; then
  echo 'archive contains a forbidden or unsafe path' >&2
  exit 1
fi

echo "verified ${expected_package}@${expected_version} sha256:${actual_sha256} at ${canonical_archive}"
[[ "$mode" == 'publish' ]] || exit 0

if npm view "${expected_package}@${expected_version}" version \
  --registry "$registry" >/dev/null 2>&1; then
  echo "${expected_package}@${expected_version} already exists at ${registry}" >&2
  exit 1
fi

repo_root=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
dotenv_path="${repo_root}/.npm-publish.env"
[[ -f "$dotenv_path" && ! -L "$dotenv_path" ]] || {
  echo 'secure npm dotenv is missing or is a symlink' >&2
  exit 1
}
[[ "$(stat -c '%a' "$dotenv_path")" == '600' ]] || {
  echo 'secure npm dotenv must have mode 600' >&2
  exit 1
}

npmrc_path=$(mktemp)
cleanup() {
  unset NPM_TOKEN || true
  find "$npmrc_path" -maxdepth 0 -type f -delete
}
trap cleanup EXIT
chmod 600 "$npmrc_path"
printf '%s\n' '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' >"$npmrc_path"

# The secrets plugin creates this owner-only dotenv; never print its contents.
source "$dotenv_path"
[[ -n "${NPM_TOKEN:-}" ]] || { echo 'NPM_TOKEN is missing' >&2; exit 1; }
# Even if the dotenv used `export`, keep validation children credential-free.
export -n NPM_TOKEN 2>/dev/null || true

# Revalidate the approved object after every setup/network step and immediately
# before npm opens it. Any path, type, digest, or identity change fails closed.
[[ -f "$canonical_archive" && ! -L "$canonical_archive" ]] || {
  echo 'archive changed type before publication' >&2
  exit 1
}
[[ "$(realpath -e -- "$canonical_archive")" == "$canonical_archive" ]] || {
  echo 'archive path changed before publication' >&2
  exit 1
}
publish_sha256=$(sha256sum "$canonical_archive" | awk '{print $1}')
[[ "$publish_sha256" == "$expected_sha256" ]] || {
  echo 'archive digest changed before publication' >&2
  exit 1
}
publish_metadata=$(tar -xOf "$canonical_archive" package/package.json | node -e '
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
    const value = JSON.parse(input);
    process.stdout.write(`${value.name ?? ""}\t${value.version ?? ""}`);
  });
')
[[ "$publish_metadata" == "${expected_package}"$'\t'"${expected_version}" ]] || {
  echo 'archive identity changed before publication' >&2
  exit 1
}
NPM_TOKEN="$NPM_TOKEN" \
  NPM_CONFIG_USERCONFIG="$npmrc_path" \
  npm publish "$canonical_archive" \
  --ignore-scripts \
  --registry "$registry"
unset NPM_TOKEN

published_version=$(npm view "${expected_package}@${expected_version}" version \
  --registry "$registry")
[[ "$published_version" == "$expected_version" ]] || {
  echo 'registry did not confirm the exact published version' >&2
  exit 1
}
echo "confirmed ${expected_package}@${published_version} at ${registry}"
