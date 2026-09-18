---
doc_type: workflow
module: root
status: draft
generated_by: human-docs-agent
sources:
  - AGENTS.md
---

# Feature lifecycle

Multi-layer features in this project are implemented in a fixed order, defined in
[AGENTS.md § Orchestration](../../../AGENTS.md#orchestration):

```
Domain → Data → Facade → UI
```

`testing-agent` accompanies implementation at every layer (not a final pass), and
`architecture-guardian` reviews last, once all layers are in place.

## Where documentation fits in

The documentation subsystem follows the same pattern as `testing-agent`: it
**accompanies** implementation rather than trailing it as an afterthought.

- While a feature is being built, docs stay `status: draft` — `human-docs-agent` and
  `ai-docs-agent` draft as the code lands, they don't wait for a "docs pass" at the end.
- `architecture-doc-agent` transcribes `architecture-guardian`'s findings for the new
  feature into `docs/generated/architecture/` once the review lands.
- Nothing here is automatic: documentation generation is always triggered on demand via
  `/docs ...` (see [CLAUDE.md § Documentation](../../../CLAUDE.md#documentation)), never
  a post-commit hook.
- A human still owns promotion of curated docs (getting-started, module tour,
  architecture narrative, ADRs) from `draft` to `reviewed` — agents never self-promote.

## Typical order for a new feature

1. `domain-agent` → `data-agent` → `facade-agent` → `ui-agent`, each accompanied by
   `testing-agent`.
2. `architecture-guardian` reviews the finished feature.
3. `/docs feature <module>` refreshes that module's AI-context doc and, if requested,
   its curated docs draft.
4. `architecture-doc-agent` refreshes `docs/generated/architecture/known-violations.md`
   if the review surfaced anything new.
