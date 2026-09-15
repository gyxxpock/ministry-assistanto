---
doc_type: index
module: root
status: draft
generated_by: human
sources: []
---

# Ministry Assistanto — Documentation

This is the master table of contents for the project's documentation. Docs are split
into two trees with different ownership rules — see [CLAUDE.md](../CLAUDE.md#documentation)
for the full policy:

- **`curated/`** — human-owned narrative docs. Agents may draft (`status: draft`), but
  only a human promotes a doc to `status: reviewed`.
- **`generated/`** — machine-owned, regenerated on demand via `/docs`. Always safe to
  delete; never hand-edit.

## Onboarding

- [Getting started](curated/onboarding/getting-started.md) — clone, run, build, test.
- [Module tour](curated/onboarding/module-tour.md) — what lives where.

## Architecture

- [Architecture overview](curated/architecture/overview.md) — the 4-layer Clean
  Architecture narrative.
- [Architecture Decision Records](curated/architecture/adr/) — numbered, immutable
  decision log. Start with [ADR-0001](curated/architecture/adr/0001-record-architecture-decisions.md).
- [Dependency overview (generated)](generated/architecture/dependency-overview.md) —
  Mermaid diagram of layer dependencies, regenerated from `graphify-out/`.
- [Known violations (generated)](generated/architecture/known-violations.md) —
  transcribed from `architecture-guardian`'s live review.

## Workflows

- [Feature lifecycle](curated/workflows/feature-lifecycle.md) — how a feature moves
  Domain → Data → Facade → UI, and where docs fit in.

## Generated: AI context

- [AI-context index](generated/ai/index.json) — retrieval index for per-module AI
  context docs (`generated_by: ai-docs-agent`).
- [Invariants](generated/ai/invariants.md) — cross-module invariants aggregated from
  agent "Absolute restrictions" / "Warning signals" sections.

## Generated: drift

- [Latest drift report](generated/drift/latest.md) — output of the most recent
  `/docs drift` run.

## Generated: API reference

- [`generated/api/`](generated/api/) — reserved for a future Compodoc static site.
  Compodoc output is **not** merged into this doc tree's navigation; it will be
  published as its own linked URL path once `compodoc-agent` is explicitly activated
  (see `.claude/agents/compodoc-agent.md`). Currently empty (dormant).

## Manifest

- [`_meta/doc-manifest.json`](_meta/doc-manifest.json) — machine-readable index of
  every doc's front-matter, used by `documentation-reviewer` for drift checks.
