# Graph Report - ministry-assistanto  (2026-09-07)

## Corpus Check
- 104 files · ~36,872 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 688 nodes · 991 edges · 65 communities (49 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49586e04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CourseVisit
- time-entry.module.ts
- options
- package.json
- dependencies
- devDependencies
- DurationWheelPickerComponent
- @angular/core
- CLEAN Architecture Pattern
- app-module.ts
- TimeEntryListComponent
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
- TestingAgent
- SignalsAgent
- ArchitectureGuardian
- DomainAgent
- FacadeAgent
- UIAgent
- AGENTS — Ministry Assistanto
- DataAgent
- BackupReminderService
- UXAgent
- Flujo completo
- Skill: issues
- issues.sh
- layout.ts
- schematics
- pr.sh
- InMemoryRepository
- MonthPaginatorComponent
- OptionPillGroupComponent
- UpdateNotificationService
- time-entry.facade.ts
- Component
- development
- scripts
- App
- ngsw-config.json
- prettier
- NgModule
- production
- angular.json
- architect
- ministry-assistanto

## God Nodes (most connected - your core abstractions)
1. `CourseVisit` - 26 edges
2. `TimeEntry` - 24 edges
3. `TimeEntryFacade` - 24 edges
4. `DexieTimeEntryRepository` - 22 edges
5. `TimeEntryListComponent` - 20 edges
6. `ITimeEntryRepository` - 19 edges
7. `TimeEntryVM` - 16 edges
8. `DurationWheelPickerComponent` - 16 edges
9. `TimeEntryEditDialogComponent` - 15 edges
10. `TimeEntryCalendarComponent` - 14 edges

## Surprising Connections (you probably didn't know these)
- `MinistryAssistanto App` --conceptually_related_to--> `CLEAN Architecture Pattern`  [INFERRED]
  README.md → .github/copilot-instructions.md
- `Totals Dashboard (Hours + Courses)` --conceptually_related_to--> `Unique Course Counting Business Rule`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-list/time-entry-list.component.html → .github/copilot-instructions.md
- `Time Entry Form Template` --conceptually_related_to--> `Angular Signals`  [INFERRED]
  src/app/time-entry/presentation/components/time-entry-form/time-entry-form.component.html → .github/copilot-instructions.md
- `i18n Runtime Implementation PR` --semantically_similar_to--> `i18n PR Changes Summary`  [INFERRED] [semantically similar]
  .github/PULL_REQUEST_TEMPLATE_PR_BODY.md → .github/pr-comments/i18n-summary.md
- `Layout` --references--> `UpdateNotificationService`  [EXTRACTED]
  src/app/time-entry/presentation/components/layout/layout.ts → src/app/core/services/update-notification.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CLEAN Architecture Layers** — _github_copilot_instructions_presentation_layer, _github_copilot_instructions_facade_layer, _github_copilot_instructions_domain_layer, _github_copilot_instructions_data_layer [EXTRACTED 1.00]
- **Time Entry UI Component Flow** — src_app_time_entry_presentation_components_layout_layout_floating_nav, src_app_time_entry_presentation_components_time_entry_list_time_entry_list_component_list, src_app_time_entry_presentation_components_time_entry_day_time_entry_day_component_day_group, src_app_time_entry_presentation_components_time_entry_edit_time_entry_edit_dialog_component_dialog, src_app_time_entry_presentation_components_time_entry_form_time_entry_form_component_form [INFERRED 0.95]

## Communities (65 total, 14 thin omitted)

### Community 0 - "CourseVisit"
Cohesion: 0.06
Nodes (23): Optional, DexieTimeEntryRepository, TimeEntryDB, Injectable, ITimeEntryRepository, CourseVisit, MonthlyCourseCount, Person (+15 more)

### Community 1 - "time-entry.module.ts"
Cohesion: 0.22
Nodes (7): Pipe, I18nDatePipe, MaterialModule, NgModule, routes, TimeEntryModule, NgModule

### Community 2 - "options"
Cohesion: 0.27
Nodes (11): options, assets, browser, index, inlineStyleLanguage, polyfills, stylePreprocessorOptions, styles (+3 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (24): name, private, version, @angular/build, @angular/cdk, @angular/cli, angular-cli-ghpages, @angular/common (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material, @angular/platform-browser (+8 more)

### Community 5 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @angular/build, @angular/cli, angular-cli-ghpages, @angular/compiler-cli, jasmine-core, karma, karma-chrome-launcher (+5 more)

### Community 6 - "DurationWheelPickerComponent"
Cohesion: 0.19
Nodes (3): DurationWheelPickerComponent, Component, ViewChild

### Community 7 - "@angular/core"
Cohesion: 0.30
Nodes (5): @angular/core, ChangeEntry, ChangelogEntry, Component, UpdateBannerComponent

### Community 8 - "CLEAN Architecture Pattern"
Cohesion: 0.16
Nodes (14): CLEAN Architecture Pattern, Data Layer, Domain Layer, Facade Layer, Internationalization Convention, ngx-translate i18n Library, Presentation Layer, i18n PR Changes Summary (+6 more)

### Community 9 - "app-module.ts"
Cohesion: 0.20
Nodes (8): @angular/platform-browser, @ngx-translate/core, @ngx-translate/http-loader, AppModule, NgModule, AppRoutingModule, routes, NgModule

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

### Community 32 - "TestingAgent"
Cohesion: 0.14
Nodes (13): Archivos de spec existentes, Convenciones, Convención de mocks para este proyecto, Data — tests de integración con Dexie real (fake-indexeddb), Domain — tests puros, sin Angular TestBed, Estrategia por capa, Facade — mockear ITimeEntryRepository, Mandato de cobertura (+5 more)

### Community 33 - "SignalsAgent"
Cohesion: 0.20
Nodes (9): Cuándo adoptar Signals, Estado actual del proyecto, Orden recomendado de migración, Patrones para este proyecto, Patrón: servicio de preferencias con Signals + localStorage, Restricciones, Señales de alerta, Signals vs RxJS — regla de decisión (+1 more)

### Community 34 - "ArchitectureGuardian"
Cohesion: 0.29
Nodes (7): ArchitectureGuardian, Checklist de revisión, Cómo detectar violaciones, Las 4 capas de este proyecto, Reglas de intervención, Restricción de scope DI: root vs module-scoped, Violaciones conocidas (pendientes de corregir)

### Community 35 - "DomainAgent"
Cohesion: 0.29
Nodes (6): Alcance, Convenciones de este proyecto, DomainAgent, Responsabilidades, Restricciones absolutas, Señales de alerta

### Community 36 - "FacadeAgent"
Cohesion: 0.29
Nodes (7): Alcance, Camino hacia Signals, Estado actual y deuda técnica, FacadeAgent, Responsabilidades, Restricciones absolutas, Señales de alerta

### Community 37 - "UIAgent"
Cohesion: 0.17
Nodes (11): 1. `| date:` no responde al idioma en runtime, 2. Flex items con texto largo requieren `min-width: 0`, 3. Paneles flotantes condicionales deben ser `position: absolute` + restringidos al viewport, Alcance, Camino hacia Signals, Convenciones de este proyecto, Responsabilidades, Restricciones absolutas (+3 more)

### Community 38 - "AGENTS — Ministry Assistanto"
Cohesion: 0.33
Nodes (6): AGENTS — Ministry Assistanto, Auto-dispatch (modo por defecto), Modo de activación, Override manual (cuando quieres forzar un agente específico), Reglas del sistema, Índice de agentes

### Community 39 - "DataAgent"
Cohesion: 0.29
Nodes (6): Alcance, DataAgent, Patrones Dexie de este proyecto, Responsabilidades, Restricciones absolutas, Señales de alerta

### Community 41 - "BackupReminderService"
Cohesion: 0.07
Nodes (17): Component, BackupReminderFrequency, BackupReminderService, DAYS, Injectable, MODE_CYCLE, ThemeMode, ThemeService (+9 more)

### Community 42 - "UXAgent"
Cohesion: 0.15
Nodes (12): Checklist de revisión UX (aplicar antes de aprobar cambios de UI), Convención de changelog (`public/assets/changelog.json`), Formato, Integración con UIAgent, Interacción iOS-first, Jerarquía visual y legibilidad, Liquid Glass (Apple visionOS / iOS 26+), Principios rectores (+4 more)

### Community 43 - "Flujo completo"
Cohesion: 0.18
Nodes (10): 1. Verificar estado, 2. Push, 3. Construir título y cuerpo del PR, 4. Crear PR, 5. Mostrar URL, Cuándo activar este skill, Flujo completo, Reglas (+2 more)

### Community 44 - "Skill: issues"
Cohesion: 0.15
Nodes (12): 1. Inicio — listar y elegir, 2. Arrancar un issue, 3. Implementar, 4. Cerrar, Crear un issue nuevo, Cuándo activar este skill, Etiquetas disponibles, Flujo de sesión (+4 more)

### Community 46 - "layout.ts"
Cohesion: 0.18
Nodes (4): FileUtilService, Injectable, Layout, Component

### Community 47 - "schematics"
Cohesion: 0.25
Nodes (8): schematics, standalone, style, standalone, standalone, @schematics/angular:component, @schematics/angular:directive, @schematics/angular:pipe

### Community 50 - "MonthPaginatorComponent"
Cohesion: 0.22
Nodes (7): Input, Output, MonthPaginatorComponent, I18nDateStub, TranslateStub, Pipe, Component

### Community 51 - "OptionPillGroupComponent"
Cohesion: 0.22
Nodes (7): OptionPillGroupComponent, PillOption, TEST_OPTIONS, TranslateStub, Pipe, Component, Output

### Community 52 - "UpdateNotificationService"
Cohesion: 0.22
Nodes (4): Injectable, @angular/service-worker, rxjs, UpdateNotificationService

### Community 53 - "time-entry.facade.ts"
Cohesion: 0.06
Nodes (21): TimeEntryType, CalendarDay, today, TimeEntryCalendarComponent, Component, TimeEntryDayComponent, Component, Input (+13 more)

### Community 55 - "development"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, development, buildTarget, extractLicenses, optimization (+1 more)

### Community 56 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, build:gh, deploy, i18n:check, ng, start, test (+1 more)

### Community 58 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 59 - "prettier"
Cohesion: 0.50
Nodes (4): prettier, overrides, printWidth, singleQuote

### Community 61 - "production"
Cohesion: 0.22
Nodes (9): serve, production, budgets, buildTarget, outputHashing, serviceWorker, builder, configurations (+1 more)

### Community 62 - "angular.json"
Cohesion: 0.29
Nodes (6): cli, analytics, newProjectRoot, projects, $schema, version

### Community 63 - "architect"
Cohesion: 0.40
Nodes (5): extract-i18n, test, builder, architect, builder

### Community 64 - "ministry-assistanto"
Cohesion: 0.40
Nodes (5): prefix, projectType, root, sourceRoot, ministry-assistanto

## Knowledge Gaps
- **258 isolated node(s):** `Paso 1 — Analizar la tarea`, `Regla de feature completa`, `ArchitectureGuardian — modo silencioso permanente`, `Paso 3 — Leer los archivos de agentes activos`, `Paso 4 — Anunciar y responder` (+253 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `time-entry.module.ts`, `package.json`, `app-module.ts`, `BackupReminderService`, `layout.ts`, `MonthPaginatorComponent`, `OptionPillGroupComponent`, `time-entry.facade.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `TimeEntryListComponent` connect `TimeEntryListComponent` to `CourseVisit`, `time-entry.module.ts`, `time-entry.facade.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `TimeEntryFacade` connect `CourseVisit` to `time-entry.module.ts`, `time-entry.facade.ts`, `layout.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `Paso 1 — Analizar la tarea`, `Regla de feature completa`, `ArchitectureGuardian — modo silencioso permanente` to the rest of the system?**
  _258 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CourseVisit` be split into smaller, more focused modules?**
  _Cohesion score 0.056910569105691054 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._