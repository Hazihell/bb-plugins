# Design

Apply a narrow copy-only correction to `plugins/dockside/README.md`: remove the
release badge; change the introduction to `Dockside`; rename the screenshot
section `Dockside in action`; remove version text from the three alt attributes;
and make the Install introduction version-neutral. Preserve the semver range and
tag link inside Install because those values are executable trust coordinates.
Do not change media files, filenames, runtime code, or add community copy.

Verify with scoped searches, media-reference checks, and `git diff --check`.
