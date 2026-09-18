# Workflow: stale-doc detection (`/docs drift [--path <scope>]`)

Read-only. `documentation-reviewer` runs all 6 checks below against `docs/**` (optionally narrowed to `--path <scope>`, a module name or doc subtree) and writes findings to `docs/generated/drift/latest.md`. Nothing else is touched — fixing a finding is a separate `/docs feature`/`/docs module`/`/docs architecture` run, dispatched afterward if the user asks.

## The 6 checks

### 1. Stale architecture docs
For each file under `docs/generated/architecture/**` and `docs/curated/architecture/**`, read its front-matter `source_commit` and `sources:` list. Run `scripts/docs/check-staleness.sh <source_commit> <sources...>` — checking only the doc's own cited sources, not a blanket `git diff -- src/app` (a change in one module's files must not flag every other module's docs as stale just because both live under `src/app`). Only if the script reports `RESULT: STALE` do you cross-check against `graphify-out/graph.json`'s `built_at_commit`; if the graph itself is also behind HEAD, flag "graph and doc both stale" rather than two separate findings.

### 2. Outdated agent definitions
For each `.claude/agents/*.md`, parse its `## Scope` file-tree block, get the newest touched file's commit via `git log -1 --format=%H -- <path>`, and compare against the agent file's own last-modified commit (`git log -1 --format=%H -- .claude/agents/<agent>.md`). If the scope's code changed more recently than the agent doc, cross-check with `graphify explain "<AgentName's domain concept>"` before flagging — a scope-tree mismatch isn't drift if the agent's responsibilities didn't actually change.

### 3. Moved or renamed files
For every file path cited in any `docs/**` doc, run `scripts/docs/resolve-moved-path.sh <path>` instead of `test -e` + manual `git log --follow`. Its output is directly `EXISTS <path>`, `MOVED <old> -> <new>`, or `NOT_FOUND <path>`; only fall back to `graphify query "<basename>"` on `NOT_FOUND` (e.g. content changed too much for rename detection). Report the doc, the dead path, and the resolved new path if found.

### 4. Broken doc-to-doc links
Extract every relative markdown link (`[text](path)` or `[text](path#anchor)`) from `docs/**`. Verify the target file exists and, if an anchor is present, that a heading slug matching it exists in the target. Report dead links and dead anchors separately.

### 5. Feature/module mismatch
Cross-check `src/app/<module>/` directories that have `domain/data/facade/presentation` subfolders against `docs/generated/modules/*/overview.md` and `docs/generated/ai/*/context.md`. A module directory with no matching overview/context file is a coverage gap, not a staleness bug — report it as "missing docs," a distinct category from the other 5.

### 6. Stale invariants
For each invariant cited in `docs/generated/ai/**/context.md` (format: a claim plus a `file:line` citation), verify the file still exists at that line count and run `git diff <source_commit> HEAD -- <file>` — if the diff touches the cited line range, flag the invariant as possibly stale (the line moved or the logic changed) rather than asserting it's wrong; a human or `ai-docs-agent` re-verifies before rewriting.

## Output: `docs/generated/drift/latest.md`

Front matter: `doc_type: drift-report`, `generated_by: documentation-reviewer`, `source_commit` (= HEAD at scan time), no `module` (repo-wide unless `--path` was given, in which case add `scope: <path>`). Body: one H2 per check category above, each listing findings as `- <doc path>: <finding>` or `(none found)`. This file is fully overwritten each run, not appended to.
