# Graph Report - ministry-assistanto  (2026-09-04)

## Corpus Check
- 76 files · ~25,451 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 503 nodes · 692 edges · 41 communities (32 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0cd1591f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CourseVisit
- time-entry.module.ts
- ministry-assistanto
- TimeEntryFacade
- dependencies
- devDependencies
- options
- scripts
- CLEAN Architecture Pattern
- app-module.ts
- TimeEntryCalendarComponent
- Dispatcher — Auto-Dispatch de Agentes
- check-pr.js
- ISyncService
- Time Entry List View
- check-i18n.js
- What You Must Do When Invoked
- scripts/verify-pr.js
- Time Entry Form Template
- .github/scripts/verify-pr.js
- App Router Outlet
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- Estrategia por capa
- SignalsAgent
- ArchitectureGuardian
- DomainAgent
- FacadeAgent
- UIAgent
- AGENTS — Ministry Assistanto
- DataAgent

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
10. `TimeEntryEditDialogComponent` - 12 edges

## Surprising Connections (you probably didn't know these)
- `MinistryAssistanto App` --conceptually_related_to--> `CLEAN Architecture Pattern`  [INFERRED]
  README.md → .github/copilot-instructions.md
- `Totals Dashboard (Hours + Courses)` --conceptually_related_to--> `Unique Course Counting Business Rule`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-list/time-entry-list.component.html → .github/copilot-instructions.md
- `Time Entry Form Template` --conceptually_related_to--> `Angular Signals`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-form/time-entry-form.component.html → .github/copilot-instructions.md
- `i18n Runtime Implementation PR` --semantically_similar_to--> `i18n PR Changes Summary`  [INFERRED] [semantically similar]
  .github/PULL_REQUEST_TEMPLATE_PR_BODY.md → .github/pr-comments/i18n-summary.md
- `DexieTimeEntryRepository` --implements--> `ITimeEntryRepository`  [EXTRACTED]
  src/app/time-entry/data/time-entry.dexie.ts → src/app/time-entry/data/time-entry.repository.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CLEAN Architecture Layers** — _github_copilot_instructions_presentation_layer, _github_copilot_instructions_facade_layer, _github_copilot_instructions_domain_layer, _github_copilot_instructions_data_layer [EXTRACTED 1.00]
- **Time Entry UI Component Flow** — src_app_time_entry_presentation_components_layout_layout_floating_nav, src_app_time_entry_presentation_components_time_entry_list_time_entry_list_component_list, src_app_time_entry_presentation_components_time_entry_day_time_entry_day_component_day_group, src_app_time_entry_presentation_components_time_entry_edit_time_entry_edit_dialog_component_dialog, src_app_time_entry_presentation_components_time_entry_form_time_entry_form_component_form [INFERRED 0.95]

## Communities (41 total, 7 thin omitted)

### Community 0 - "CourseVisit"
Cohesion: 0.10
Nodes (17): DexieTimeEntryRepository, TimeEntryDB, Injectable, CourseVisit, MonthlyCourseCount, Person, TimeEntry, computeMonthlyTotals() (+9 more)

### Community 1 - "time-entry.module.ts"
Cohesion: 0.05
Nodes (27): Pipe, I18nDatePipe, TimeEntryType, FileUtilService, Injectable, Layout, Component, TimeEntryDayComponent (+19 more)

### Community 2 - "ministry-assistanto"
Cohesion: 0.05
Nodes (41): build, extract-i18n, serve, test, builder, configurations, defaultConfiguration, analytics (+33 more)

### Community 3 - "TimeEntryFacade"
Cohesion: 0.08
Nodes (7): ITimeEntryRepository, TimeEntryFacade, Inject, Injectable, TimeEntryListComponent, Component, UpdateTimeEntryVM

### Community 4 - "dependencies"
Cohesion: 0.07
Nodes (29): @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material, @angular/platform-browser, @angular/router (+21 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): @angular/build, angular-cli-ghpages, @angular/compiler-cli, jasmine-core, karma, karma-chrome-launcher, karma-coverage, karma-jasmine (+17 more)

### Community 6 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, polyfills, stylePreprocessorOptions, styles (+7 more)

### Community 7 - "scripts"
Cohesion: 0.12
Nodes (16): name, prettier, overrides, printWidth, singleQuote, private, scripts, build (+8 more)

### Community 8 - "CLEAN Architecture Pattern"
Cohesion: 0.16
Nodes (14): CLEAN Architecture Pattern, Data Layer, Domain Layer, Facade Layer, Internationalization Convention, ngx-translate i18n Library, Presentation Layer, i18n PR Changes Summary (+6 more)

### Community 9 - "app-module.ts"
Cohesion: 0.19
Nodes (7): App, AppModule, NgModule, AppRoutingModule, routes, NgModule, Component

### Community 10 - "TimeEntryCalendarComponent"
Cohesion: 0.22
Nodes (3): CalendarDay, TimeEntryCalendarComponent, Component

### Community 11 - "Dispatcher — Auto-Dispatch de Agentes"
Cohesion: 0.20
Nodes (9): ArchitectureGuardian — modo silencioso permanente, Dispatcher — Auto-Dispatch de Agentes, Override manual, Paso 1 — Analizar la tarea, Paso 2 — Aplicar la matriz de routing, Paso 3 — Leer los archivos de agentes activos, Paso 4 — Anunciar y responder, Paso 5 — Orden de ejecución para tareas multi-capa (+1 more)

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
Cohesion: 0.33
Nodes (5): Arquitecture Rules (Clean Architecture), Contextual Agents (Auto-Dispatch), graphify, Knowledge Graph Integration, Layer Dependency Rules:

### Community 32 - "Estrategia por capa"
Cohesion: 0.20
Nodes (9): Archivos de spec existentes, Convenciones, Data — tests de integración con Dexie real (fake-indexeddb), Domain — tests puros, sin Angular TestBed, Estrategia por capa, Facade — mockear ITimeEntryRepository, Presentation — TestBed con Facade mockeado, Señales de alerta (+1 more)

### Community 33 - "SignalsAgent"
Cohesion: 0.25
Nodes (8): Cuándo adoptar Signals, Estado actual del proyecto, Orden recomendado de migración, Patrones para este proyecto, Restricciones, Señales de alerta, Signals vs RxJS — regla de decisión, SignalsAgent

### Community 34 - "ArchitectureGuardian"
Cohesion: 0.29
Nodes (6): ArchitectureGuardian, Checklist de revisión, Cómo detectar violaciones, Las 4 capas de este proyecto, Reglas de intervención, Violaciones conocidas (pendientes de corregir)

### Community 35 - "DomainAgent"
Cohesion: 0.29
Nodes (6): Alcance, Convenciones de este proyecto, DomainAgent, Responsabilidades, Restricciones absolutas, Señales de alerta

### Community 36 - "FacadeAgent"
Cohesion: 0.29
Nodes (7): Alcance, Camino hacia Signals, Estado actual y deuda técnica, FacadeAgent, Responsabilidades, Restricciones absolutas, Señales de alerta

### Community 37 - "UIAgent"
Cohesion: 0.29
Nodes (7): Alcance, Camino hacia Signals, Convenciones de este proyecto, Responsabilidades, Restricciones absolutas, Señales de alerta, UIAgent

### Community 38 - "AGENTS — Ministry Assistanto"
Cohesion: 0.33
Nodes (6): AGENTS — Ministry Assistanto, Auto-dispatch (modo por defecto), Modo de activación, Override manual (cuando quieres forzar un agente específico), Reglas del sistema, Índice de agentes

### Community 39 - "DataAgent"
Cohesion: 0.29
Nodes (6): Alcance, DataAgent, Patrones Dexie de este proyecto, Responsabilidades, Restricciones absolutas, Señales de alerta

## Knowledge Gaps
- **197 isolated node(s):** `{ Octokit }`, `[owner, repo]`, `$schema`, `version`, `newProjectRoot` (+192 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 261 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TimeEntryFacade` connect `TimeEntryFacade` to `CourseVisit`, `time-entry.module.ts`, `TimeEntryCalendarComponent`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `DexieTimeEntryRepository` connect `CourseVisit` to `time-entry.module.ts`, `TimeEntryFacade`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `TimeEntryListComponent` connect `TimeEntryFacade` to `time-entry.module.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `{ Octokit }`, `[owner, repo]`, `$schema` to the rest of the system?**
  _197 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CourseVisit` be split into smaller, more focused modules?**
  _Cohesion score 0.09877551020408164 - nodes in this community are weakly interconnected._
- **Should `time-entry.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0544464609800363 - nodes in this community are weakly interconnected._
- **Should `ministry-assistanto` be split into smaller, more focused modules?**
  _Cohesion score 0.04994192799070848 - nodes in this community are weakly interconnected._