---
name: docs
description: "Use for any documentation request — documenting a feature or module, explaining architecture, detecting stale/drifted docs, generating AI-context or onboarding docs, or preparing release documentation. Always orients via graphify first; never hand-writes markdown ad hoc when a /docs subcommand covers it."
---

# /docs

Orchestrates the documentation subsystem: `documentation-agent` dispatches `human-docs-agent`, `ai-docs-agent`, `architecture-doc-agent`, and (only when explicitly asked) `compodoc-agent` to keep `docs/curated/**` and `docs/generated/**` in sync with the code, grounded in graphify rather than re-derived from scratch.

## Usage

| Subcommand | Workflow | Primary agent(s) |
|---|---|---|
| `/docs` or `/docs --help` | Print this table and stop | — |
| `/docs feature <module\|--all>` | Documenting a feature | documentation-agent → architecture-doc-agent, ai-docs-agent, human-docs-agent |
| `/docs module <module>` | Generated module overview only | documentation-agent |
| `/docs architecture` | Documenting architecture | architecture-guardian → architecture-doc-agent, human-docs-agent |
| `/docs drift [--path <scope>]` | Stale-doc detection | documentation-reviewer → documentation-agent |
| `/docs ai-context <module\|--all>` | AI context generation | ai-docs-agent |
| `/docs onboarding` | Onboarding docs | human-docs-agent |
| `/docs adr "<title>"` | New ADR | human-docs-agent |
| `/docs release` | Release documentation prep | documentation-agent, architecture-doc-agent, ai-docs-agent |
| `/docs site` | Full human-facing site (discovery → all subcommands → Compodoc → MkDocs) | documentation-agent → all specialists |

## What This Skill Is For

Every doc this skill produces traces to a real source: code, `graphify-out/GRAPH_REPORT.md`/`graph.json`, `architecture-guardian`'s live findings, or `public/assets/changelog.json` (read-only). `docs/generated/**` is always safe to delete and regenerate wholesale; `docs/curated/**` is drafted with `status: draft` front-matter and only a human review promotes it to `status: reviewed`. Nothing in this skill installs MkDocs or Compodoc, edits `changelog.json`, or writes an automatic git hook — generation is on-demand only.

## What You Must Do When Invoked

If invoked with no subcommand, or with `--help`/`-h`: print the `## Usage` table verbatim and stop. Do not guess a subcommand.

Follow these steps in order for every other invocation. Do not skip steps.

### Step 0 — Parse subcommand and scope

Identify the subcommand and its argument (a module name, an ADR title, `--all`, or nothing). Module names are the directories under `src/app/*/` that have `domain/`, `data/`, `facade/`, and `presentation/` subfolders (e.g. `goals`, `planning`, `time-entry`). If the user names something that isn't one of these, ask which module they mean rather than guessing.

**Module discovery** (used by `--all` on any subcommand and by `/docs site`): glob `src/app/*/` and keep only directories where `domain/`, `data/`, `facade/`, and `presentation/` all exist as sibling subfolders. Report the discovered list to the user before dispatching anything — this list IS the "which modules are there" answer, not an internal implementation detail. Directories that exist but don't qualify (e.g. `shared/` — no `data/`/`facade/`, or `core/` — flat layout) are still worth naming in the report as *found but not a module*, not silently dropped.

### Step 1 — Mandatory graphify orientation

Never read raw source files to build a doc before grounding in the graph. See `references/graphify-integration.md` for exactly which `graphify` call each subcommand makes and how to fall back if a query returns nothing. This step is never skipped, even for a small module.

### Step 2 — Check the manifest before regenerating

Read `docs/_meta/doc-manifest.json`. For every doc the subcommand would touch, compare its recorded `source_commit` against `git rev-parse HEAD` for the doc's `sources:` paths (`git log -1 --format=%H -- <path>`). If every source is unchanged since `source_commit`, report "up to date — nothing to regenerate" for that doc and skip it. Never regenerate an unchanged doc just because the subcommand was invoked.

### Step 3 — Dispatch specialists

Launch the agent(s) listed in the Usage table for this subcommand via the Agent tool. Give each specialist the specific module/scope and point it at the relevant reference file below rather than re-explaining the workflow inline. Run independent specialists in parallel; run dependent ones in sequence (e.g. `architecture-doc-agent` must transcribe `architecture-guardian`'s findings before `human-docs-agent` writes narrative that depends on them).

### Step 4 — Update the manifest

`documentation-agent` updates `docs/_meta/doc-manifest.json` with the new `source_commit`, `generated_by`, `doc_type`, and `module` for every file a specialist just wrote. A doc without a manifest entry is invisible to Step 2 and to drift detection — never skip this.

### Step 5 — Reviewer self-check

Dispatch `documentation-reviewer` scoped to only the files touched in Step 3 (not a full repo drift sweep — that's `/docs drift`). It reports findings; it does not fix them. Any finding gets routed back to the owning specialist before you report success.

### Step 6 — Report and remind

Summarize what was written or confirmed up-to-date, with paths. If anything under `docs/curated/**` was drafted or changed, explicitly remind the user: it is `status: draft` and needs human review before being marked `reviewed` — this skill never self-promotes curated content.

## References

Each subcommand's mechanical detail lives in its own reference file, loaded on demand — keep this file scannable, put the depth there:

- `references/feature.md` — documenting a feature
- `references/module-overview.md` — generated module overview
- `references/architecture.md` — documenting architecture
- `references/drift.md` — the 6 drift checks, full mechanical detail
- `references/ai-context.md` — AI context generation, chunking and citation rules
- `references/onboarding.md` — onboarding docs
- `references/adr.md` — ADR numbering, status, and supersession
- `references/release.md` — release documentation prep
- `references/site.md` — `/docs site`: discovery, full pipeline, Compodoc + MkDocs build ordering
- `references/graphify-integration.md` — shared Step 1 orientation logic for every subcommand

## Rules

- Never install MkDocs or Compodoc, or add either as a dependency, without explicit user approval — `compodoc-agent` stays dormant until asked. (Approval was given once, for the specific install carried out under the auto-discovery/Compodoc/MkDocs plan — that is not a standing blanket approval for any later, unrelated tooling change.)
- Never write to `public/assets/changelog.json`. Read it for context only; it's owned by the `pr` skill and `ux-agent`.
- Never auto-promote a curated doc from `status: draft` to `status: reviewed` — only a human review does that.
- Never duplicate content `graphify-out/GRAPH_REPORT.md` or `graph.json` already reports — cite and link to it instead of re-deriving a ranking or summary.
- Never regenerate a doc whose sources haven't changed since its last `source_commit` (Step 2) — incremental generation is the point.
- Never write into `docs/curated/**`, `docs/generated/ai/**`, or `docs/generated/architecture/**` from `documentation-agent` directly — always delegate to the owning specialist.
