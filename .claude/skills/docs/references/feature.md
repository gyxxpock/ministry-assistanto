# Workflow: documenting a feature (`/docs feature <module>`)

Produces the full doc set for one module: generated overview, generated AI context, and (only if missing) a curated module tour entry. This is the widest subcommand — it's the one to reach for after a module ships, not for a one-file tweak.

## Steps

1. Step 1 orientation (`references/graphify-integration.md`) — `graphify query "<module> module"` + `graphify explain "<module>"`.
2. Dispatch `architecture-doc-agent` to write/refresh `docs/generated/modules/<module>/overview.md` (see `references/module-overview.md`) and to update the God Nodes cross-reference in `docs/generated/architecture/dependency-overview.md` if this module contributes one.
3. Dispatch `ai-docs-agent` in parallel to write/refresh `docs/generated/ai/<module>/context.md` (see `references/ai-context.md`).
4. Once both land, check whether `docs/curated/onboarding/module-tour.md` already has a section for `<module>`. If not, dispatch `human-docs-agent` to add one — a short paragraph plus a link to the generated overview, not a duplicate of it. If a section already exists, leave it; curated content is never silently rewritten by this workflow.
5. `documentation-agent` updates `docs/_meta/doc-manifest.json` for every file touched.
6. `documentation-reviewer` self-checks the touched files only.

## What this workflow does NOT do

- It does not write `docs/curated/architecture/**` — that's `/docs architecture`.
- It does not touch `docs/generated/drift/latest.md` — that's `/docs drift`.
- It does not promote any curated draft to `reviewed`.

## Output example

For `planning`, this workflow produces `docs/generated/modules/planning/overview.md`, `docs/generated/ai/planning/context.md`, a `planning` entry in `dependency-overview.md`'s cross-reference (for `WeeklySchedule`/`WeeklyScheduleEditorComponent`), and a new section in `docs/curated/onboarding/module-tour.md`.
