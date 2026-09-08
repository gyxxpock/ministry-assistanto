# Dispatcher — Agent Auto-Dispatch

This file defines the routing logic that Claude executes automatically before
responding to any task. It is not invoked by the user; it is read by Claude at the
start of each response.

---

## Step 0 — Orient with graphify

If `graphify-out/graph.json` exists, run **before** analyzing the task:

```bash
graphify query "<question about the task>"
```

This returns a scoped subgraph, more useful and smaller than reading raw files. Only
read source directly to modify specific lines or when graphify does not surface enough context.

**Subagents**: every prompt involving code exploration must include:
> `graphify-out/graph.json` exists. Run `graphify query "<question>"` before reading
> raw source files. Only read raw after graphify has oriented you.

---

## Step 1 — Analyze the task

Read the user's message and identify:
- Which project layers are involved? (Domain, Data, Facade, Presentation)
- Is this a single-layer task or does it cross multiple layers?
- Are there keywords pointing to specific agents?

---

## Step 2 — Apply the routing matrix

Activate **all** agents whose signals are present. When in doubt, activate more
agents, not fewer. ArchitectureGuardian is always active in silent mode.

| Signals detected in the task | Agents to activate |
|-------------------------------|-------------------|
| "entity", "model", "use case", "business rule", "ITimeEntryRepository", "TimeEntry", "CourseVisit" | **DomainAgent** |
| "Dexie", "IndexedDB", "repository", "persistence", "migration", "schema", "DexieTimeEntryRepository" | **DataAgent** |
| "facade", "state", "orchestration", "expose to component", "import", "export", "BehaviorSubject", "loadMonth" | **FacadeAgent** |
| "component", "template", "SCSS", "style", "view", "screen", "UI", "Material", "Angular Material", "ViewModel", "TimeEntryVM" | **UIAgent** |
| "UX", "user experience", "interaction", "visible", "scroll", "confirmation", "alert", "animation", "iOS", "liquid glass", "accessibility", "touch", "mobile", "toast", "visual feedback" | **UXAgent** (activate alongside UIAgent) |
| "signal", "computed", "effect", "reactive", "migrate RxJS", "signals", "reactive state" | **SignalsAgent** |
| "test", "spec", "coverage", "jasmine", "karma", "*.spec.ts" | **TestingAgent** |
| Any implementation task (new feature, new component, new service, bug fix with logic) | **TestingAgent** (always active alongside layer agents) |
| "review layer", "violation", "Clean Architecture", "imports from", "does this class belong?" | **ArchitectureGuardian** (exclusive) |

### Full-feature rule
If the task describes **new functionality** involving business logic + data +
UI (words like "I want", "I need to add", "new feature", "new module"), activate:
→ DomainAgent + DataAgent + FacadeAgent + UIAgent + ArchitectureGuardian + TestingAgent

### ArchitectureGuardian — permanent silent mode
Active on all tasks. Only intervenes (interrupts the response) if it detects
a layer violation in code you are about to write or review. Does not produce
its own output when there are no violations.

---

## Step 3 — Read the active agents' files

For each identified agent, read its file before generating the response:

```
DomainAgent       → .claude/agents/domain-agent.md
DataAgent         → .claude/agents/data-agent.md
FacadeAgent       → .claude/agents/facade-agent.md
UIAgent           → .claude/agents/ui-agent.md
UXAgent           → .claude/agents/ux-agent.md
ArchitectureGuardian → .claude/agents/architecture-guardian.md
SignalsAgent      → .claude/agents/signals-agent.md
TestingAgent      → .claude/agents/testing-agent.md
```

---

## Step 4 — Announce and respond

**For non-trivial tasks**: launch subagents (`Agent` tool) for exploration and
planning before responding with code. The agent announcement goes first;
subagents are launched in parallel immediately after.

**Post-Plan — delegate implementation with forks, do not write code directly**:
after receiving the Plan agent output, the main agent does NOT touch an editor. Launch
parallel forks (one per significant file), briefing each fork with the relevant part of
the plan and the rules of the applicable layer agent. The main agent reviews
the outputs, runs tests, and approves. This rule applies even if the plan seems simple
if it produced diffs for ≥2 files or includes specs.

At the start of the response, include a brief announcement line:

```
> Agents: DomainAgent · FacadeAgent · ArchitectureGuardian
```

If only ArchitectureGuardian is active in silent mode (no layer agents), omit
the announcement. Then respond applying the combined rules of all active agents.

---

## Step 5 — Execution order for multi-layer tasks

When several agents are active, execute in layer dependency order:

1. **DomainAgent** — model first (entities, interfaces, use cases)
2. **DataAgent** — implement persistence on top of what was modeled
3. **FacadeAgent** — orchestrate using what Domain and Data define
4. **UIAgent** — build the UI that consumes the Facade
5. **TestingAgent** — write specs for all touched layers
6. **SignalsAgent** — apply if there is new state to model with Signals

---

## Manual override

If the user's message starts with an agent name followed by a colon
(e.g. `DomainAgent: ...`), ignore this dispatcher and activate only that agent.
