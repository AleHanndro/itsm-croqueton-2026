<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:base-ui-agent-rules -->

## This project uses Base UI, NOT Radix UI

This project uses Base UI. Its documentation can be found at
<https://base-ui.com/llms.txt>.

Base UI components do not have the same API as Radix UI; this includes props,
data attributes, and components. Do not assume Radix patterns carry over, even
when they look similar.

There is no `asChild` prop on any component; instead, the `render` prop is
used. Read Base UI's composition guide for details on how to use `render`:
<https://base-ui.com/react/handbook/composition.md>.

Always consult the Base UI `llms.txt` doc before building components with Base
UI to ensure the correct patterns are being used.

<!-- END:base-ui-agent-rules -->
