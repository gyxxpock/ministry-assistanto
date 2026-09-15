# Graph Report - ministry-assistanto  (2026-09-15)

## Corpus Check
- 209 files · ~81,413 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1359 nodes · 2324 edges · 120 communities (97 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4615260`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ITimeEntryRepository
- settings.component.ts
- options
- package.json
- dependencies
- devDependencies
- DurationWheelPickerComponent
- goals/domain/models.ts
- CLEAN Architecture Pattern
- GoalConfig
- TimeEntryListComponent
- time-entry.facade.ts
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
- TimeEntryDayComponent
- DataAgent
- TimeEntryCalendarComponent
- WeeklyScheduleEditorComponent
- UXAgent
- Full flow
- Session flow
- issues.sh
- prettier
- schematics
- pr.sh
- goals.facade.ts
- WeeklySchedule
- app-module.ts
- TimeEntry
- CourseVisit
- goals.module.ts
- planning.component.spec.ts
- goal.usecase.ts
- time-entry.module.ts
- ngsw-config.json
- MonthlyBarChartComponent
- I18nDateStub
- Layout
- @angular/core
- BackupReminderService
- PlanningComponent
- check-coverage.sh
- karma.conf.js
- GoalConfigComponent
- DayOverridePanelComponent
- properties
- TimeEntryFormComponent
- option-pill-group.component.ts
- ThemeService
- time-entry.usecase.ts
- DurationWheelPickerStub
- ministry-assistanto
- @ngx-translate/core
- production
- development
- angular.json
- ai-context.schema.json
- GoalSummaryCardComponent
- planning.usecase.ts
- planning.facade.ts
- What You Must Do When Invoked
- ADR-NNNN: <short title, imperative mood>
- AI context: <module-name>
- Responsibilities
- dependency-overview.md
- UpdateNotificationService
- .addEntry
- index.md
- The 6 checks
- planning.facade.spec.ts
- Getting started
- Workflow: AI context generation (`/docs ai-context <module|--all>`)
- AI context: planning
- Drift report (latest)
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
- planning.component.ts
- Feature lifecycle
- TranslateStub
- TranslateStub

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

## Communities (120 total, 20 thin omitted)

### Community 1 - "settings.component.ts"
Cohesion: 0.13
Nodes (10): ChangelogService, Injectable, isWeekDay(), Injectable, VALID_WEEK_DAYS, WEEK_DAY_INDEX, WeekStartService, WeekDay (+2 more)

### Community 2 - "options"
Cohesion: 0.22
Nodes (13): options, assets, browser, codeCoverage, index, inlineStyleLanguage, karmaConfig, polyfills (+5 more)

### Community 3 - "package.json"
Cohesion: 0.09
Nodes (21): name, private, version, @angular/build, @angular/cdk, @angular/cli, angular-cli-ghpages, @angular/compiler (+13 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material, @angular/platform-browser (+8 more)

### Community 5 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @angular/build, @angular/cli, angular-cli-ghpages, @angular/compiler-cli, jasmine-core, karma, karma-chrome-launcher (+5 more)

### Community 6 - "DurationWheelPickerComponent"
Cohesion: 0.21
Nodes (3): DurationWheelPickerComponent, Component, ViewChild

### Community 7 - "goals/domain/models.ts"
Cohesion: 0.14
Nodes (12): GoalProgress, GoalStatus, GoalType, REGULAR_GOAL_MARGIN, REGULAR_GOAL_TARGET, GoalProgressVisualComponent, Component, Input (+4 more)

### Community 8 - "CLEAN Architecture Pattern"
Cohesion: 0.16
Nodes (14): CLEAN Architecture Pattern, Data Layer, Domain Layer, Facade Layer, Internationalization Convention, ngx-translate i18n Library, Presentation Layer, i18n PR Changes Summary (+6 more)

### Community 9 - "GoalConfig"
Cohesion: 0.18
Nodes (7): DexieGoalRepository, Injectable, Optional, ActiveGoalRecord, GoalsDB, IGoalRepository, GoalConfig

### Community 11 - "time-entry.facade.ts"
Cohesion: 0.13
Nodes (9): TimeEntryFacade, Injectable, CalendarDay, today, TimeEntryEditDialogComponent, Component, Inject, toDateKey() (+1 more)

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
Cohesion: 0.22
Nodes (9): scripts, build, build:gh, deploy, i18n:check, ng, start, test (+1 more)

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

### Community 38 - "TimeEntryDayComponent"
Cohesion: 0.20
Nodes (6): I18nDateStub, Pipe, TimeEntryDayComponent, Component, Input, Output

### Community 39 - "DataAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, DataAgent, Dexie patterns in this project, Responsibilities, Scope, Warning signals

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

### Community 49 - "goals.facade.ts"
Cohesion: 0.24
Nodes (5): Goal, GoalsFacade, Injectable, DialogData, MonthOption

### Community 50 - "WeeklySchedule"
Cohesion: 0.13
Nodes (12): DexiePlanningRepository, Injectable, Optional, DayPlanRecord, PlanningDB, WeeklyScheduleRecord, IPlanningRepository, DayPlan (+4 more)

### Community 51 - "app-module.ts"
Cohesion: 0.17
Nodes (9): @angular/platform-browser, @ngx-translate/http-loader, App, AppModule, NgModule, AppRoutingModule, routes, NgModule (+1 more)

### Community 52 - "TimeEntry"
Cohesion: 0.14
Nodes (4): InMemoryTimeEntryRepository, MonthlyCourseCount, Person, TimeEntry

### Community 54 - "goals.module.ts"
Cohesion: 0.13
Nodes (9): makeEntry(), seedJanAndJulEntries(), GOAL_REPOSITORY_TOKEN, ConfirmClearDialog, GoalsComponent, Component, GoalsModule, routes (+1 more)

### Community 55 - "planning.component.spec.ts"
Cohesion: 0.15
Nodes (11): @angular/common, @angular/router, rxjs, PlanningCalendarDay, ISO_WEEKDAY_KEYS, ZERO_SCHEDULE, PlanningModule, routes (+3 more)

### Community 56 - "goal.usecase.ts"
Cohesion: 0.29
Nodes (13): buildServiceYearFromYear(), computeAuxiliaryGoalProgress(), computeGoalProgress(), computeMonthlyTarget(), computeRegularGoalProgress(), computeRegularMonthlyTarget(), computeStatus(), currentCalendarMonth() (+5 more)

### Community 57 - "time-entry.module.ts"
Cohesion: 0.14
Nodes (10): @angular/forms, MonthPaginatorComponent, Component, Input, Output, MaterialModule, NgModule, routes (+2 more)

### Community 58 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 59 - "MonthlyBarChartComponent"
Cohesion: 0.18
Nodes (6): MonthlyBar, BarColumn, MonthlyBarChartComponent, Component, Input, Output

### Community 60 - "I18nDateStub"
Cohesion: 0.40
Nodes (3): I18nDateStub, TranslateStub, Pipe

### Community 62 - "@angular/core"
Cohesion: 0.16
Nodes (11): @angular/core, ChangelogEntry, ChangeEntry, ChangelogEntry, Component, Input, Output, UpdateBannerComponent (+3 more)

### Community 63 - "BackupReminderService"
Cohesion: 0.11
Nodes (9): BackupReminderFrequency, BackupReminderService, DAYS, Injectable, FileUtilService, Injectable, BackupReminderBannerComponent, Component (+1 more)

### Community 64 - "PlanningComponent"
Cohesion: 0.09
Nodes (7): PlanningCalendarComponent, Component, Input, Output, PlanningComponent, Component, toDateKey()

### Community 68 - "DayOverridePanelComponent"
Cohesion: 0.20
Nodes (5): DayOverridePanelComponent, Component, HostListener, Input, Output

### Community 69 - "properties"
Cohesion: 0.05
Nodes (39): additionalProperties, properties, required, type, description, type, format, type (+31 more)

### Community 72 - "TimeEntryFormComponent"
Cohesion: 0.24
Nodes (4): TimeEntryFormComponent, Component, Input, Output

### Community 73 - "option-pill-group.component.ts"
Cohesion: 0.24
Nodes (6): OptionPillGroupComponent, PillOption, TEST_OPTIONS, Component, Input, Output

### Community 74 - "ThemeService"
Cohesion: 0.18
Nodes (7): MODE_CYCLE, ResolvedTheme, configureTestBed(), makeMockMql(), ThemeMode, ThemeService, Injectable

### Community 75 - "time-entry.usecase.ts"
Cohesion: 0.21
Nodes (10): computeMonthlyTotals(), inMonth(), mergeTimeEntry(), MonthlyTotals, normalizeName(), toDateKey(), toKey(), TimeEntryExporter (+2 more)

### Community 76 - "DurationWheelPickerStub"
Cohesion: 0.22
Nodes (3): DurationWheelPickerStub, MatSelectStub, Component

### Community 77 - "ministry-assistanto"
Cohesion: 0.20
Nodes (10): extract-i18n, test, builder, architect, prefix, projectType, root, sourceRoot (+2 more)

### Community 78 - "@ngx-translate/core"
Cohesion: 0.21
Nodes (3): @ngx-translate/core, I18nDatePipe, Pipe

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
Cohesion: 0.17
Nodes (3): GoalSummaryCardComponent, Component, Input

### Community 84 - "planning.usecase.ts"
Cohesion: 0.15
Nodes (13): getServiceYear(), isActiveMonth(), ServiceYear, computeDailyPlan(), computeMonthlyPlanned(), computePlanningProjection(), daysInMonth(), isPlanSufficient() (+5 more)

### Community 85 - "planning.facade.ts"
Cohesion: 0.24
Nodes (6): toIsoDate(), buildActualByMonth(), firstAndLastOfMonth(), PlanningFacade, round2(), Injectable

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

### Community 91 - "dependency-overview.md"
Cohesion: 0.18
Nodes (9): Dependency overview (generated), God Nodes, How this doc is produced, Layer dependency diagram, God Nodes in this module, Module overview: planning, Related docs, Responsibilities per layer (+1 more)

### Community 92 - "UpdateNotificationService"
Cohesion: 0.22
Nodes (3): @angular/service-worker, Injectable, UpdateNotificationService

### Community 93 - ".addEntry"
Cohesion: 0.25
Nodes (5): TimeEntryType, CreateTimeEntryVM, TimeEntryTypeVM, TimeEntryVM, UpdateTimeEntryVM

### Community 94 - "index.md"
Cohesion: 0.33
Nodes (3): Module tour, Known violations (generated), Resolved since last review

### Community 95 - "The 6 checks"
Cohesion: 0.20
Nodes (9): 1. Stale architecture docs, 2. Outdated agent definitions, 3. Moved or renamed files, 4. Broken doc-to-doc links, 5. Feature/module mismatch, 6. Stale invariants, Output: `docs/generated/drift/latest.md`, The 6 checks (+1 more)

### Community 97 - "Getting started"
Cohesion: 0.22
Nodes (9): Build, Deploy (GitHub Pages), Getting started, i18n check, Install, Prerequisites, Run the app locally, Test (+1 more)

### Community 98 - "Workflow: AI context generation (`/docs ai-context <module|--all>`)"
Cohesion: 0.25
Nodes (7): `--all`, Fixed schema for `context.md`, `index.json`, `invariants.md`, Retrieval formatting rules, `_template-context.md`, Workflow: AI context generation (`/docs ai-context <module|--all>`)

### Community 99 - "AI context: planning"
Cohesion: 0.25
Nodes (8): AI context: planning, Dependencies, God Nodes / edges in scope, Key invariants, Public API surface, Purpose, source_commit, Test coverage summary

### Community 100 - "Drift report (latest)"
Cohesion: 0.25
Nodes (7): 1. Stale architecture docs, 2. Outdated agent definitions, 3. Moved or renamed files, 4. Broken doc-to-doc links, 5. Feature/module mismatch, 6. Stale invariants, Drift report (latest)

### Community 101 - "Ministry Assistanto — Documentation"
Cohesion: 0.25
Nodes (8): Architecture, Generated: AI context, Generated: API reference, Generated: drift, Manifest, Ministry Assistanto — Documentation, Onboarding, Workflows

### Community 102 - "AIDocsAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, AIDocsAgent, Chunking & citation rules, Responsibilities, Scope, Warning signals

### Community 103 - "DocumentationAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, Dispatch table, DocumentationAgent, Responsibilities, Scope, Warning signals

### Community 104 - "HumanDocsAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, ADR conventions, HumanDocsAgent, Responsibilities, Scope, Warning signals

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
Cohesion: 0.40
Nodes (4): Output example, Steps, What this workflow does NOT do, Workflow: documenting a feature (`/docs feature <module>`)

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

### Community 117 - "Feature lifecycle"
Cohesion: 0.67
Nodes (3): Feature lifecycle, Typical order for a new feature, Where documentation fits in

## Knowledge Gaps
- **464 isolated node(s):** `check-coverage.sh script`, `issues.sh script`, `pr.sh script`, `{ Octokit }`, `[owner, repo]` (+459 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 764 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `settings.component.ts`, `package.json`, `goals/domain/models.ts`, `GoalConfig`, `time-entry.facade.ts`, `DexieTimeEntryRepository`, `TimeEntryDayComponent`, `WeeklyScheduleEditorComponent`, `goals.facade.ts`, `WeeklySchedule`, `app-module.ts`, `goals.module.ts`, `planning.component.spec.ts`, `time-entry.module.ts`, `BackupReminderService`, `option-pill-group.component.ts`, `ThemeService`, `time-entry.usecase.ts`, `@ngx-translate/core`, `planning.facade.ts`, `planning.facade.spec.ts`, `planning.component.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `@ngx-translate/core` connect `@ngx-translate/core` to `settings.component.ts`, `package.json`, `TimeEntryDayComponent`, `goals/domain/models.ts`, `WeeklyScheduleEditorComponent`, `option-pill-group.component.ts`, `time-entry.facade.ts`, `goals.facade.ts`, `app-module.ts`, `GoalSummaryCardComponent`, `planning.component.ts`, `goals.module.ts`, `planning.component.spec.ts`, `time-entry.module.ts`, `MonthlyBarChartComponent`, `@angular/core`, `BackupReminderService`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `DayOverridePanelComponent` connect `DayOverridePanelComponent` to `settings.component.ts`, `@ngx-translate/core`, `planning.component.spec.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `check-coverage.sh script`, `issues.sh script`, `pr.sh script` to the rest of the system?**
  _464 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `settings.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._