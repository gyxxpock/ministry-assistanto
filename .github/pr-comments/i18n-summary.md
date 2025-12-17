Summary of changes added in this PR:

- i18n: added runtime locale files `src/assets/i18n/en.json` and `src/assets/i18n/es.json` (keys for all time-entry UI strings).
- Runtime wiring: installed `@ngx-translate/*`, configured `TranslateModule.forRoot()` in `src/app/app-module.ts`, and added `HttpClientModule`.
- Templates: replaced hard-coded strings in time-entry templates with translation keys and `| translate` pipe.
- Tests: added smoke test for `TranslateService` and updated component tests to set/use translations so they remain deterministic in CI.
- Export/Import accessibility: added `aria-label` to export buttons and file input, and `aria-live="polite"` + `aria-label` on totals region.
- Scripts & CI: added `scripts/check-i18n.js` and `npm run i18n:check` to validate that locale files have matching keys; added GitHub Actions workflow `.github/workflows/i18n-check.yml` that runs the check on PRs and pushes to `main`.

How to run locally:
- npm ci
- npm run i18n:check  # verifies keys across locales
- npm test && npm run build  # existing validation

Notes / next steps:
- I added ARIA labels and tests that assert their presence; if you want, I can extend coverage (more keys, more components) or add a CI step that verifies translated values are not placeholders.

If you want, I can also squash or rework commits before marking this ready for review. Let me know which follow-up you'd prefer.
