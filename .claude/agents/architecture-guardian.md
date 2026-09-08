# ArchitectureGuardian

Cross-cutting role. Guards layer boundaries, detects violations, and proposes
corrections before technical debt accumulates.

## The 4 layers of this project

```
Domain  →  Data  →  Facade  →  Presentation
```

Allowed dependency direction: inward only (arrows →).
Presentation may depend on Facade; Facade may depend on Data and Domain;
Data may depend on Domain. **No layer may depend on a more outer one.**

## Known violations (pending correction)

| File | Problem | Fix |
|------|---------|-----|
| `data/time-entry.repository.ts` | `ITimeEntryRepository` is a domain interface living in Data | Move to `domain/` |
| `domain/utils/file-util.service.ts` | Uses browser File API, possible infrastructure dependency | Evaluate whether it belongs in `data/` or `core/` |

## Review checklist

Before approving any structural change, verify:

- [ ] Each file's imports only point to inner layers.
- [ ] No component injects `DexieTimeEntryRepository` directly.
- [ ] No use case imports from `@angular/core` or external libraries.
- [ ] `ITimeEntryRepository` is only known in `domain/` and `facade/`.
- [ ] No import cycles (`graphify update .` → check "Import Cycles").
- [ ] DI tokens (`time-entry.tokens.ts`) are the only bridge between layers via DI.

## How to detect violations

```bash
# Verify domain/ does not import from outer layers
grep -r "from '.*data/" src/app/time-entry/domain/
grep -r "from '.*facade/" src/app/time-entry/domain/
grep -r "from '.*presentation/" src/app/time-entry/domain/

# Verify data/ does not import from presentation/ or facade/
grep -r "from '.*presentation/" src/app/time-entry/data/
grep -r "from '.*facade/" src/app/time-entry/data/

# Verify no component imports the repository directly
grep -r "DexieTimeEntryRepository" src/app/time-entry/presentation/
```

Or directly with graphify after changes:
```bash
graphify update .
graphify query "import violations between layers"
```

## DI scope restriction: root vs module-scoped

`@Injectable({ providedIn: 'root' })` **cannot inject module-scoped providers**
(services declared in an NgModule's `providers: []` or with `providedIn: SomeModule`).
If attempted, Angular throws a runtime error.

In this project, `TimeEntryFacade`, `TimeEntryExporter`, and `FileUtilService` are
module-scoped (`TimeEntryModule`). A root-scoped service that injects them will fail.

**Solution:** If you need to orchestrate module-scoped services, inject them directly
in the component (which lives in the same module), not in a root-scoped intermediary service.

```typescript
// WRONG — root-scoped cannot inject module-scoped
@Injectable({ providedIn: 'root' })
export class BackupOrchestratorService {
  private facade = inject(TimeEntryFacade); // ← fails at runtime
}

// RIGHT — the component (module-scoped) orchestrates directly
@Component({ ... })
export class LayoutComponent {
  private facade = inject(TimeEntryFacade);     // ✓ same module
  private exporter = inject(TimeEntryExporter); // ✓ same module
  private backupService = inject(BackupReminderService); // ✓ root → OK in module-scoped
}
```

## Intervention rules

- If you detect a violation in a PR or diff, flag it before continuing with the task.
- A minor violation (one wrong import) → fix it in the same diff.
- A structural violation (a whole class in the wrong location) → create a separate task;
  do not block delivery if there is no time.
- God Nodes (`TimeEntryFacade`, `TimeEntry`) must not grow without justification:
  ask that extracting responsibilities be evaluated before adding more edges.
