# AGENTS — Ministry Assistanto

Human index of the project's Claude Code subagents. Each role is a **native subagent** defined in `.claude/agents/<name>.md` with YAML frontmatter. The `description` in each file is the source of truth for when it runs — Claude **auto-dispatches by description**; you don't invoke them manually or read their `.md` into the main thread.

## Knowledge Graph (graphify)

Before exploring source code, orient with the graph:

```bash
graphify query "<question>"      # scoped subgraph — more useful than grep
graphify path "<A>" "<B>"        # relationship between two nodes
graphify explain "<concept>"     # deep dive into a specific concept
graphify update .                # refresh after code changes (no API cost)
```

## Role index

| Subagent | Layer / Scope | Edits code? |
|----------|---------------|-------------|
| `domain-agent` | `src/app/**/domain/` — entities, use cases, repository interfaces | yes |
| `data-agent` | `src/app/**/data/` — Dexie/IndexedDB, repositories, migrations | yes |
| `facade-agent` | `src/app/**/facade/` — orchestration, application state | yes |
| `ui-agent` | `src/app/**/presentation/` — components, templates, ViewModels | yes |
| `signals-agent` | Transversal — Angular Signals state | yes |
| `testing-agent` | Transversal — specs & coverage (Karma/Jasmine) | yes |
| `ux-agent` | `src/app/**/presentation/` — UX + iOS review | no (reviewer) |
| `architecture-guardian` | Transversal — Clean Architecture review | no (reviewer) |

## Orchestration

- Layer order for multi-layer features: **Domain → Data → Facade → UI**; `testing-agent` accompanies implementation; `architecture-guardian` reviews last.
- Reviewers (`ux-agent`, `architecture-guardian`) have no `Edit`/`Write`.
- Delegate real subagents (`Agent` tool) only for non-trivial work; trivial single-file edits don't need it.

See [CLAUDE.md](./CLAUDE.md) for the full orchestration guidance.
