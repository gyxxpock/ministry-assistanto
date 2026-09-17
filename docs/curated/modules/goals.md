---
doc_type: module-narrative
module: goals
status: draft
generated_by: human-docs-agent
sources:
  - src/app/goals/domain/models.ts
  - src/app/goals/domain/goal.usecase.ts
  - src/app/goals/domain/i-goal.repository.ts
  - src/app/goals/facade/goals.facade.ts
  - src/app/goals/data/dexie-goal.repository.ts
  - src/app/goals/presentation/goals.module.ts
  - src/app/goals/presentation/components/goals/goals.component.ts
  - src/app/goals/presentation/components/goal-config/goal-config.component.ts
  - src/app/goals/presentation/components/goal-progress-visual/goal-progress-visual.component.ts
  - src/app/goals/presentation/components/goal-status-badge/goal-status-badge.component.ts
  - docs/generated/architecture/known-violations.md
  - .claude/agents/architecture-guardian.md
  - .claude/agents/ui-agent.md
  - .claude/agents/facade-agent.md
---

# Module: goals

> This is the narrative companion to the `goals` row in
> [module-tour.md](../onboarding/module-tour.md). It explains *why* and *how it
> feels to use* — for the layer-by-layer structure and public API, see
> [Where to go next](#where-to-go-next) below.

## Purpose

`goals` exists so a publisher (in the Jehovah's Witnesses ministry-hours sense —
"pioneer" terminology shows up directly in the domain, e.g. `startMonth` comments)
can declare a yearly ministry-hour target once and then see, at any moment,
whether their actual logged time is on track to hit it. It is deliberately a thin,
single-purpose module: it owns exactly one piece of state — the currently active
`GoalConfig` — and one derived computation — `GoalProgress`. It does not log time
itself (that is `time-entry`'s job) and it does not plan future hours (that is
`planning`'s job); it only *evaluates* a target against a service year that runs
September-to-August, per `ServiceYear` in `src/app/goals/domain/models.ts`.

The module supports two goal shapes that mirror real Watchtower/JW service
categories: `RegularGoalConfig` (a flat 600-hour annual target, margin 560) and
`AuxiliaryGoalConfig` (a 15 or 30 hour *monthly* target, optionally scoped to a
permanent commitment or a specific month range that can wrap the calendar year,
e.g. November→March). `goal.usecase.ts` is where that domain nuance lives —
`computeRegularGoalProgress` and `computeAuxiliaryGoalProgress` are pure functions
with no Angular or Dexie dependency, which is what lets `planning` safely import
`getServiceYear`/`isActiveMonth` from this module's domain without dragging in any
infrastructure (see Gotchas below).

Architecturally, `goals` is the smallest complete four-layer module in the app
(`domain/`, `data/`, `facade/`, `presentation/` — see
[Architecture overview](../architecture/overview.md) for why the layers are
ordered this way at all). It is lazy-loaded as a route *inside* `time-entry`'s
navigation shell rather than as a sibling app-level route — a structural choice
covered in Gotchas, not repeated here.

## Key flows

**Setting up a goal.** From the goals page (`GoalsComponent`), the user taps to
open `GoalConfigComponent` in a Material dialog. The dialog is a self-contained
reactive form: picking "regular" vs "auxiliary" via `onTypeChange()` swaps which
fields are required (a regular goal needs a `startMonth`; an auxiliary one needs
`monthlyTarget` plus, if not `permanent`, a `startMonth`/`endMonth` range validated
by `monthRangeValidator`). Submitting calls `onSubmit()`, which builds a `Goal`
object and closes the dialog — the dialog itself never touches the repository.
`GoalsComponent.openGoalConfig()` is the one that receives the closed dialog's
result and calls `facade.setGoal(goal)`, which persists via `IGoalRepository`
and immediately recomputes accumulated hours.

**Checking progress.** On `ngOnInit()`, `GoalsComponent` calls
`facade.loadGoal()`, which reads the active `GoalConfig` from
`DexieGoalRepository`, then privately queries `ITimeEntryRepository` (injected
cross-module — see Gotchas) for every time entry inside the current service
year to sum `accumulatedHours`, plus a second, narrower sum for the current
calendar month (`monthlyAccumulated`). The `goalProgress` computed signal turns
that into a `GoalProgress` (status, projected year-end hours, monthly
percentage), which `GoalProgressVisualComponent` renders as a progress circle
and `GoalStatusBadgeComponent` renders as an on-track/behind/out-of-margin
badge — the badge's three states map directly to `computeStatus()`'s
600/560-hour margin math in `goal.usecase.ts`.

**Clearing a goal.** `clearActiveGoal()` opens a plain confirmation dialog
(`ConfirmClearDialog`); on confirm, `facade.clearGoal()` wipes the active row
from `GoalsDB` and resets `accumulatedHours` to zero. There is no "are you
sure, this can't be undone" beyond that one dialog — clearing is immediate and
does not archive the prior configuration.

## Gotchas

- **Never make this a sibling app-level route.** `goals` was the module involved
  in the 2026-09-08 navigation incident documented in
  `.claude/agents/architecture-guardian.md` ("Module-Level Navigation Shell")
  and `.claude/agents/ui-agent.md` ("Navigation & Module Architecture"): a goals
  route declared outside `TimeEntryModule` renders with no floating nav/header,
  because `Layout` (the shell with the scroll-aware header and nav) is owned by
  `TimeEntryModule` and only reachable by child routes. `goals.module.ts` is
  correctly wired today (`time-entry.module.ts` loads it as a `'goals'` child
  route) — the trap is for whoever adds the *next* goals-adjacent route.
- **Cross-module DI bridging is sanctioned here, but easy to mistake for a
  violation.** `goals.facade.ts:7` injects `TIME_ENTRY_REPOSITORY` directly
  (not through some `goals`-owned abstraction), and `goals.module.ts` provides
  it via `useClass: DexieTimeEntryRepository`. `architecture-guardian` has
  reviewed this as an intentional, sanctioned pattern (see the "Awareness" notes
  in [known-violations.md](../../generated/architecture/known-violations.md)),
  not a layer-direction bug — but it does mean `goals` silently breaks if
  `time-entry`'s repository contract changes shape.
- **`goals/domain` is becoming a quiet shared kernel.** The same
  `known-violations.md` pass flags that `planning/domain/planning.usecase.ts`
  imports `getServiceYear`, `isActiveMonth`, `REGULAR_GOAL_TARGET`, and
  `REGULAR_GOAL_MARGIN` straight from `goals/domain`. That's domain→domain
  (inward, not a Rule-of-Gold violation), but it means a change to
  `goal.usecase.ts`'s service-year math changes `planning`'s projections too —
  check `graphify path "goal.usecase.ts" "planning.usecase.ts"` before editing.
- **`GoalsFacade.refreshProgress()` and `setAccumulatedHours()` currently have no
  callers outside the facade itself and its spec.** They read like
  half-finished integration points (likely for a future
  live-refresh-on-new-entry flow). Don't assume they're wired into any current
  UI path — confirm with a fresh `graphify query` before relying on them.
- **The config dialog never persists.** `GoalConfigComponent.onSubmit()` only
  builds a `Goal` and calls `dialogRef.close(goal)` — if you're debugging "why
  didn't my goal save," the answer is always in the caller
  (`GoalsComponent.openGoalConfig()`'s `afterClosed()` subscription), not the
  dialog component.

## Where to go next

- Generated structural overview and AI-context for this module have not been
  generated yet — run `/docs feature goals` to produce
  `docs/generated/modules/goals/overview.md` and
  `docs/generated/ai/goals/context.md`.
- [Known violations (generated)](../../generated/architecture/known-violations.md) —
  no open violation entries for `goals` as of the last pass; the module is
  mentioned only in the "Awareness" notes cited above.
- [feature/Goals.md](../../../feature/Goals.md) — the original, informal
  feature write-up (precedent doc; not duplicated here).
