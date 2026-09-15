# Workflow: documenting architecture (`/docs architecture`)

Refreshes the repo-wide architecture docs: `docs/generated/architecture/dependency-overview.md`, `docs/generated/architecture/known-violations.md`, and (only when the underlying narrative actually changed, not on every run) `docs/curated/architecture/overview.md`.

## Ownership boundary — read this before touching `known-violations.md`

`architecture-guardian` is the sole authority on violation status. `architecture-doc-agent` never invents or judges a violation — it transcribes `architecture-guardian`'s current findings into `docs/generated/architecture/known-violations.md` and nothing else. If `architecture-guardian` hasn't been run recently, dispatch it first; do not write stale or guessed violations.

## Steps

1. Step 1 orientation — this is the one subcommand allowed to read `graphify-out/GRAPH_REPORT.md` in full, plus `graphify query "god nodes"` and `graphify query "communities"`.
2. Dispatch `architecture-guardian` (reviewer only, no Edit/Write) to produce current findings across all modules.
3. Dispatch `architecture-doc-agent` to:
   - Write `docs/generated/architecture/dependency-overview.md`: God Nodes and community structure, cited from graphify, plus per-module cross-references contributed by prior `/docs feature` runs.
   - Write `docs/generated/architecture/known-violations.md`: one entry per violation `architecture-guardian` reported, with the module, the specific rule broken, and the file:line. This file fully replaces its previous contents each run — it is not append-only.
4. If `architecture-guardian`'s findings describe a *new* structural decision (not just a violation — e.g. a boundary that shifted), dispatch `human-docs-agent` to update the relevant paragraph in `docs/curated/architecture/overview.md`, marked `status: draft` for review. Do not touch this file for a run that only reconfirms existing violations.
5. Update manifest, reviewer self-check.

## What moved out of `architecture-guardian.md`

The violations table that used to live inline in `.claude/agents/architecture-guardian.md` now lives only in `docs/generated/architecture/known-violations.md`. `architecture-guardian.md` keeps its review process/checklist and links to the generated file instead of hardcoding a table that would go stale between doc runs.
