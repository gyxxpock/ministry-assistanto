---
doc_type: onboarding
module: root
status: draft
generated_by: human-docs-agent
sources:
  - src/app
---

# Module tour

A map of the top-level modules under `src/app/`. Each module follows the Clean
Architecture layering described in [Architecture overview](../architecture/overview.md)
(`domain/`, `data/`, `facade/`, `presentation/` where applicable).

Per-module detail docs are **not** hand-written here — run `/docs feature <module>` to
generate/refresh the AI-context and narrative docs for a specific module on demand.

| Module | One-line summary |
|--------|-------------------|
| `time-entry` | Core time-tracking feature: log, list, calendar, export/import. Owns the module-level navigation shell (Layout). Docs via `/docs feature time-entry`. Full page: [`curated/modules/time-entry.md`](../modules/time-entry.md). |
| `goals` | Monthly goal tracking, lazy-loaded as a child of `time-entry`. Docs via `/docs feature goals`. Full page: [`curated/modules/goals.md`](../modules/goals.md). |
| `planning` | Weekly/monthly planning — domain, data, facade, and UI. Docs via `/docs feature planning`. Full page: [`curated/modules/planning.md`](../modules/planning.md). |
| `shared` | Cross-feature reusable pieces (VMs, pipes, utilities) with no ownership of a single feature's state. Docs via `/docs feature shared`. |
| `core` | App-wide singletons — theming (`ThemeService`), i18n bootstrap, root providers. Docs via `/docs feature core`. |

See [AGENTS.md](../../../AGENTS.md) for which subagent owns which module's layer.
