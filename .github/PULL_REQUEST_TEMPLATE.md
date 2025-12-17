# Summary

<!-- Short, one-paragraph summary of the change and its purpose. -->

What changed and why: (1-2 sentences)

---

## Type of change
- [ ] feat (new feature)
- [ ] fix (bug fix)
- [ ] docs (documentation only)
- [ ] style (formatting, no code change)
- [ ] refactor (code change that neither fixes a bug nor adds a feature)
- [ ] perf (improves performance)
- [ ] test (adds missing tests or fixes existing tests)
- [ ] chore (build or tooling change)

---

## Related issues
- Fixes #<issue-number> (if applicable)
- Related to: (link PRs or issues)

---

## Implementation notes
- Brief notes about the approach and important design decisions, architectural trade-offs, or patterns used (CLEAN, facades, repository adapters, etc.).
- Mention files and locations changed, especially if the change affects domain/data/presentation layers.

---

## How to test / QA
- Commands: 
  - npm ci
  - npm run i18n:check  # verify translation key parity across locales
  - npm test
  - npm run build
- Manual QA steps (if UI): how to reproduce and the expected behavior.

---

## Release notes
- One-line summary suitable for CHANGELOG or releases (e.g., `feat(i18n): add runtime translations for time-entry feature`)

---

## Suggested reviewers
- Add one or two reviewers who are familiar with the feature or area changed (e.g., `@team/frontend`, `@owner/time-entry`)

---

## Checklist (required before requesting review)
- [ ] Tests pass locally (`npm test`) and CI is green
- [ ] Build passes (`npm run build`)
- [ ] New/updated tests added for core logic or regressions
- [ ] Code follows the CLEAN-inspired layout and files are in appropriate feature folders (presentation / facade / domain / data)
- [ ] i18n: locale keys added/updated and `npm run i18n:check` passes
- [ ] Accessibility: added labels/aria attributes where relevant and updated tests cover them
- [ ] Documentation updated (README, `.github/copilot-instructions.md`, or relevant docs)
- [ ] Small, focused commits with clear messages (optionally squash before merge)
- [ ] Add migration notes if this change requires a migration or user action

---

## Reviewer guidance
- Focus on business logic correctness and edge cases (e.g., date handling, unique-person counting for course visits)
- Check i18n coverage and that keys are namespaced consistently (e.g., `feature.section.key`)
- Verify tests sufficiently cover the feature surface and meaningful edge-cases
- Check for accessibility regressions and test with `aria-*` attributes included

---

## Screenshots / Recordings (optional)
If this is a UI change, include before/after screenshots or a short recording.

---

Thanks for the PR! Leave a comment if you want me to rebase/squash the branch before merging or to add extra tests. 🙏
