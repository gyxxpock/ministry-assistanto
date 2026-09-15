# Workflow: AI context generation (`/docs ai-context <module|--all>`)

Writes `docs/generated/ai/<module>/context.md` — a doc meant to be *retrieved*, not read cover-to-cover by a human. Optimize every choice below for a future agent pulling this into its own context window.

## Retrieval formatting rules

- One concern per heading (H2 or H3) — a heading should be a unit another agent could retrieve on its own and still make sense.
- 150–300 words per section. Longer sections should split, not run on.
- 300–500 tokens per retrievable unit overall (roughly one H2 + its content) — this is the chunk size to write for, even though this skill doesn't do the actual chunking/embedding.

## Fixed schema for `context.md`

Front matter: `doc_type: ai-context`, `module`, `source_commit`, `generated_by: ai-docs-agent`.

1. **Purpose** — one or two sentences, what this module is for.
2. **Public API** — the facade's public surface, named with signatures, no prose padding.
3. **Key invariants** — bullet list, each invariant paired with a `file:line` citation (e.g. "`WeeklySchedule.days` is always exactly 7 entries — `weekly-schedule.entity.ts:14`"). An invariant with no citation does not belong in this file.
4. **Dependencies** — from graphify (`graphify explain "<module>"`), cited.
5. **God Nodes / edges touching this module** — link into `docs/generated/architecture/dependency-overview.md`, do not re-list the full graph here.
6. **Test coverage** — one line, e.g. "spec files: `<n>`, see `docs/generated/modules/<module>/overview.md` for the module overview" — do not duplicate coverage numbers if `testing-agent` reports them elsewhere.
7. `source_commit` footer line matching the front matter, so a reader who only sees the rendered body (not the front matter) still knows the doc's freshness.

## `index.json`

`docs/generated/ai/index.json` is the machine-readable index of every `context.md`: an array of `{path, module, layer, doc_type, source_commit, generated_by}`. `ai-docs-agent` appends/updates one entry per module it (re)generates and never hand-edits an entry for a module it didn't just touch.

## `invariants.md`

`docs/generated/ai/invariants.md` aggregates every invariant bullet from every module's `context.md` into one flat list, each still carrying its `file:line` citation and a link back to its source module's `context.md`. Regenerate this file's full contents whenever any module's context.md changes — it's a derived rollup, never hand-edited.

## `_template-context.md`

`docs/generated/ai/_template-context.md` is the blank skeleton of the schema above (headings only, no content) — copy from it when starting a new module's `context.md` rather than reconstructing the schema from memory each time.

## `--all`

Runs the module list from `graphify query "module structure"` (or the `src/app/*/` directory scan fallback) through the single-module steps above, one module at a time, skipping any whose manifest `source_commit` is already current.
