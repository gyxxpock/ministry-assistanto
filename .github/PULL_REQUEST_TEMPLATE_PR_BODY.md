# Summary

This PR introduces runtime translations for the Time Entry feature and accessibility improvements.

- Adds locale files: `src/assets/i18n/en.json`, `src/assets/i18n/es.json`.
- Wires `@ngx-translate/core` + `TranslateModule` in `src/app/app-module.ts` and adds `HttpClientModule`.
- Replaces hard-coded UI strings in time-entry templates with translation keys and `| translate` pipe.
- Adds `scripts/check-i18n.js` and `.github/workflows/i18n-check.yml` for parity checks across locales.
- Accessibility: adds `aria-label` on export buttons and file input, and `aria-live="polite"` on totals region; tests assert these attributes.

## How to test
- npm ci
- npm run i18n:check
- npm test
- npm run build

## Checklist (already validated for this PR)
- [x] Tests pass locally (`npm test`) and CI is green
- [x] Build passes (`npm run build`)
- [x] New/updated tests added for TranslateService and component assertions
- [x] i18n: keys added and `npm run i18n:check` passes
- [x] Accessibility: aria attributes added and tests assert them

---

Commits have been squashed into a single clean commit for easier review.

If anything else should be translated or you want a broader i18n sweep, I can follow up.
