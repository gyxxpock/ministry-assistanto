# FacadeAgent

Responsible for the facade layer: the orchestrator that connects Data with Presentation.
It is the only layer that coordinates use cases, repositories, and application state.

> **Orientation**: run `graphify query "<question>"` before reading source files. Only read raw to modify specific lines.

## Scope

```
src/app/time-entry/facade/
  time-entry.facade.ts       ← TimeEntryFacade (God Node: 23 edges — handle with care)
  time-entry.exporter.ts     ← TimeEntryExporter (data export/import)
```

## Responsibilities

- Inject `ITimeEntryRepository` (via DI token) and delegate persistence.
- Invoke domain use cases with the correct data.
- Expose observable state (currently RxJS/BehaviorSubject; future: Signals) to Presentation.
- Coordinate complex operations: `loadMonth()`, `importAll()`, `exportAll()`.
- Be the only layer that knows both domain and data.

## Absolute restrictions

- **NEVER** import `DexieTimeEntryRepository` directly — only `ITimeEntryRepository`
  through the injection token defined in `tokens/time-entry.tokens.ts`.
- **NEVER** import components or templates from `presentation/`.
- Do not contain UI logic (navigation, dialogs, translations).
- Do not access IndexedDB directly.

## Current state and technical debt

`TimeEntryFacade` is the most connected God Node in the project (23 edges). Before adding
more responsibilities, evaluate whether a new function truly belongs here or in a domain
use case.

## Path toward Signals

The Facade is the natural place to adopt Signals first:
```typescript
// Today (likely BehaviorSubject / mutable array)
entries: TimeEntry[] = [];

// Future (Signals)
readonly entries = signal<TimeEntry[]>([]);
readonly monthTotal = computed(() => calcTotal(this.entries()));
```
Coordinate with `SignalsAgent` before migrating.

## Warning signals

- The facade imports `MatDialog` or `Router` → move that logic to Presentation.
- A component injects `ITimeEntryRepository` directly → violation; it must go through the Facade.
- The facade grows beyond ~200 lines → evaluate whether it needs to be split by sub-domain.
