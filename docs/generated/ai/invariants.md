---
doc_type: ai-context
module: root
source_commit: <pending-first-generation>
generated_by: ai-docs-agent
status: draft
sources:
  - .claude/agents/domain-agent.md
  - .claude/agents/data-agent.md
  - .claude/agents/facade-agent.md
  - .claude/agents/ui-agent.md
  - .claude/agents/architecture-guardian.md
---

# Cross-module invariants

This file aggregates the "Absolute restrictions" and "Warning signals" sections that
already exist in each layer agent's `.md` definition under `.claude/agents/`, so an AI
context consumer has one place to check invariants that span more than one module,
without re-reading every agent file. `ai-docs-agent` regenerates this file; it is never
hand-edited, and it never restates a rule that's fully local to one module (those live
in that module's own `docs/generated/ai/<module>.md`).

Each entry is cited to the file/line where the rule is enforced or documented, in the
same `file:line` format used by `graphify explain`.

## Format

- `<invariant statement>` — `<file>:<line>` — source: `<agent>`

## Example entry

- `ITimeEntryRepository` must only be imported from `domain/` and `facade/`, never
  instantiated concretely (`DexieTimeEntryRepository`) outside `data/` —
  `.claude/agents/architecture-guardian.md:37` — source: `architecture-guardian`

Regenerate with `/docs invariants` (or as part of `/docs feature <module>` for a
module-scoped subset) once real per-module invariants have been drafted by
`ai-docs-agent`.
