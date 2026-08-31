# Fonts

This template bundles no font binary.

Monospaced text asks for `Berkeley Mono` first, but only through `local()`
sources in `../globals.css`. A machine with Berkeley Mono installed
uses it; every other machine falls back to the system monospace stack, which
renders correctly on its own.

Keep this directory free of `.woff2` files. The repo-root `.gitignore` blocks them.
