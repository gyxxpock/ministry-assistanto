# Workflow: onboarding docs (`/docs onboarding`)

Curated, human-facing. Writes/refreshes `docs/curated/onboarding/getting-started.md` and `docs/curated/onboarding/module-tour.md`. Both are drafted with `status: draft` — this workflow never marks either `reviewed`.

## `getting-started.md`

Short and stable: repo clone/install/run steps, how to run tests, how to run `graphify update .`, and a pointer to `docs/index.md` for everything else. This file should change rarely — if a run finds nothing changed in `package.json` scripts or the repo's setup commands since its `source_commit`, report up to date and don't touch it.

## `module-tour.md`

One short section per module (`goals`, `planning`, `time-entry`, `shared`, ...): 2-4 sentences plus a link to that module's `docs/generated/modules/<module>/overview.md`. This is a map, not a summary — do not restate the generated overview's content here. New modules get a new section appended; existing sections are only touched if the module's purpose has materially changed (confirm via `graphify explain "<module>"` before rewriting a section that already reads fine).

## Steps

1. Step 1 orientation — `graphify query "module structure"`.
2. Dispatch `human-docs-agent` for both files (or just the one that's actually stale/missing).
3. Update manifest with `status: draft`. Reviewer self-check.
4. Step 6 report explicitly flags both files as needing human review before `reviewed`.
