---
doc_type: onboarding
module: root
status: draft
generated_by: human-docs-agent
sources:
  - package.json
---

# Getting started

## Prerequisites

- Node.js compatible with Angular 20.2.x and the CLI pinned in `package.json`
  (`@angular/cli ^20.2.2`).
- No backend to stand up — this is a client-only app persisting to IndexedDB via Dexie.

## Install

```bash
npm install
```

## Run the app locally

```bash
npm start
```

Runs `ng serve` (see `scripts.start` in `package.json`). Serves on the Angular CLI's
default dev server port with live reload.

## Build

```bash
npm run build
```

Runs `ng build` — production defaults from `angular.json`.

For a watch build during development:

```bash
npm run watch
```

Runs `ng build --watch --configuration development`.

## Test

```bash
npm test
```

Runs `ng test` — Karma + Jasmine. See `testing-agent` (`.claude/agents/testing-agent.md`)
for the per-layer testing strategy and the coverage mandate.

## i18n check

```bash
npm run i18n:check
```

Runs `node ./scripts/check-i18n.js` — verifies translation keys are complete across
locales. Run this before shipping any UI change that adds or renames a string.

## Deploy (GitHub Pages)

```bash
npm run build:gh    # ng build --configuration production
npm run deploy       # build:gh + npx angular-cli-ghpages --dir=dist/ministry-assistanto
```

`deploy` builds for production and publishes `dist/ministry-assistanto` via
`angular-cli-ghpages`. Treat this as a release action — confirm with a human before
running it from an agent session.

## Where to go next

- [Module tour](module-tour.md) for a map of the codebase.
- [Architecture overview](../architecture/overview.md) for the layering rules.
- [AGENTS.md](../../../AGENTS.md) for the subagent role index.
