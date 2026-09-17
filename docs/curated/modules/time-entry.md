---
doc_type: module-narrative
module: time-entry
status: draft
generated_by: human-docs-agent
sources:
  - src/app/time-entry/domain/models.ts
  - src/app/time-entry/domain/i-time-entry.repository.ts
  - src/app/time-entry/facade/time-entry.facade.ts
  - src/app/time-entry/presentation/time-entry.module.ts
  - src/app/time-entry/presentation/components/layout/layout.ts
  - src/app/time-entry/presentation/components/settings/settings.component.ts
  - src/app/time-entry/presentation/components/time-entry-list/time-entry-list.component.ts
  - src/app/time-entry/presentation/components/time-entry-form/time-entry-form.component.ts
  - src/app/time-entry/presentation/components/time-entry-calendar/time-entry-calendar.ts
  - docs/generated/architecture/known-violations.md
  - .claude/agents/architecture-guardian.md
  - .claude/agents/ui-agent.md
  - .claude/agents/data-agent.md
---

# Module: time-entry

> This is the narrative companion to the `time-entry` row in
> [module-tour.md](../onboarding/module-tour.md). It explains *why* and *how it
> feels to use* — for the layer-by-layer structure and public API, see
> [Where to go next](#where-to-go-next) below.

## Purpose

`time-entry` is the foundation the other two modules covered here are built on:
it is where a user actually records ministry activity — ordinary field-service
time (`TimeEntry`, typed `preaching | study | visiting | other`) and Bible-course
visits (`CourseVisit`), plus a manually-entered monthly course count
(`MonthlyCourseCount`). Every hour that `goals` evaluates and `planning` projects
against ultimately comes from this module's `ITimeEntryRepository`. Unlike
`goals` and `planning`, which are single-purpose and lazy-loaded as children,
`time-entry` is the app's root feature: it is the one module lazy-loaded
directly from `AppRoutingModule`, and it owns `Layout` — the stateful shell with
the scroll-aware floating navigation, header opacity, and update/backup banners
that `goals` and `planning` both render inside of. That ownership is why
`architecture-guardian.md` treats any new feature's navigation placement as a
`time-entry` structural concern first (see Gotchas).

Because it's the oldest and most-used module, it also carries the most UI
surface and the most day-to-day editing affordances: a list view, a calendar
view, a settings page, and JSON export/import for backup — all built around one
`TimeEntryFacade` that every other component and both child feature modules
depend on for the current entries/visits/totals.

## Key flows

**Logging an entry.** `TimeEntryFormComponent` is a reusable form (used both
inline and inside `TimeEntryEditDialogComponent`) that emits `save` with either
a `CreateTimeEntryVM` or `UpdateTimeEntryVM` — it never talks to the facade
itself. The container calls `TimeEntryFacade.addEntry()`, which has a quiet but
important merge behavior: if an entry for the same date *and* type already
exists, it calls `mergeTimeEntry()` and updates that entry instead of creating a
duplicate, rather than allowing two "preaching" rows on the same day. Every
mutating facade method (`addEntry`, `updateEntry`, `removeEntry`, `addVisit`,
`updateVisit`, `removeVisit`, `importAll`) ends by calling `loadMonth()` again,
so the whole visible month is always re-fetched rather than patched locally.

**Browsing by list or calendar.** `TimeEntryListComponent` and
`TimeEntryCalendarComponent` are two independent presentations of the same
`TimeEntryFacade.entries`/`totals` state for the current month; the calendar
additionally respects `WeekStartService` (`WEEK_DAY_INDEX`) so the grid's first
column matches the user's Monday/Sunday/Saturday preference from Settings.
Tapping a day opens the same edit dialog used from the list.

**Backing up and restoring data.** From either the list view's toolbar
(`handleExport()`/`handleImport()`) or the `Layout` shell's reminder banner
(`handleBannerBackup()`), the user can export everything via
`TimeEntryFacade.exportAll()` piped through `TimeEntryExporter.generateJSON()`
and downloaded via `FileUtilService`, or import a previously exported file back
in through `importAll()`. `BackupReminderService` (injected into `Layout`)
tracks when the last backup happened and surfaces a due-reminder banner
independently of any single component remembering to ask.

**Adjusting preferences.** `SettingsComponent` is a flat, no-facade settings
screen — theme mode, backup reminder frequency, and week-start day are each
their own injected service (`ThemeService`, `BackupReminderService`,
`WeekStartService`) rather than routed through `TimeEntryFacade`, since none of
them are time-entry domain state; they're app-wide preferences that happen to
live under this module's route.

## Gotchas

- **`time-entry` owns the navigation shell — any new feature needing the
  floating nav must become a lazy child of `TimeEntryModule`, not a sibling
  route.** This is the module-level lesson `architecture-guardian.md` and
  `ui-agent.md` both document from the 2026-09-08 incident (`goals` was the
  feature that first hit this). If you're adding a new route here, check both
  docs' "Correct structure" / "✅ CORRECT PATTERN" diagrams before wiring the
  router.
- **`TimeEntryListComponent` is already large and growing.**
  `ui-agent.md`'s warning signs call out this exact component by name: "if
  `TimeEntryListComponent` grows further → consider sub-components." It
  currently owns export, import, share-report formatting, and restore
  confirmation state in addition to list rendering — a natural next split
  before adding more responsibilities.
- **The Facade/Presentation boundary here was fixed once already — don't
  regress it.** Per
  [known-violations.md](../../generated/architecture/known-violations.md)'s
  "Resolved since last review" section, `TIME_ENTRY_REPOSITORY` and the
  Facade's VM types (`CreateTimeEntryVM`, `TimeEntryVM`, `UpdateTimeEntryVM`)
  both used to live under `presentation/` and were imported *outward* by the
  Facade — a Facade→Presentation dependency. They now live at
  `time-entry.tokens.ts` and `facade/time-entry.vm.ts` respectively. New VM
  types belong in `facade/`, not `presentation/models/`.
- **`| date:` formatting does not react to a runtime language switch.**
  `ui-agent.md`'s first documented trap applies directly to a module this
  date-heavy (list, calendar, form all format dates); if a displayed date
  looks stale after switching language without a reload, this is the known
  cause, not a new bug.
- **Every mutation reloads the whole month.** There's no optimistic local
  patch in `TimeEntryFacade` — `addEntry`/`updateEntry`/`removeEntry`/`addVisit`/
  `updateVisit`/`removeVisit`/`importAll` all end in a full `loadMonth()`
  re-fetch. This keeps the facade simple and consistent but means a rapid
  sequence of edits (e.g. programmatic import of many entries) will re-query
  Dexie once per call unless the caller batches first — worth knowing before
  optimizing a slow bulk-import path.

## Where to go next

- Generated structural overview and AI-context for this module have not been
  generated yet — run `/docs feature time-entry` to produce
  `docs/generated/modules/time-entry/overview.md` and
  `docs/generated/ai/time-entry/context.md`.
- [Known violations (generated)](../../generated/architecture/known-violations.md) —
  no open violation entries for `time-entry` as of the last pass; see the
  "Resolved since last review" history cited above.
- There is no standalone `feature/*.md` write-up for `time-entry` (only `goals`
  and `plan` have one under `feature/`).
