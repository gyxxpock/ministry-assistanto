# Copilot / AI Assistant Instructions for MinistryAssistanto

Purpose: short, actionable guidance so an AI agent can be immediately productive in this repo.

## Quick start ✅
- Install deps: `npm install` (uses devDependencies in `package.json`)
- Start dev server: `npm start` (alias for `ng serve`) → open http://localhost:4200/
- Run unit tests: `npm test` (Karma + Jasmine)
- Build production: `npm run build` (outputs to `dist/`)

## Project overview 🔧
- This is a small Angular application scaffolded with Angular CLI (Angular v20.x).
- Entry points:
  - `src/main.ts` — bootstraps `AppModule`.
  - `src/app/app-module.ts` — root NgModule and `bootstrap: [App]`.
  - `src/app/app.ts` — main `App` component (uses Angular `signal()` API).
  - `src/app/app-routing-module.ts` — app routes (currently empty).
  - `src/app/app.html` & `src/app/app.scss` — component template and styles (template is the generated placeholder).
- Configuration files: `package.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`.

## Important conventions & patterns 🧭
- Architecture: CLEAN-inspired, feature-scoped scaffold. Group feature code under `src/app/<feature>/` with logical layers: `presentation/` (components, templates, modules), `domain/` (use-cases, models), `data/` (services, adapters), and `facade/` (facades that expose a simple public API for the feature). Example layout:
  - `src/app/feature-x/presentation/feature.component.ts`
  - `src/app/feature-x/facade/feature.facade.ts` (single API for component wiring)
  - `src/app/feature-x/domain/feature.usecase.ts`
  - `src/app/feature-x/data/feature.service.ts`
  Prefer this layout when adding new features and reflect it in PR descriptions.
- Use Angular CLI for scaffolding: `ng generate component <name>` (updates modules by default unless `--standalone` is used).
- Component patterns: the app currently uses NgModules (App component has `standalone: false`). Be consistent — if you introduce standalone components, document them in PRs.
- Reactive primitives: this repo uses Angular signals (`signal` import in `src/app/app.ts`). Prefer signal/state APIs for small local state.
- Global styles: `src/styles.scss` (Sass). Component styles use `.scss` files.
- Prettier settings are defined in `package.json` (printWidth: 100, singleQuote: true, HTML parser: angular) — follow or run Prettier on changed files.

## Tests & CI notes ⚙️
- Unit tests run with Karma + Jasmine (`npm test`).
- There is no e2e test framework in the repo; if you add one, include setup and a sample test in CI.

## Debugging tips 🐞
- Use `npm start` and watch console output for compilation/runtime errors.
- Browser console logs are useful — `AppModule` already registers `provideBrowserGlobalErrorListeners()`.
- After dependency changes run `npm install` and `npm run build` to catch compilation issues.

## Examples & common edits (copy-paste friendly) 💡
- Add a new route: edit `src/app/app-routing-module.ts` and add a route object; then lazy-load or import a component/module depending on pattern.
- Add a new component: `ng generate component feature/foo` (or `--standalone` if intended).
- Change app title: edit `title` signal in `src/app/app.ts`.

## What NOT to change without confirmation ⚠️
- The generated placeholder markup in `src/app/app.html` — it’s ok to replace when implementing UI, but large cosmetic changes should be reviewed.
- Angular major version change: update `package.json` and test build & tests locally before opening a PR.

## Notes for AI agents 🤖
- Keep changes minimal and well-scoped; include unit tests for behavior changes when feasible.
- When the change touches build or dev scripts, run `npm install` and `npm run build` locally to verify.
- Reference the exact files mentioned above in PR descriptions and describe the reasoning for architectural changes.

## Communication preferences 💬
- **User language:** The project uses English as the primary language for code, comments, commit messages, and PR descriptions. However, the user may submit requests in Spanish.
- **Assistant language:** When the user writes in Spanish, reply in **English**. Keep replies concise, professional, and focused on actionable changes. If the user specifically requests responses in another language, confirm and follow their instruction.

## Internationalization & Language 🌐
- **Primary language:** English. All code, comments, commit messages, and PR descriptions should use English as the main language.
- **UI translation best practices:**
  - Avoid hard-coded user-facing strings in templates; use Angular's i18n attributes or a runtime translation library (e.g., `ngx-translate`) so UI text can be translated later.
  - Recommended file layout:
    - Compile-time Angular i18n extraction: keep message files in `src/i18n/` (e.g., `src/i18n/messages.xlf`).
    - Runtime JSON translations: keep per-locale files in `src/assets/i18n/` (e.g., `src/assets/i18n/en.json`, `src/assets/i18n/es.json`).
  - Example approaches:
    - Angular i18n: `<h1 i18n>Ministry Assistanto</h1>`
    - ngx-translate: `<h1>{{ 'app.title' | translate }}</h1>` with `src/assets/i18n/en.json` containing `{ "app": { "title": "Ministry Assistanto" } }`
  - Use consistent, namespaced translation keys (for example: `home.welcome`, `nav.login`). Prefer descriptive keys when using key-based JSON files.
  - Treat English as the source locale; include English translations and keep parity across locales. Consider adding a CI check (or script) to detect missing keys between language files.
- **Testing & QA:**
  - Add unit tests for translation pipes/services when logic depends on translations.
  - Verify UI layouts with translated strings (longer text, RTL locales) during visual QA.

## PR checklist & conventions 📋
- Verify CLEAN folder layout (presentation/facade/domain/data).
- **Verify unique course counting:** ensure month totals count unique persons (personId preferred, normalized personName fallback).
- **Verify hours include course visits:** monthly total must include durations from both `TimeEntry` and `CourseVisit` records.
- Add/modify tests that cover new business logic.
- Run `npm test` and `npm run build`.
- Ensure no hard-coded UI strings (use i18n keys).
- Small, focused commits with descriptive messages: `feat(time-entry): add time-entry form with local persistence`.
- If adding new dependencies, include reason in PR description.

---
If anything is unclear or you want more specific guidance (routing pattern, standalone components, test coverage target), tell me which area to expand and I’ll iterate. Thanks!