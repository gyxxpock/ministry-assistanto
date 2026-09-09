## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- `/graphify` triggers the graphify skill (`.claude/skills/graphify/SKILL.md`) — use it for any "input to knowledge graph" request before doing anything else.

## Agent Orchestration

The 8 roles in `.claude/agents/` are **native Claude Code subagents** (each has YAML frontmatter with `name`/`description`/`tools`/`model`). They **auto-dispatch by their `description`** — do not read the agent `.md` files into the main thread before a task.

- **Delegate only for non-trivial work** (multi-file implementation, codebase exploration, architectural design). For those, launch subagents with the `Agent` tool before writing code — `Explore`/fork for orientation, `Plan` for design, then the relevant layer agent for implementation. Trivial single-file edits need no delegation.
- **Multi-layer features** follow layer order: **Domain → Data → Facade → UI**; `testing-agent` accompanies every implementation; `architecture-guardian` reviews last.
- **Reviewers** (`ux-agent`, `architecture-guardian`) have no `Edit`/`Write` — they audit only.
- **Force a specific role** by asking for it by name or invoking it directly with the `Agent` tool, instead of relying on auto-dispatch.

See [AGENTS.md](./AGENTS.md) for the role index.

## Arquitecture Rules (Clean Architecture)
This is a brand-new Angular project following Clean Architecture. No legacy code is present.

### Layer Dependency Rules:
- **Domain:** Pure business logic, core entities, and repository interfaces (TypeScript only, agnostic of Angular).
- **Data / Infrastructure:** Implements repository interfaces, handles HTTP requests (`HttpClient`), mappers, and third-party services.
- **Presentation:** Angular components, templates, and view state management (Signals or RxJS).

*Rule of Gold:* Outer layers can depend on inner layers, but Domain MUST NEVER import or know about Data or Presentation.

### Knowledge Graph Integration
Always read `graphify-out/GRAPH_REPORT.md` or execute `/graphify query` before writing new business logic or structural features.
