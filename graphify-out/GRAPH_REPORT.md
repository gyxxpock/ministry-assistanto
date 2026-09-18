# Graph Report - ministry-assistanto  (2026-09-18)

## Corpus Check
- 219 files · ~89,445 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1413 nodes · 2434 edges · 125 communities (104 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aeade5cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- goal.usecase.ts
- PlanningComponent
- options
- package.json
- dependencies
- devDependencies
- DurationWheelPickerComponent
- @ngx-translate/core
- CLEAN Architecture Pattern
- ThemeService
- TimeEntryListComponent
- TimeEntryVM
- check-pr.js
- ISyncService
- Time Entry List View
- check-i18n.js
- What You Must Do When Invoked
- scripts/verify-pr.js
- Time Entry Form Template
- .github/scripts/verify-pr.js
- App Router Outlet
- scripts
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- CLAUDE.md
- DexieTimeEntryRepository
- extraction-spec.md
- Coverage mandate
- SignalsAgent
- ArchitectureGuardian
- DomainAgent
- FacadeAgent
- UIAgent
- Workflow: full human-facing site (`/docs site`)
- DataAgent
- time-entry-calendar.ts
- WeeklyScheduleEditorComponent
- UXAgent
- Full flow
- Session flow
- issues.sh
- prettier
- schematics
- pr.sh
- planning.component.spec.ts
- WeeklySchedule
- app-module.ts
- TimeEntry
- time-entry.facade.ts
- goals/domain/models.ts
- @angular/core
- GoalConfigComponent
- GoalConfig
- ngsw-config.json
- MonthlyBarChartComponent
- Module: goals
- layout.spec.ts
- update-notification.service.ts
- BackupReminderService
- TimeEntryFormComponent
- check-coverage.sh
- karma.conf.js
- planning.facade.ts
- DayOverridePanelComponent
- properties
- Module: planning
- settings.component.ts
- Module: time-entry
- planning.usecase.ts
- ADR-0002: Granularidad de prorrateo mensual vs. diario en el cálculo de progreso de metas (goal progress)
- ministry-assistanto
- planning.facade.spec.ts
- production
- development
- angular.json
- ai-context.schema.json
- GoalSummaryCardComponent
- DurationWheelPickerStub
- GoalProgressVisualComponent
- What You Must Do When Invoked
- ADR-NNNN: <short title, imperative mood>
- AI context: <module-name>
- Responsibilities
- Module overview: planning
- TimeEntryFacade
- app-routing-module.ts
- index.md
- The 6 checks
- goals.module.ts
- Getting started
- Workflow: AI context generation (`/docs ai-context <module|--all>`)
- AI context: planning
- latest.md
- Ministry Assistanto — Documentation
- AIDocsAgent
- DocumentationAgent
- HumanDocsAgent
- ArchitectureDocAgent
- CompodocAgent
- Workflow: new ADR (`/docs adr "<title>"`)
- AGENTS — Ministry Assistanto
- Workflow: documenting architecture (`/docs architecture`)
- Workflow: documenting a feature (`/docs feature <module>`)
- graphify integration (Step 1 for every subcommand)
- Workflow: onboarding docs (`/docs onboarding`)
- Workflow: generated module overview (`/docs module <module>`)
- Workflow: release documentation prep (`/docs release`)
- Architecture overview
- Dependency overview (generated)
- Feature lifecycle
- I18nDateStub
- SettingsComponent
- Known violations (generated)
- TranslateStub
- check-staleness.sh
- resolve-moved-path.sh

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 65 edges
2. `TimeEntry` - 43 edges
3. `@ngx-translate/core` - 39 edges
4. `CourseVisit` - 36 edges
5. `TimeEntryFacade` - 29 edges
6. `ITimeEntryRepository` - 28 edges
7. `DexieTimeEntryRepository` - 25 edges
8. `GoalConfig` - 23 edges
9. `WeeklySchedule` - 23 edges
10. `WeeklyScheduleEditorComponent` - 21 edges

## Surprising Connections (you probably didn't know these)
- `MinistryAssistanto App` --conceptually_related_to--> `CLEAN Architecture Pattern`  [INFERRED]
  README.md → .github/copilot-instructions.md
- `Totals Dashboard (Hours + Courses)` --conceptually_related_to--> `Unique Course Counting Business Rule`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-list/time-entry-list.component.html → .github/copilot-instructions.md
- `Time Entry Form Template` --conceptually_related_to--> `Angular Signals`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-form/time-entry-form.component.html → .github/copilot-instructions.md
- `i18n Runtime Implementation PR` --semantically_similar_to--> `i18n PR Changes Summary`  [INFERRED] [semantically similar]
  .github/PULL_REQUEST_TEMPLATE_PR_BODY.md → .github/pr-comments/i18n-summary.md
- `Layout` --references--> `BackupReminderService`  [EXTRACTED]
  src/app/time-entry/presentation/components/layout/layout.ts → src/app/core/services/backup-reminder.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CLEAN Architecture Layers** — _github_copilot_instructions_presentation_layer, _github_copilot_instructions_facade_layer, _github_copilot_instructions_domain_layer, _github_copilot_instructions_data_layer [EXTRACTED 1.00]
- **Time Entry UI Component Flow** — src_app_time_entry_presentation_components_layout_layout_floating_nav, src_app_time_entry_presentation_components_time_entry_list_time_entry_list_component_list, src_app_time_entry_presentation_components_time_entry_day_time_entry_day_component_day_group, src_app_time_entry_presentation_components_time_entry_edit_time_entry_edit_dialog_component_dialog, src_app_time_entry_presentation_components_time_entry_form_time_entry_form_component_form [INFERRED 0.95]

## Communities (125 total, 17 thin omitted)

### Community 0 - "goal.usecase.ts"
Cohesion: 0.22
Nodes (18): buildServiceYearFromYear(), computeAuxiliaryGoalProgress(), computeGoalProgress(), computeMonthlyTarget(), computeRegularGoalProgress(), computeRegularMonthlyTarget(), computeStatus(), countActiveMonths() (+10 more)

### Community 1 - "PlanningComponent"
Cohesion: 0.09
Nodes (7): PlanningCalendarComponent, Component, Input, Output, PlanningComponent, Component, toDateKey()

### Community 2 - "options"
Cohesion: 0.22
Nodes (13): options, assets, browser, codeCoverage, index, inlineStyleLanguage, karmaConfig, polyfills (+5 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, version, @angular/animations, @angular/build, @angular/cdk, @angular/cli, angular-cli-ghpages (+15 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @angular/animations, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material (+9 more)

### Community 5 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, @angular/build, @angular/cli, angular-cli-ghpages, @angular/compiler-cli, @compodoc/compodoc, jasmine-core, karma (+6 more)

### Community 6 - "DurationWheelPickerComponent"
Cohesion: 0.21
Nodes (3): DurationWheelPickerComponent, Component, ViewChild

### Community 7 - "@ngx-translate/core"
Cohesion: 0.15
Nodes (9): @ngx-translate/core, I18nDatePipe, Pipe, GoalStatus, GoalType, GoalStatusBadgeComponent, Component, Input (+1 more)

### Community 8 - "CLEAN Architecture Pattern"
Cohesion: 0.16
Nodes (14): CLEAN Architecture Pattern, Data Layer, Domain Layer, Facade Layer, Internationalization Convention, ngx-translate i18n Library, Presentation Layer, i18n PR Changes Summary (+6 more)

### Community 9 - "ThemeService"
Cohesion: 0.18
Nodes (7): MODE_CYCLE, ResolvedTheme, configureTestBed(), makeMockMql(), ThemeMode, ThemeService, Injectable

### Community 11 - "TimeEntryVM"
Cohesion: 0.11
Nodes (14): TimeEntryType, CreateTimeEntryVM, TimeEntryTypeVM, TimeEntryVM, UpdateTimeEntryVM, I18nDateStub, Pipe, TimeEntryDayComponent (+6 more)

### Community 12 - "check-pr.js"
Cohesion: 0.25
Nodes (7): categoryLabels, errors, fs, hasCategory, labels, path, payload

### Community 14 - "Time Entry List View"
Cohesion: 0.33
Nodes (6): Unique Course Counting Business Rule, Floating Bottom Navigation, Time Entry Calendar View, Day Entry Group Display, Time Entry List View, Totals Dashboard (Hours + Courses)

### Community 15 - "check-i18n.js"
Cohesion: 0.47
Nodes (5): collectKeys(), fs, main(), path, readJson()

### Community 16 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 17 - "scripts/verify-pr.js"
Cohesion: 0.50
Nodes (4): fetch, fs, main(), path

### Community 18 - "Time Entry Form Template"
Cohesion: 0.67
Nodes (3): Angular Signals, Time Entry Edit/Create Dialog, Time Entry Form Template

### Community 21 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, build:gh, deploy, docs:compodoc, docs:site:build, docs:site:serve, i18n:check (+4 more)

### Community 22 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 23 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 24 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 25 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 26 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 29 - "CLAUDE.md"
Cohesion: 0.20
Nodes (9): Agent Orchestration, Arquitecture Rules (Clean Architecture), Documentation, graphify, Knowledge Graph Integration, Layer Dependency Rules:, Modes: light / dark / system, Role tokens (defined once in `_tokens.scss`) (+1 more)

### Community 30 - "DexieTimeEntryRepository"
Cohesion: 0.12
Nodes (4): DexieTimeEntryRepository, TimeEntryDB, Injectable, Optional

### Community 32 - "Coverage mandate"
Cohesion: 0.12
Nodes (15): Conventions, Coverage mandate, Data — integration tests with real Dexie (unique DB name per test), Domain — pure tests, no Angular TestBed, Enforcement flow, Existing spec files, Facade — mock ITimeEntryRepository, Mock conventions for this project (+7 more)

### Community 33 - "SignalsAgent"
Cohesion: 0.18
Nodes (9): Current project state, Pattern: preferences service with Signals + localStorage, Patterns for this project, Recommended migration order, Restrictions, Signals vs RxJS — decision rule, SignalsAgent, Warning signs (+1 more)

### Community 34 - "ArchitectureGuardian"
Cohesion: 0.15
Nodes (12): ArchitectureGuardian, Correct structure, DI scope restriction: root vs module-scoped, How to detect violations, Intervention rules, Known violations (pending correction), Module-Level Navigation Shell (Lesson from 2026-09-08), Red flags (+4 more)

### Community 35 - "DomainAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, DomainAgent, Project conventions, Responsibilities, Scope, Warning signals

### Community 36 - "FacadeAgent"
Cohesion: 0.25
Nodes (7): Absolute restrictions, Current state and technical debt, FacadeAgent, Path toward Signals, Responsibilities, Scope, Warning signals

### Community 37 - "UIAgent"
Cohesion: 0.12
Nodes (15): 1. `| date:` does not respond to language at runtime, 2. Flex items with long text require `min-width: 0`, 3. Conditional floating panels must be `position: absolute` + constrained to viewport, Absolute restrictions, Common traps (learned from production bugs), ✅ CORRECT PATTERN, Navigation Button Requirements, Navigation & Module Architecture (+7 more)

### Community 38 - "Workflow: full human-facing site (`/docs site`)"
Cohesion: 0.29
Nodes (6): Build ordering — do not reorder steps 6 and 7, Idempotency, Mermaid rendering requires a custom fence, not just the plugin, Steps, What this workflow does NOT do, Workflow: full human-facing site (`/docs site`)

### Community 39 - "DataAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, DataAgent, Dexie patterns in this project, Responsibilities, Scope, Warning signals

### Community 40 - "time-entry-calendar.ts"
Cohesion: 0.18
Nodes (4): CalendarDay, TimeEntryCalendarComponent, Component, toDateKey()

### Community 41 - "WeeklyScheduleEditorComponent"
Cohesion: 0.10
Nodes (7): keyForJsDow(), Component, HostListener, Input, Output, ViewChild, WeeklyScheduleEditorComponent

### Community 42 - "UXAgent"
Cohesion: 0.15
Nodes (12): Change types, Changelog convention (`public/assets/changelog.json`), Format, Guiding principles, Integration with UIAgent, iOS-first interaction, Liquid Glass (Apple visionOS / iOS 26+), Responsibilities (+4 more)

### Community 43 - "Full flow"
Cohesion: 0.18
Nodes (10): 1. Verify state, 2. Push, 3. Build PR title and body, 4. Create PR, 5. Show URL, Full flow, Pre-flight checks, Rules (+2 more)

### Community 44 - "Session flow"
Cohesion: 0.13
Nodes (14): 1. Start — list and choose, 2. Start an issue, 3. Implement and iterate, 4. Verify acceptance criteria, 5. Document in the issue, 6. Confirm with the user and close, Available labels, Body format (bug) (+6 more)

### Community 46 - "prettier"
Cohesion: 0.50
Nodes (4): prettier, overrides, printWidth, singleQuote

### Community 47 - "schematics"
Cohesion: 0.25
Nodes (8): schematics, standalone, style, standalone, standalone, @schematics/angular:component, @schematics/angular:directive, @schematics/angular:pipe

### Community 49 - "planning.component.spec.ts"
Cohesion: 0.14
Nodes (6): OptionPillGroupComponent, PillOption, TEST_OPTIONS, Component, Input, Output

### Community 50 - "WeeklySchedule"
Cohesion: 0.14
Nodes (11): DexiePlanningRepository, Injectable, Optional, DayPlanRecord, PlanningDB, WeeklyScheduleRecord, IPlanningRepository, DayPlan (+3 more)

### Community 51 - "app-module.ts"
Cohesion: 0.23
Nodes (6): @angular/platform-browser, @ngx-translate/http-loader, App, AppModule, NgModule, Component

### Community 52 - "TimeEntry"
Cohesion: 0.10
Nodes (5): InMemoryTimeEntryRepository, CourseVisit, MonthlyCourseCount, TimeEntry, InMemoryRepository

### Community 53 - "time-entry.facade.ts"
Cohesion: 0.32
Nodes (8): Person, computeMonthlyTotals(), inMonth(), mergeTimeEntry(), MonthlyTotals, normalizeName(), toDateKey(), toKey()

### Community 54 - "goals/domain/models.ts"
Cohesion: 0.25
Nodes (6): Goal, GoalProgress, GoalsFacade, Injectable, DialogData, MonthOption

### Community 55 - "@angular/core"
Cohesion: 0.11
Nodes (21): @angular/common, @angular/core, @angular/forms, rxjs, PlanningCalendarDay, ISO_WEEKDAY_KEYS, ZERO_SCHEDULE, PlanningModule (+13 more)

### Community 57 - "GoalConfig"
Cohesion: 0.18
Nodes (7): DexieGoalRepository, Injectable, Optional, ActiveGoalRecord, GoalsDB, IGoalRepository, GoalConfig

### Community 58 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 59 - "MonthlyBarChartComponent"
Cohesion: 0.18
Nodes (6): MonthlyBar, BarColumn, MonthlyBarChartComponent, Component, Input, Output

### Community 60 - "Module: goals"
Cohesion: 0.40
Nodes (5): Gotchas, Key flows, Module: goals, Purpose, Where to go next

### Community 61 - "layout.spec.ts"
Cohesion: 0.21
Nodes (5): FileUtilService, Injectable, TimeEntryExporter, toCSV(), Injectable

### Community 62 - "update-notification.service.ts"
Cohesion: 0.08
Nodes (15): @angular/service-worker, ChangelogEntry, ChangeEntry, ChangelogEntry, Injectable, UpdateNotificationService, Layout, Component (+7 more)

### Community 63 - "BackupReminderService"
Cohesion: 0.12
Nodes (9): BackupReminderFrequency, BackupReminderService, DAYS, Injectable, BackupReminderBannerComponent, TranslateStub, Pipe, Component (+1 more)

### Community 64 - "TimeEntryFormComponent"
Cohesion: 0.24
Nodes (4): TimeEntryFormComponent, Component, Input, Output

### Community 67 - "planning.facade.ts"
Cohesion: 0.18
Nodes (8): getServiceYear(), toIsoDate(), buildActualByMonth(), firstAndLastOfMonth(), PlanningFacade, round2(), Injectable, ZERO_SCHEDULE

### Community 68 - "DayOverridePanelComponent"
Cohesion: 0.20
Nodes (5): DayOverridePanelComponent, Component, HostListener, Input, Output

### Community 69 - "properties"
Cohesion: 0.05
Nodes (39): additionalProperties, properties, required, type, description, type, format, type (+31 more)

### Community 72 - "Module: planning"
Cohesion: 0.40
Nodes (5): Gotchas, Key flows, Module: planning, Purpose, Where to go next

### Community 73 - "settings.component.ts"
Cohesion: 0.19
Nodes (7): isWeekDay(), Injectable, VALID_WEEK_DAYS, WEEK_DAY_INDEX, WeekStartService, WeekDay, today

### Community 74 - "Module: time-entry"
Cohesion: 0.40
Nodes (5): Gotchas, Key flows, Module: time-entry, Purpose, Where to go next

### Community 75 - "planning.usecase.ts"
Cohesion: 0.13
Nodes (14): REGULAR_GOAL_MARGIN, REGULAR_GOAL_TARGET, ServiceYear, PlanningProjectionStatus, computeDailyPlan(), computeMonthlyPlanned(), computePlanningProjection(), daysInMonth() (+6 more)

### Community 76 - "ADR-0002: Granularidad de prorrateo mensual vs. diario en el cálculo de progreso de metas (goal progress)"
Cohesion: 0.25
Nodes (7): ADR-0002: Granularidad de prorrateo mensual vs. diario en el cálculo de progreso de metas (goal progress), Alternatives considered, Consequences, Context, Decision, Implementation, Status

### Community 77 - "ministry-assistanto"
Cohesion: 0.20
Nodes (10): extract-i18n, test, builder, architect, prefix, projectType, root, sourceRoot (+2 more)

### Community 79 - "production"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, outputHashing (+1 more)

### Community 80 - "development"
Cohesion: 0.22
Nodes (9): serve, development, buildTarget, extractLicenses, optimization, sourceMap, builder, configurations (+1 more)

### Community 81 - "angular.json"
Cohesion: 0.29
Nodes (6): cli, analytics, newProjectRoot, projects, $schema, version

### Community 82 - "ai-context.schema.json"
Cohesion: 0.06
Nodes (38): items, type, description, items, type, $id, properties, required (+30 more)

### Community 83 - "GoalSummaryCardComponent"
Cohesion: 0.15
Nodes (4): @angular/router, GoalSummaryCardComponent, Component, Input

### Community 84 - "DurationWheelPickerStub"
Cohesion: 0.22
Nodes (3): DurationWheelPickerStub, MatSelectStub, Component

### Community 85 - "GoalProgressVisualComponent"
Cohesion: 0.33
Nodes (3): GoalProgressVisualComponent, Component, Input

### Community 86 - "What You Must Do When Invoked"
Cohesion: 0.14
Nodes (13): /docs, References, Rules, Step 0 — Parse subcommand and scope, Step 1 — Mandatory graphify orientation, Step 2 — Check the manifest before regenerating, Step 3 — Dispatch specialists, Step 4 — Update the manifest (+5 more)

### Community 87 - "ADR-NNNN: <short title, imperative mood>"
Cohesion: 0.14
Nodes (12): ADR-NNNN: <short title, imperative mood>, Alternatives considered, Consequences, Context, Decision, Status, ADR-0001: Record architecture decisions, Alternatives considered (+4 more)

### Community 88 - "AI context: <module-name>"
Cohesion: 0.15
Nodes (11): Cross-module invariants, Example entry, Format, AI context: <module-name>, Dependencies, God Nodes / edges in scope, Key invariants, Public API surface (+3 more)

### Community 90 - "Responsibilities"
Cohesion: 0.17
Nodes (11): 1. Stale architecture docs, 2. Outdated agent definitions, 3. Moved/renamed files, 4. Broken doc imports, 5. Feature/module mismatch, 6. Stale invariants, Absolute restrictions, DocumentationReviewer (+3 more)

### Community 91 - "Module overview: planning"
Cohesion: 0.40
Nodes (5): God Nodes in this module, Module overview: planning, Related docs, Responsibilities per layer, Structure

### Community 92 - "TimeEntryFacade"
Cohesion: 0.12
Nodes (4): ITimeEntryRepository, TimeEntryFacade, Inject, Injectable

### Community 93 - "app-routing-module.ts"
Cohesion: 0.50
Nodes (3): AppRoutingModule, routes, NgModule

### Community 95 - "The 6 checks"
Cohesion: 0.20
Nodes (9): 1. Stale architecture docs, 2. Outdated agent definitions, 3. Moved or renamed files, 4. Broken doc-to-doc links, 5. Feature/module mismatch, 6. Stale invariants, Output: `docs/generated/drift/latest.md`, The 6 checks (+1 more)

### Community 96 - "goals.module.ts"
Cohesion: 0.13
Nodes (10): makeEntry(), seedJanAndJulEntries(), GOAL_REPOSITORY_TOKEN, ConfirmClearDialog, GoalsComponent, Component, GoalsModule, routes (+2 more)

### Community 97 - "Getting started"
Cohesion: 0.22
Nodes (9): Build, Deploy (GitHub Pages), Getting started, i18n check, Install, Prerequisites, Run the app locally, Test (+1 more)

### Community 98 - "Workflow: AI context generation (`/docs ai-context <module|--all>`)"
Cohesion: 0.25
Nodes (7): `--all`, Fixed schema for `context.md`, `index.json`, `invariants.md`, Retrieval formatting rules, `_template-context.md`, Workflow: AI context generation (`/docs ai-context <module|--all>`)

### Community 99 - "AI context: planning"
Cohesion: 0.25
Nodes (8): AI context: planning, Dependencies, God Nodes / edges in scope, Key invariants, Public API surface, Purpose, source_commit, Test coverage summary

### Community 100 - "latest.md"
Cohesion: 0.29
Nodes (6): 1. Stale architecture docs, 2. Outdated agent definitions, 3. Moved or renamed files, 4. Broken doc-to-doc links, 5. Feature/module mismatch, 6. Stale invariants

### Community 101 - "Ministry Assistanto — Documentation"
Cohesion: 0.20
Nodes (10): Architecture, Generated: AI context, Generated: API reference, Generated: drift, Local site, Manifest, Ministry Assistanto — Documentation, Modules (+2 more)

### Community 102 - "AIDocsAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, AIDocsAgent, Chunking & citation rules, Responsibilities, Scope, Warning signals

### Community 103 - "DocumentationAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, Dispatch table, DocumentationAgent, Responsibilities, Scope, Warning signals

### Community 104 - "HumanDocsAgent"
Cohesion: 0.25
Nodes (7): Absolute restrictions, ADR conventions, HumanDocsAgent, Module narrative pages (`modules/<module>.md`), Responsibilities, Scope, Warning signals

### Community 105 - "ArchitectureDocAgent"
Cohesion: 0.33
Nodes (5): Absolute restrictions, ArchitectureDocAgent, Responsibilities, Scope, Warning signals

### Community 106 - "CompodocAgent"
Cohesion: 0.33
Nodes (5): Absolute restrictions, CompodocAgent, Responsibilities, Scope, Warning signals

### Community 107 - "Workflow: new ADR (`/docs adr "<title>"`)"
Cohesion: 0.33
Nodes (5): Numbering and filename, Steps, Supersession, Template (from `0000-template.md`), Workflow: new ADR (`/docs adr "<title>"`)

### Community 108 - "AGENTS — Ministry Assistanto"
Cohesion: 0.40
Nodes (5): AGENTS — Ministry Assistanto, Knowledge Graph (graphify), Orchestration, Role index, Theming

### Community 109 - "Workflow: documenting architecture (`/docs architecture`)"
Cohesion: 0.40
Nodes (4): Ownership boundary — read this before touching `known-violations.md`, Steps, What moved out of `architecture-guardian.md`, Workflow: documenting architecture (`/docs architecture`)

### Community 110 - "Workflow: documenting a feature (`/docs feature <module>`)"
Cohesion: 0.33
Nodes (5): `--all`, Output example, Steps, What this workflow does NOT do, Workflow: documenting a feature (`/docs feature <module>`)

### Community 111 - "graphify integration (Step 1 for every subcommand)"
Cohesion: 0.40
Nodes (4): Citation rule, Fallback when a query returns nothing, graphify integration (Step 1 for every subcommand), Which call to make

### Community 112 - "Workflow: onboarding docs (`/docs onboarding`)"
Cohesion: 0.40
Nodes (4): `getting-started.md`, `module-tour.md`, Steps, Workflow: onboarding docs (`/docs onboarding`)

### Community 113 - "Workflow: generated module overview (`/docs module <module>`)"
Cohesion: 0.50
Nodes (3): Fixed structure for `overview.md`, Steps, Workflow: generated module overview (`/docs module <module>`)

### Community 114 - "Workflow: release documentation prep (`/docs release`)"
Cohesion: 0.50
Nodes (3): Rule, Steps, Workflow: release documentation prep (`/docs release`)

### Community 115 - "Architecture overview"
Cohesion: 0.50
Nodes (4): Architecture overview, DI and module scoping, Layers, briefly, Where to see the live dependency graph

### Community 116 - "Dependency overview (generated)"
Cohesion: 0.50
Nodes (4): Dependency overview (generated), God Nodes, How this doc is produced, Layer dependency diagram

### Community 117 - "Feature lifecycle"
Cohesion: 0.67
Nodes (3): Feature lifecycle, Typical order for a new feature, Where documentation fits in

### Community 119 - "I18nDateStub"
Cohesion: 0.40
Nodes (3): I18nDateStub, TranslateStub, Pipe

### Community 120 - "SettingsComponent"
Cohesion: 0.22
Nodes (4): ChangelogService, Injectable, SettingsComponent, Component

### Community 121 - "Known violations (generated)"
Cohesion: 0.50
Nodes (4): Awareness (not violations), Known violations (generated), Per-module verdict (this pass), Resolved since last review

## Knowledge Gaps
- **501 isolated node(s):** `check-coverage.sh script`, `issues.sh script`, `pr.sh script`, `{ Octokit }`, `[owner, repo]` (+496 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 804 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `package.json`, `@ngx-translate/core`, `ThemeService`, `TimeEntryVM`, `DexieTimeEntryRepository`, `time-entry-calendar.ts`, `WeeklyScheduleEditorComponent`, `planning.component.spec.ts`, `WeeklySchedule`, `app-module.ts`, `time-entry.facade.ts`, `goals/domain/models.ts`, `GoalConfig`, `layout.spec.ts`, `update-notification.service.ts`, `BackupReminderService`, `planning.facade.ts`, `settings.component.ts`, `planning.facade.spec.ts`, `app-routing-module.ts`, `goals.module.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `@ngx-translate/core` connect `@ngx-translate/core` to `goals.module.ts`, `package.json`, `planning.facade.ts`, `time-entry-calendar.ts`, `WeeklyScheduleEditorComponent`, `settings.component.ts`, `TimeEntryVM`, `planning.component.spec.ts`, `app-module.ts`, `GoalSummaryCardComponent`, `TimeEntry`, `goals/domain/models.ts`, `@angular/core`, `MonthlyBarChartComponent`, `layout.spec.ts`, `update-notification.service.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `DurationWheelPickerComponent` connect `DurationWheelPickerComponent` to `@angular/core`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `check-coverage.sh script`, `issues.sh script`, `pr.sh script` to the rest of the system?**
  _501 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PlanningComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.09401709401709402 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._