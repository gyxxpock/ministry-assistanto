# AGENTS — Ministry Assistanto

Contextual roles for Claude Code CLI sessions. Each agent has layer-specific rules, responsibility paths, and project constraints.

## Knowledge Graph (graphify)

This project has a knowledge graph at `graphify-out/`. Before exploring source code, always use:

```bash
graphify query "<question>"      # scoped subgraph — more useful than grep
graphify path "<A>" "<B>"        # relationship between two nodes
graphify explain "<concept>"     # deep dive into a specific concept
graphify update .                # refresh after code changes (no API cost)
```

Individual agents include this instruction. The dispatcher applies it in Step 0.

## Activation Mode

### Auto-dispatch (default mode)

Describe the task in natural language. Claude analyzes the content, identifies relevant agents, and applies them automatically. At the start of each response you will see:

```
> Agents: DomainAgent · ArchitectureGuardian
```

Examples of tasks that automatically activate agents:
```
I want to add a weekly summary of hours worked
the calendar component needs to show holidays
migrate Dexie schema to version 3
convert facade state to Angular Signals
write specs for the weekly hours use case
```

### Manual Override (when you want to force a specific agent)

Prefix your message with the agent name to bypass the dispatcher:

```
DomainAgent: review if this model makes sense before implementation
TestingAgent: write specs for the facade only, without touching other layers
```

## Agent Index

| Agent | File | Layer / Scope |
|-------|------|---------------|
| [DomainAgent](.claude/agents/domain-agent.md) | `domain-agent.md` | `src/app/**/domain/` |
| [DataAgent](.claude/agents/data-agent.md) | `data-agent.md` | `src/app/**/data/` |
| [FacadeAgent](.claude/agents/facade-agent.md) | `facade-agent.md` | `src/app/**/facade/` |
| [UIAgent](.claude/agents/ui-agent.md) | `ui-agent.md` | `src/app/**/presentation/` |
| [UXAgent](.claude/agents/ux-agent.md) | `ux-agent.md` | `src/app/**/presentation/` (UX + iOS) |
| [ArchitectureGuardian](.claude/agents/architecture-guardian.md) | `architecture-guardian.md` | Transversal |
| [SignalsAgent](.claude/agents/signals-agent.md) | `signals-agent.md` | Transversal (state) |
| [TestingAgent](.claude/agents/testing-agent.md) | `testing-agent.md` | Transversal (specs) |

## System Rules

- **Auto-dispatch activates multiple agents simultaneously** when the task requires it.
- Execution order follows the layers: Domain → Data → Facade → UI → Tests.
- `ArchitectureGuardian` is always active in silent mode — it only intervenes if it detects a layer violation in the code being written.
- The complete routing logic lives in `.claude/agents/_dispatcher.md`.
- **Non-trivial tasks require real subagents**: use the `Agent` tool to launch `Explore`/fork (codebase orientation) and `Plan` (architecture) in parallel before implementing. Reading agent `.md` files defines the rules; it does not replace delegating real work with subagents.
