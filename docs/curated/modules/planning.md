---
doc_type: module-narrative
module: planning
status: draft
generated_by: human-docs-agent
sources:
  - docs/generated/modules/planning/overview.md
  - docs/generated/ai/planning/context.md
  - src/app/planning/domain/models.ts
  - src/app/planning/facade/planning.facade.ts
  - src/app/planning/presentation/components/planning/planning.component.ts
  - src/app/planning/presentation/components/weekly-schedule-editor/weekly-schedule-editor.component.ts
  - docs/generated/architecture/known-violations.md
  - .claude/agents/ui-agent.md
  - .claude/agents/signals-agent.md
---

# Module: planning

> This is the narrative companion to the `planning` row in
> [module-tour.md](../onboarding/module-tour.md). It explains *why* and *how it
> feels to use* — for the layer-by-layer structure and public API, see
> [Where to go next](#where-to-go-next), which already exists and is accurate;
> this page does not restate it.

## Purpose

`planning` is the module that turns "I have a 600-hour goal" into "here is how
many hours I need to log this week to actually hit it." Where `goals` only
evaluates a target against hours already logged, `planning` looks forward: the
user defines a recurring `WeeklySchedule` (a decimal-hours value per ISO weekday,
Monday through Sunday, deliberately independent of the user's `weekStart` display
preference — see Gotchas), optionally overrides specific dates with a `DayPlan`,
and the module projects whether that plan, if followed, would meet the active
`goals` target for the service year. It reads from both `goals` (the target) and
`time-entry` (the actuals) but owns neither — it is the reconciliation layer
between "what I intend" and "what I've done."

This makes `planning` the most cross-cutting of the three modules covered here:
its facade injects `PlanningFacade`'s own repository plus `IGoalRepository` and
`ITimeEntryRepository` from the other two feature modules, and its domain layer
imports pure functions from `goals/domain` (see the Gotcha below on the
domain→domain coupling `architecture-guardian` is watching). It is also the only
one of the three whose presentation layer follows a strict container/dumb-child
split by design: `PlanningComponent` is documented in its own source comment as
"the ONLY component that injects Facades... all other `planning/presentation/`
components are dumb (Inputs/Outputs only)" — a discipline worth preserving when
extending the module, since the generated overview's God Node analysis already
shows `WeeklyScheduleEditorComponent` at high fan-out.

## Key flows

**Building the weekly baseline.** The user opens the floating weekly-schedule
editor from `PlanningComponent` via `toggleEditor()`. `WeeklyScheduleEditorComponent`
is a "dumb" standalone panel — no facade injection — that emits a `scheduleChange`
event per edit; the shell's `onScheduleChange()` handler is what actually calls
`PlanningFacade.saveWeeklySchedule()`, which persists to `DexiePlanningRepository`
and updates the `weeklySchedule` signal that everything else (weekly total, daily
plan math, projection) derives from. A "reset to zero" action follows the same
path through `onResetRequested()`.

**Overriding a single day.** Selecting a date on the calendar
(`onDaySelected()`) surfaces `selectedDayInfo`, a computed signal that
deliberately resolves the *template* hours for that weekday (ignoring any
existing override) separately from any *existing* override's hours, so the
day-override panel can show "plan says 2h, you overrode it to 3h" rather than
collapsing the two. Confirming a value calls `onDayConfirm()` →
`PlanningFacade.setDayOverride()`; clearing it calls `onDayClear()` →
`clearDayOverride()`. Both re-fetch only the overrides (not the whole month).

**Checking the year against the goal.** `PlanningFacade.planningProjection`
combines the weekly schedule, the full-service-year overrides (`_periodOverrides`
— distinct from the visible month's `dayOverrides`), the active goal, and actual
hours per month into a `PlanningProjection` with a `monthlyBars` breakdown.
`PlanningComponent` surfaces this two ways: the `monthlyBars`-driven bar chart,
and a horizontal month-pill selector (`onMonthPillSelected()`) — both converge
on the same `navigateToMonth()`, which reloads `PlanningFacade` and
`TimeEntryFacade` for the newly selected month.

## Gotchas

- **The weekly-schedule editor is a floating panel — treat it per
  `ui-agent.md`'s "Conditional floating panels" trap.** `ui-agent.md` calls out
  that conditional floating UI must be `position: absolute` and constrained to
  the viewport, with a documented incident behind that rule. The editor's own
  source comment independently confirms it's implemented as exactly this kind
  of floating panel (with a two-step reset confirmation and an
  `onDocumentClick()` outside-tap handler) — if you touch its positioning,
  re-check that trap first.
- **`monthPillOptions` is a getter, not a `computed()` — on purpose.**
  `PlanningComponent`'s own comment explains why: it depends on
  `translate.currentLang`, which is not a Signal, so a `computed()` would not
  invalidate on a runtime language switch. This is the same
  Signals-vs-getter judgment call `signals-agent.md` flags generally
  ("evaluate whether everything can be Signals") — here the answer is
  deliberately no.
- **`planning/domain` imports from `goals/domain`, not the other way round.**
  `architecture-guardian`'s review (recorded in
  [known-violations.md](../../generated/architecture/known-violations.md))
  flags this as a domain→domain coupling worth monitoring so `goals/domain`
  doesn't become an unlabeled shared kernel. It is not a Rule-of-Gold violation,
  but it means a `goals/domain` change can silently change what `planning`
  projects — see the equivalent note on the `goals` module page.
- **`dayOverrides` vs the private period overrides are easy to conflate.**
  Per the generated AI context, `PlanningFacade.dayOverrides` only reflects the
  visible month; the full 12-month period total lives in a separate signal not
  exposed to Presentation. Reading the wrong one from a new component would
  silently under- or over-count the projection.

## Where to go next

- [Module overview: planning (generated)](../../generated/modules/planning/overview.md) —
  structure, per-layer responsibilities, God Nodes.
- [AI context: planning (generated)](../../generated/ai/planning/context.md) —
  full invariants list, public API surface, dependency direction.
- [feature/Plan.md](../../../feature/Plan.md) — the original, informal feature
  write-up (precedent doc; not duplicated here).
