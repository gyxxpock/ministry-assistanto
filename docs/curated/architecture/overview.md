---
doc_type: architecture
module: root
status: draft
generated_by: human-docs-agent
sources:
  - CLAUDE.md
  - graphify-out/GRAPH_REPORT.md
---

# Architecture overview

Ministry Assistanto follows Clean Architecture with four layers:

```
Domain  →  Data  →  Facade  →  Presentation
```

The full dependency-direction rules and the "Rule of Gold" (Domain must never import
Data or Presentation) are defined once in
[CLAUDE.md § Arquitecture Rules (Clean Architecture)](../../../CLAUDE.md#arquitecture-rules-clean-architecture) —
this doc links to that instead of restating it, so the two never drift apart.

## Layers, briefly

- **Domain** — entities, use cases, repository interfaces. Pure TypeScript, no Angular.
- **Data** — repository implementations (Dexie/IndexedDB), mappers.
- **Facade** — orchestrates use cases and repositories, exposes application state.
- **Presentation** — Angular components, templates, ViewModels. Consumes the Facade only.

## Where to see the live dependency graph

Layer boundaries are enforced by convention and reviewed by `architecture-guardian`
(`.claude/agents/architecture-guardian.md`), not by a lint rule. To see the actual,
current dependency structure:

- [Dependency overview (generated)](../../generated/architecture/dependency-overview.md) —
  Mermaid diagram regenerated from `graphify-out/`.
- [Known violations (generated)](../../generated/architecture/known-violations.md) —
  the live list of open architecture debt.
- `graphify query "<question>"` / `graphify explain "<concept>"` for anything not
  covered by the two docs above — see [CLAUDE.md § graphify](../../../CLAUDE.md#graphify).

## DI and module scoping

For the root-scoped-vs-module-scoped DI pitfall (a root service cannot inject a
module-scoped one), see the "DI scope restriction" section of
`.claude/agents/architecture-guardian.md` — not duplicated here to avoid drift.
