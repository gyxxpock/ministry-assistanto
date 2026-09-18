---
doc_type: ai-context
module: planning
source_commit: e461526035a179d92b034f04ec05b2f3ed670980
generated_by: ai-docs-agent
status: draft
sources:
  - src/app/planning/domain/models.ts
  - src/app/planning/domain/i-planning.repository.ts
  - src/app/planning/domain/planning.usecase.ts
  - src/app/planning/facade/planning.facade.ts
  - src/app/planning/data/dexie-planning.repository.ts
  - src/app/planning/planning.tokens.ts
  - src/app/planning/presentation/planning.module.ts
  - graphify-out/graph.json
  - graphify-out/GRAPH_REPORT.md
---

# AI context: planning

## Purpose

The `planning` module lets a user define a recurring weekly work-hour schedule
(`WeeklySchedule`, one decimal-hours value per ISO weekday) plus per-date
overrides (`DayPlan`), then compares that plan against the active goal
(`goals` module) and the user's actual logged time (`time-entry` module) to
project whether the current service-year period will meet its target. It owns
no time-tracking data itself — it only plans and projects.

## Public API surface

- `WeeklySchedule` — `src/app/planning/domain/models.ts:6`
- `DayPlan` — `src/app/planning/domain/models.ts:21`
- `MonthlyBar` — `src/app/planning/domain/models.ts:27`
- `PlanningProjection` — `src/app/planning/domain/models.ts:43`
- `PlanningProjectionStatus` — `src/app/planning/domain/models.ts:40`
- `IPlanningRepository` — `src/app/planning/domain/i-planning.repository.ts:3`
- `PLANNING_REPOSITORY_TOKEN` — `src/app/planning/planning.tokens.ts:4`
- `computeDailyPlan()` — `src/app/planning/domain/planning.usecase.ts:64`
- `computeMonthlyPlanned()` — `src/app/planning/domain/planning.usecase.ts:77`
- `computePlanningProjection()` — `src/app/planning/domain/planning.usecase.ts:91`
- `sumWeeklyHours()` — `src/app/planning/domain/planning.usecase.ts:29`
- `PlanningFacade` — `src/app/planning/facade/planning.facade.ts:43`
- `DexiePlanningRepository` — `src/app/planning/data/dexie-planning.repository.ts:7`

## Key invariants

- `WeeklySchedule` keys (`mon`..`sun`) are fixed ISO weekdays and never depend
  on the user's `weekStart` UI setting; the date→key mapping is mathematically
  invariant to `weekStart` — `src/app/planning/domain/planning.usecase.ts:34-44`.
- `toIsoDate()` is intentionally duplicated from `time-entry`'s equivalent
  because domain code must never import from presentation — do not
  consolidate the two without moving one to a shared domain location —
  `src/app/planning/domain/planning.usecase.ts:17-18`.
- A `DayPlan` override for a date always takes precedence over the matching
  `WeeklySchedule` weekday value — `src/app/planning/domain/planning.usecase.ts:70-74`.
- `DexiePlanningRepository.saveWeeklySchedule()` clears and re-inserts inside
  one `rw` transaction — only one `WeeklySchedule` row ever exists —
  `src/app/planning/data/dexie-planning.repository.ts:21-25`.
- `PlanningModule` is lazy and a child of `TimeEntryModule`'s routes; it must
  never be registered top-level, and it relies on `TimeEntryFacade`/
  `TIME_ENTRY_REPOSITORY` being inherited from the parent injector rather than
  re-providing them — `src/app/planning/presentation/planning.module.ts:35-40`.
  This mirrors the Goals module-shell incident recorded in
  `.claude/agents/architecture-guardian.md` (Module-Level Navigation Shell
  lesson).
- `PlanningFacade.dayOverrides` reflects only the visible-month range; the
  12-month period total lives in the separate private `_periodOverrides`
  signal — do not conflate the two when reading facade state —
  `src/app/planning/facade/planning.facade.ts:50-52,74`.

## Dependencies

Upstream (planning imports from): `goals/domain` (`Goal`, `GoalConfig`,
`REGULAR_GOAL_TARGET`, `REGULAR_GOAL_MARGIN`, `getServiceYear`,
`isActiveMonth`), `time-entry/domain` (`TimeEntry`, `ITimeEntryRepository`),
`time-entry/presentation/tokens` (`TIME_ENTRY_REPOSITORY` — a presentation-layer
token consumed by planning's facade), `shared/domain` (`WeekDay`),
`core/services/week-start.service.ts` (`WeekStartService`).

Downstream (imports planning): only `PlanningModule`'s own presentation
components (`planning.component.ts`, `weekly-schedule-editor.component.ts`,
`planning-calendar.component.ts`) and their specs — per the current
`graphify query "planning module structure and responsibilities"` result, no
other feature module imports planning's facade or domain symbols.

Confirm with `graphify path "PlanningFacade" "GoalsFacade"` before assuming
this list is exhaustive; it will drift as the module grows.

## God Nodes / edges in scope

Two of the repository's top-10 God Nodes (per `graphify-out/GRAPH_REPORT.md`,
built at commit `04892f9378025e48d69e69f896ce3151cea05cd5`) live in this
module:

- `WeeklySchedule` (`src/app/planning/domain/models.ts:6`) — 23 edges, rank 9.
  High fan-in is expected: it is the one shared shape read/written across
  domain, data, facade and all presentation components that touch a weekly
  plan. Not flagged for splitting.
- `WeeklyScheduleEditorComponent` (`src/app/planning/presentation/components/weekly-schedule-editor/weekly-schedule-editor.component.ts:53`)
  — 21 edges, rank 10. High fan-out to its own methods (`columns()`,
  `onRangeChange()`, `formatHours()`, `onResetRequest/Confirm/Cancel()`,
  `onClose()`, `onDocumentClick()`) — a single editor component doing range
  editing, formatting and a two-step reset confirmation. A future UI split
  (e.g. extracting the reset-confirmation as its own component) would reduce
  this, but no violation is currently flagged by `architecture-guardian`.

See [dependency-overview.md](../../architecture/dependency-overview.md) for
the cross-referenced God Nodes table.

## Test coverage summary

15 source files, 15 matching `*.spec.ts` files (1:1) under `src/app/planning/`
as of `source_commit` — every domain, data, facade and presentation file has
a spec. This satisfies `testing-agent`'s per-layer mandate at the file level;
it does not by itself confirm branch/statement coverage percentage — run the
project's coverage command for that number before relying on it.

## source_commit

`e461526035a179d92b034f04ec05b2f3ed670980`
