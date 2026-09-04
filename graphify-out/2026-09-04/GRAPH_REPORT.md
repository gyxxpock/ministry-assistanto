# Graph Report - ministry-assistanto  (2026-09-04)

## Corpus Check
- Corpus is ~10,432 words - fits in a single context window. You may not need a graph.

## Summary
- 352 nodes · 543 edges · 22 communities (18 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Data Repository Layer
- Domain Models & Pipes
- Angular Build Config
- Facade & Repository API
- Angular Framework
- Dev & Test Dependencies
- Project Configuration
- Package & Scripts Config
- Architecture Conventions
- App Module & Routing
- Calendar Component
- Time Entry Form
- PR Validation Scripts
- Sync Service Interface
- UI Templates
- i18n Key Checker
- CSV Export Facade
- PR Verify Script
- Edit Form & Signals
- GitHub API Client
- App Entry Point

## God Nodes (most connected - your core abstractions)
1. `CourseVisit` - 25 edges
2. `TimeEntry` - 23 edges
3. `TimeEntryFacade` - 23 edges
4. `DexieTimeEntryRepository` - 22 edges
5. `ITimeEntryRepository` - 18 edges
6. `TimeEntryListComponent` - 18 edges
7. `TimeEntryFormComponent` - 14 edges
8. `TimeEntryVM` - 13 edges
9. `TimeEntryCalendarComponent` - 12 edges
10. `TimeEntryDB` - 10 edges

## Surprising Connections (you probably didn't know these)
- `MinistryAssistanto App` --conceptually_related_to--> `CLEAN Architecture Pattern`  [INFERRED]
  README.md → .github/copilot-instructions.md
- `Time Entry Form Template` --conceptually_related_to--> `Angular Signals`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-form/time-entry-form.component.html → .github/copilot-instructions.md
- `Totals Dashboard (Hours + Courses)` --conceptually_related_to--> `Unique Course Counting Business Rule`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-list/time-entry-list.component.html → .github/copilot-instructions.md
- `i18n Runtime Implementation PR` --semantically_similar_to--> `i18n PR Changes Summary`  [INFERRED] [semantically similar]
  .github/PULL_REQUEST_TEMPLATE_PR_BODY.md → .github/pr-comments/i18n-summary.md
- `TimeEntryFormComponent` --references--> `TimeEntryTypeVM`  [EXTRACTED]
  src/app/time-entry/presentation/components/time-entry-form/time-entry-form.component.ts → src/app/time-entry/presentation/models/time-entry.vm.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CLEAN Architecture Layers** — _github_copilot_instructions_presentation_layer, _github_copilot_instructions_facade_layer, _github_copilot_instructions_domain_layer, _github_copilot_instructions_data_layer [EXTRACTED 1.00]
- **Time Entry UI Component Flow** — src_app_time_entry_presentation_components_layout_layout_floating_nav, src_app_time_entry_presentation_components_time_entry_list_time_entry_list_component_list, src_app_time_entry_presentation_components_time_entry_day_time_entry_day_component_day_group, src_app_time_entry_presentation_components_time_entry_edit_time_entry_edit_dialog_component_dialog, src_app_time_entry_presentation_components_time_entry_form_time_entry_form_component_form [INFERRED 0.95]

## Communities (22 total, 3 thin omitted)

### Community 0 - "Data Repository Layer"
Cohesion: 0.10
Nodes (14): DexieTimeEntryRepository, TimeEntryDB, Injectable, ITimeEntryRepository, CourseVisit, MonthlyCourseCount, Person, TimeEntry (+6 more)

### Community 1 - "Domain Models & Pipes"
Cohesion: 0.08
Nodes (23): Pipe, I18nDatePipe, TimeEntryType, FileUtilService, Injectable, Layout, Component, TimeEntryDayComponent (+15 more)

### Community 2 - "Angular Build Config"
Cohesion: 0.07
Nodes (34): build, extract-i18n, serve, test, builder, configurations, defaultConfiguration, options (+26 more)

### Community 3 - "Facade & Repository API"
Cohesion: 0.09
Nodes (5): TimeEntryFacade, Inject, Injectable, TimeEntryListComponent, Component

### Community 4 - "Angular Framework"
Cohesion: 0.07
Nodes (29): @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material, @angular/platform-browser, @angular/router (+21 more)

### Community 5 - "Dev & Test Dependencies"
Cohesion: 0.08
Nodes (25): @angular/build, @angular/cli, angular-cli-ghpages, @angular/compiler-cli, jasmine-core, karma, karma-chrome-launcher, karma-coverage (+17 more)

### Community 6 - "Project Configuration"
Cohesion: 0.11
Nodes (17): prefix, projectType, root, schematics, sourceRoot, newProjectRoot, projects, ministry-assistanto (+9 more)

### Community 7 - "Package & Scripts Config"
Cohesion: 0.12
Nodes (16): name, prettier, overrides, printWidth, singleQuote, private, scripts, build (+8 more)

### Community 8 - "Architecture Conventions"
Cohesion: 0.16
Nodes (14): CLEAN Architecture Pattern, Data Layer, Domain Layer, Facade Layer, Internationalization Convention, ngx-translate i18n Library, Presentation Layer, i18n PR Changes Summary (+6 more)

### Community 9 - "App Module & Routing"
Cohesion: 0.19
Nodes (7): App, AppModule, NgModule, AppRoutingModule, routes, NgModule, Component

### Community 10 - "Calendar Component"
Cohesion: 0.20
Nodes (3): CalendarDay, TimeEntryCalendarComponent, Component

### Community 11 - "Time Entry Form"
Cohesion: 0.22
Nodes (4): TimeEntryFormComponent, Component, Input, Output

### Community 12 - "PR Validation Scripts"
Cohesion: 0.25
Nodes (7): categoryLabels, errors, fs, hasCategory, labels, path, payload

### Community 14 - "UI Templates"
Cohesion: 0.33
Nodes (6): Unique Course Counting Business Rule, Floating Bottom Navigation, Time Entry Calendar View, Day Entry Group Display, Time Entry List View, Totals Dashboard (Hours + Courses)

### Community 15 - "i18n Key Checker"
Cohesion: 0.47
Nodes (5): collectKeys(), fs, main(), path, readJson()

### Community 16 - "CSV Export Facade"
Cohesion: 0.53
Nodes (3): TimeEntryExporter, toCSV(), Injectable

### Community 17 - "PR Verify Script"
Cohesion: 0.50
Nodes (4): fetch, fs, main(), path

### Community 18 - "Edit Form & Signals"
Cohesion: 0.67
Nodes (3): Angular Signals, Time Entry Edit/Create Dialog, Time Entry Form Template

## Knowledge Gaps
- **98 isolated node(s):** `{ Octokit }`, `[owner, repo]`, `$schema`, `version`, `newProjectRoot` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TimeEntryFacade` connect `Facade & Repository API` to `Data Repository Layer`, `Domain Models & Pipes`, `Calendar Component`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `DexieTimeEntryRepository` connect `Data Repository Layer` to `Domain Models & Pipes`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `TimeEntryListComponent` connect `Facade & Repository API` to `Domain Models & Pipes`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `{ Octokit }`, `[owner, repo]`, `$schema` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Data Repository Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.09647058823529411 - nodes in this community are weakly interconnected._
- **Should `Domain Models & Pipes` be split into smaller, more focused modules?**
  _Cohesion score 0.07822410147991543 - nodes in this community are weakly interconnected._
- **Should `Angular Build Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07130124777183601 - nodes in this community are weakly interconnected._