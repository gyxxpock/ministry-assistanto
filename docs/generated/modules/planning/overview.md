---
doc_type: architecture-generated
module: planning
source_commit: e461526035a179d92b034f04ec05b2f3ed670980
generated_by: documentation-agent
status: draft
sources:
  - src/app/planning/**
  - graphify-out/GRAPH_REPORT.md
  - feature/Plan.md
---

# Module overview: planning

> Generated. Regenerate with `/docs module planning`. For AI-oriented retrieval
> content see [ai/planning/context.md](../../ai/planning/context.md); for the
> original feature write-up see [feature/Plan.md](../../../../feature/Plan.md)
> (informal precedent doc — link, not duplicated here).

## Structure

```
src/app/planning/
├── domain/
│   ├── models.ts                  # WeeklySchedule, DayPlan, MonthlyBar, PlanningProjection
│   ├── i-planning.repository.ts   # IPlanningRepository
│   └── planning.usecase.ts        # pure projection/plan math
├── data/
│   ├── planning.dexie.ts          # PlanningDB (Dexie schema)
│   └── dexie-planning.repository.ts  # DexiePlanningRepository
├── facade/
│   └── planning.facade.ts         # PlanningFacade
├── presentation/
│   ├── planning.module.ts         # PlanningModule (lazy, child of TimeEntryModule)
│   ├── utils/date-key.util.ts
│   └── components/
│       ├── planning/                    # PlanningComponent (page shell)
│       ├── weekly-schedule-editor/      # WeeklyScheduleEditorComponent — God Node
│       ├── planning-calendar/
│       ├── goal-summary-card/
│       ├── monthly-bar-chart/
│       └── day-override-panel/
└── planning.tokens.ts              # PLANNING_REPOSITORY_TOKEN
```

Every file above has a matching `*.spec.ts` (15/15) — see
[ai/planning/context.md § Test coverage summary](../../ai/planning/context.md#test-coverage-summary).

## Responsibilities per layer

- **Domain** — defines the weekly-schedule/day-override shapes and the pure
  math that turns a schedule + overrides + goal + actual hours into a
  `PlanningProjection` (`computePlanningProjection`, `computeDailyPlan`,
  `computeMonthlyPlanned`, `sumWeeklyHours`). No Angular, no Dexie.
- **Data** — `DexiePlanningRepository` implements `IPlanningRepository`
  against `PlanningDB` (Dexie/IndexedDB): a single `weeklySchedule` row,
  keyed `dayOverrides` by ISO date.
- **Facade** — `PlanningFacade` orchestrates the domain use cases against
  `IPlanningRepository`, `IGoalRepository` (from `goals`) and
  `ITimeEntryRepository` (from `time-entry`), exposing Signals
  (`weeklySchedule`, `dayOverrides`, `weeklyTotal`, `planningProjection`) to
  Presentation.
- **Presentation** — `PlanningModule` (lazy, child of `TimeEntryModule`'s
  routes — never top-level, see the Module-Level Navigation Shell lesson in
  `architecture-guardian.md`) and its 6 components: the page shell, the
  weekly-schedule editor, a monthly calendar, a goal-summary card, a monthly
  bar chart, and a day-override panel.

## God Nodes in this module

Per `graphify-out/GRAPH_REPORT.md` (built at commit
`04892f9378025e48d69e69f896ce3151cea05cd5`), two of the repo's top-10 God
Nodes live here:

| Node | Edges | Rank | Layer |
|------|-------|------|-------|
| `WeeklySchedule` | 23 | 9 | Domain |
| `WeeklyScheduleEditorComponent` | 21 | 10 | Presentation |

See [dependency-overview.md § God Nodes](../../architecture/dependency-overview.md#god-nodes)
for the cross-referenced version, and
[ai/planning/context.md § God Nodes / edges in scope](../../ai/planning/context.md#god-nodes--edges-in-scope)
for why neither is currently flagged for splitting.

## Related docs

- [feature/Plan.md](../../../../feature/Plan.md) — original feature write-up (precedent, not duplicated).
- [AI context: planning](../../ai/planning/context.md)
- [Dependency overview](../../architecture/dependency-overview.md)
