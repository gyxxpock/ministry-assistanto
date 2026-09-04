## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Contextual Agents (Auto-Dispatch)

This project uses an auto-dispatch agent system. Before responding to ANY task:

1. Read `.claude/agents/_dispatcher.md` to run the routing logic.
2. Identify which agents apply based on the task content.
3. Read each relevant agent's file from `.claude/agents/`.
4. Apply their combined rules for the entire response.
5. Announce active agents in a brief header: `> Agentes: X · Y · Z`

The user does NOT need to invoke agents manually. Auto-dispatch handles routing.
Manual prefix (`DomainAgent: ...`) is still valid as an explicit override.

See [AGENTS.md](./AGENTS.md) for the full index of available agents.

## Arquitecture Rules (Clean Architecture)
This is a brand-new Angular project following Clean Architecture. No legacy code is present.

### Layer Dependency Rules:
- **Domain:** Pure business logic, core entities, and repository interfaces (TypeScript only, agnostic of Angular).
- **Data / Infrastructure:** Implements repository interfaces, handles HTTP requests (`HttpClient`), mappers, and third-party services.
- **Presentation:** Angular components, templates, and view state management (Signals or RxJS).

*Rule of Gold:* Outer layers can depend on inner layers, but Domain MUST NEVER import or know about Data or Presentation.

### Knowledge Graph Integration
Always read `graphify-out/GRAPH_REPORT.md` or execute `/graphify query` before writing new business logic or structural features.
