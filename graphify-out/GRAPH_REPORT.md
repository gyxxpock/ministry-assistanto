# Graph Report - ministry-assistanto  (2026-09-10)

## Corpus Check
- 141 files · ~53,435 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 877 nodes · 1514 edges · 76 communities (56 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c3901a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DexieTimeEntryRepository
- ITimeEntryRepository
- options
- package.json
- dependencies
- devDependencies
- DurationWheelPickerComponent
- goals/domain/models.ts
- CLEAN Architecture Pattern
- TimeEntryVM
- TimeEntryListComponent
- GoalProgressVisualComponent
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
- AGENTS — Ministry Assistanto
- GoalConfig
- extraction-spec.md
- Coverage mandate
- SignalsAgent
- ArchitectureGuardian
- DomainAgent
- FacadeAgent
- UIAgent
- time-entry.module.ts
- DataAgent
- TimeEntry
- goals.facade.spec.ts
- UXAgent
- Full flow
- Session flow
- issues.sh
- prettier
- ministry-assistanto
- pr.sh
- @angular/core
- time-entry-list.component.ts
- app-module.ts
- GoalConfigComponent
- CourseVisit
- update-notification.service.ts
- TimeEntryCalendarComponent
- goals.module.ts
- time-entry.usecase.ts
- ngsw-config.json
- TimeEntryFormComponent
- GoalsFacade
- Layout
- ThemeService
- TranslateStub
- BackupReminderBannerComponent
- check-coverage.sh
- karma.conf.js
- DurationWheelPickerStub
- I18nDateStub
- goal.usecase.ts
- OptionPillGroupComponent
- TimeEntryFacade
- InMemoryRepository
- MonthPaginatorComponent

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 51 edges
2. `TimeEntry` - 41 edges
3. `CourseVisit` - 36 edges
4. `@ngx-translate/core` - 28 edges
5. `TimeEntryFacade` - 27 edges
6. `ITimeEntryRepository` - 25 edges
7. `DexieTimeEntryRepository` - 24 edges
8. `TimeEntryListComponent` - 20 edges
9. `GoalConfig` - 17 edges
10. `DurationWheelPickerComponent` - 17 edges

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

## Communities (76 total, 18 thin omitted)

### Community 0 - "DexieTimeEntryRepository"
Cohesion: 0.12
Nodes (5): dexie, DexieTimeEntryRepository, TimeEntryDB, Injectable, Optional

### Community 2 - "options"
Cohesion: 0.07
Nodes (36): build, extract-i18n, serve, test, builder, configurations, defaultConfiguration, options (+28 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (20): name, private, version, @angular/build, @angular/cdk, @angular/cli, angular-cli-ghpages, @angular/compiler (+12 more)

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
Cohesion: 0.24
Nodes (8): @angular/common, GoalProgress, GoalStatus, GoalType, GoalStatusBadgeComponent, Component, Input, GoalProgressVM

### Community 8 - "CLEAN Architecture Pattern"
Cohesion: 0.16
Nodes (14): CLEAN Architecture Pattern, Data Layer, Domain Layer, Facade Layer, Internationalization Convention, ngx-translate i18n Library, Presentation Layer, i18n PR Changes Summary (+6 more)

### Community 9 - "TimeEntryVM"
Cohesion: 0.24
Nodes (9): TimeEntryType, TimeEntryDayComponent, Component, Input, Output, CreateTimeEntryVM, TimeEntryTypeVM, TimeEntryVM (+1 more)

### Community 11 - "GoalProgressVisualComponent"
Cohesion: 0.29
Nodes (3): GoalProgressVisualComponent, Component, Input

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

### Community 29 - "AGENTS — Ministry Assistanto"
Cohesion: 0.13
Nodes (13): AGENTS — Ministry Assistanto, Knowledge Graph (graphify), Orchestration, Role index, Theming, Agent Orchestration, Arquitecture Rules (Clean Architecture), graphify (+5 more)

### Community 30 - "GoalConfig"
Cohesion: 0.24
Nodes (6): DexieGoalRepository, Injectable, Optional, ActiveGoalRecord, GoalsDB, GoalConfig

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

### Community 38 - "time-entry.module.ts"
Cohesion: 0.22
Nodes (8): @angular/forms, Person, MaterialModule, NgModule, routes, TimeEntryModule, NgModule, TIME_ENTRY_REPOSITORY

### Community 39 - "DataAgent"
Cohesion: 0.29
Nodes (6): Absolute restrictions, DataAgent, Dexie patterns in this project, Responsibilities, Scope, Warning signals

### Community 41 - "goals.facade.spec.ts"
Cohesion: 0.19
Nodes (6): IGoalRepository, AuxiliaryGoalConfig, RegularGoalConfig, makeEntry(), seedJanAndJulEntries(), GOAL_REPOSITORY_TOKEN

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

### Community 47 - "ministry-assistanto"
Cohesion: 0.10
Nodes (19): cli, analytics, prefix, projectType, root, schematics, sourceRoot, newProjectRoot (+11 more)

### Community 49 - "@angular/core"
Cohesion: 0.16
Nodes (7): @angular/core, BackupReminderFrequency, BackupReminderService, DAYS, Injectable, SettingsComponent, Component

### Community 50 - "time-entry-list.component.ts"
Cohesion: 0.25
Nodes (5): FileUtilService, Injectable, TimeEntryExporter, toCSV(), Injectable

### Community 51 - "app-module.ts"
Cohesion: 0.16
Nodes (10): @angular/platform-browser, @angular/router, @ngx-translate/http-loader, App, AppModule, NgModule, AppRoutingModule, routes (+2 more)

### Community 54 - "update-notification.service.ts"
Cohesion: 0.08
Nodes (16): @angular/service-worker, rxjs, ChangelogEntry, ChangelogService, Injectable, ChangeEntry, ChangelogEntry, Injectable (+8 more)

### Community 55 - "TimeEntryCalendarComponent"
Cohesion: 0.19
Nodes (3): TimeEntryCalendarComponent, Component, toDateKey()

### Community 56 - "goals.module.ts"
Cohesion: 0.19
Nodes (8): @ngx-translate/core, I18nDatePipe, Pipe, GoalsModule, routes, NgModule, SharedModule, NgModule

### Community 57 - "time-entry.usecase.ts"
Cohesion: 0.36
Nodes (7): computeMonthlyTotals(), inMonth(), mergeTimeEntry(), MonthlyTotals, normalizeName(), toDateKey(), toKey()

### Community 58 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 59 - "TimeEntryFormComponent"
Cohesion: 0.24
Nodes (4): TimeEntryFormComponent, Component, Input, Output

### Community 60 - "GoalsFacade"
Cohesion: 0.15
Nodes (8): Goal, GoalsFacade, Injectable, DialogData, MonthOption, ConfirmClearDialog, GoalsComponent, Component

### Community 62 - "ThemeService"
Cohesion: 0.18
Nodes (7): MODE_CYCLE, ResolvedTheme, configureTestBed(), makeMockMql(), ThemeMode, ThemeService, Injectable

### Community 63 - "TranslateStub"
Cohesion: 0.27
Nodes (4): TranslateStub, Pipe, TranslateStub, Pipe

### Community 64 - "BackupReminderBannerComponent"
Cohesion: 0.40
Nodes (3): BackupReminderBannerComponent, Component, Output

### Community 67 - "DurationWheelPickerStub"
Cohesion: 0.22
Nodes (3): DurationWheelPickerStub, MatSelectStub, Component

### Community 69 - "goal.usecase.ts"
Cohesion: 0.21
Nodes (16): buildServiceYearFromYear(), computeAuxiliaryGoalProgress(), computeGoalProgress(), computeMonthlyTarget(), computeRegularGoalProgress(), computeRegularMonthlyTarget(), computeStatus(), currentCalendarMonth() (+8 more)

### Community 73 - "OptionPillGroupComponent"
Cohesion: 0.18
Nodes (8): OptionPillGroupComponent, PillOption, TEST_OPTIONS, TranslateStub, Pipe, Component, Input, Output

### Community 75 - "TimeEntryFacade"
Cohesion: 0.12
Nodes (7): TimeEntryFacade, Injectable, CalendarDay, today, TimeEntryEditDialogComponent, Component, Inject

### Community 83 - "MonthPaginatorComponent"
Cohesion: 0.22
Nodes (7): MonthPaginatorComponent, I18nDateStub, TranslateStub, Pipe, Component, Input, Output

## Knowledge Gaps
- **270 isolated node(s):** `check-coverage.sh script`, `issues.sh script`, `pr.sh script`, `{ Octokit }`, `[owner, repo]` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 471 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `DexieTimeEntryRepository`, `package.json`, `time-entry.module.ts`, `goals/domain/models.ts`, `goals.facade.spec.ts`, `OptionPillGroupComponent`, `TimeEntryFacade`, `TimeEntryVM`, `time-entry-list.component.ts`, `app-module.ts`, `MonthPaginatorComponent`, `update-notification.service.ts`, `GoalConfig`, `goals.module.ts`, `GoalsFacade`, `ThemeService`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `@ngx-translate/core` connect `goals.module.ts` to `package.json`, `time-entry.module.ts`, `goals/domain/models.ts`, `TimeEntryVM`, `TimeEntryFacade`, `@angular/core`, `time-entry-list.component.ts`, `app-module.ts`, `update-notification.service.ts`, `GoalsFacade`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `TimeEntry` connect `TimeEntry` to `DexieTimeEntryRepository`, `ITimeEntryRepository`, `time-entry.module.ts`, `goals.facade.spec.ts`, `InMemoryRepository`, `time-entry-list.component.ts`, `CourseVisit`, `time-entry.usecase.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `check-coverage.sh script`, `issues.sh script`, `pr.sh script` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DexieTimeEntryRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Should `ITimeEntryRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._
- **Should `options` be split into smaller, more focused modules?**
  _Cohesion score 0.06825396825396825 - nodes in this community are weakly interconnected._