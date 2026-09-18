# Workflow: full human-facing site (`/docs site`)

The one command that satisfies "scan the repo, list the modules, generate the human-facing docs." Composes every other subcommand and then builds a locally-browsable static site with Compodoc + MkDocs. No arguments.

## Steps

1. Run the module-discovery rule from `SKILL.md`'s Step 0 and report the list to the user (qualifying modules, plus any found-but-not-a-module directories like `shared`/`core`) before doing anything else.
2. Run `/docs feature --all` (see `references/feature.md`) — per-module generated overview, AI context, and curated module tour/narrative entries.
3. Run `/docs architecture` (see `references/architecture.md`) — fresh `architecture-guardian` review transcribed into `dependency-overview.md`/`known-violations.md`.
4. Run `/docs ai-context --all` (see `references/ai-context.md`) — catches the repo-wide rollups (`invariants.md`, `index.json`) that step 2 doesn't refresh on its own.
5. Run `/docs onboarding` (see `references/onboarding.md`) — `getting-started.md` refresh.
6. Dispatch `compodoc-agent` to run Compodoc into `docs/generated/api/`.
7. Dispatch `documentation-agent` to regenerate `mkdocs.yml`'s `nav:` block from `docs/index.md`'s current structure, then run `mkdocs build`. Only the `nav:` block is regenerated — leave `markdown_extensions.pymdownx.superfences.custom_fences` untouched (see below); it does not change per-run.
8. `documentation-agent` updates `docs/_meta/doc-manifest.json` for every file touched across steps 2-7.
9. Dispatch `documentation-reviewer` for a self-check scoped to everything touched this run.
10. Report a summary: modules found, what was generated vs. already up to date, Compodoc's reported documentation-coverage %, and the local path to open the built site (`site/index.html`, or the `mkdocs serve` command for a live-reloading preview).

## Build ordering — do not reorder steps 6 and 7

Compodoc (step 6) must run and finish writing into `docs/generated/api/` **before** `mkdocs build` (step 7). `docs/generated/api/` sits inside MkDocs' `docs_dir`, and MkDocs copies every non-markdown file it finds there through to the built site as a static passthrough. Running Compodoc first means the API reference is already sitting under `docs/generated/api/` when the MkDocs build walks `docs_dir`, so it ends up inside `site/generated/api/` automatically — `mkdocs.yml`'s nav can link straight to `generated/api/index.html` with zero extra wiring. Running them in the other order (or running MkDocs without Compodoc having populated that directory yet) leaves that nav link pointing at nothing.

This is also why Compodoc's output is never merged into MkDocs' own nav/search index (confirmed infeasible when MkDocs/Compodoc were first scoped) — it's a separate static subtree that just happens to live inside the same build output, not a set of pages MkDocs itself renders or indexes.

## Mermaid rendering requires a custom fence, not just the plugin

`mkdocs-mermaid2-plugin` in `plugins:` alone does not make ` ```mermaid ` fences render — with the Material theme, `pymdownx.superfences` also needs an explicit `custom_fences` entry pointing at `mermaid2.fence_mermaid_custom` (the Material-specific loader; plain `fence_mermaid` is for other themes). Without it, a ` ```mermaid ` block just renders as a plain highlighted code block with no error — easy to miss. `mkdocs.yml`'s `markdown_extensions:` block already has this wired; if `mkdocs.yml` is ever regenerated from scratch, this config must be preserved.

## Idempotency

Re-running `/docs site` with no source changes since the last run should report every markdown-generation step (2-5) as "up to date" per each subcommand's own Step 2 manifest check, and skip straight to steps 6-7 — Compodoc and `mkdocs build` are cheap, deterministic, and always re-run regardless of manifest state (they're not LLM-judgment generation, so there's no incremental-generation cost to avoid).

## What this workflow does NOT do

- It does not touch `docs/generated/drift/latest.md` — run `/docs drift` separately if you want a fresh drift report alongside the site build.
- It does not deploy anywhere. The build output (`site/`, `docs/generated/api/`) is local-only and gitignored — no CI/deploy wiring is part of this workflow.
- It does not promote any curated draft to `reviewed` — step 10's report still flags drafted/changed curated content for human review.
