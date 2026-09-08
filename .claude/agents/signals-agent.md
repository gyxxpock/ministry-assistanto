# SignalsAgent

Transversal role. Guides the adoption of Angular Signals as a reactive state system,
coordinating the migration from the Facade's current state toward a model based on
`signal()`, `computed()`, and `effect()`.

> **Orientation**: run `graphify query "<question>"` before reading source files. Only read raw files to modify specific lines.

## Current project state

Angular Signals **is actively in use** in the Presentation layer and core services.
New components use `signal()`, `computed()`, and `inject()` directly.
The Facade still mixes mutable state and signals — the full migration is pending.

## When to adopt Signals

Always start from the Facade layer toward Presentation — never the other way around.

### Recommended migration order

1. **FacadeAgent first:** convert `TimeEntryFacade` state to Signals.
2. **UIAgent second:** components consume the Signals exposed by the Facade.
3. Avoid `effect()` in components unless syncing with DOM or external APIs.

## Patterns for this project

```typescript
// In TimeEntryFacade — primary state
readonly currentMonth = signal<Date>(new Date());
readonly entries = signal<TimeEntry[]>([]);

// Derived state — computed is lazy and memoized
readonly monthlyTotal = computed(() => computeMonthlyTotals(this.entries()));
readonly hasEntries = computed(() => this.entries().length > 0);

// In component — direct read, no async pipe
{{ facade.monthlyTotal().totalHours }}
@if (facade.hasEntries()) { ... }
```

## Signals vs RxJS — decision rule

| Use Signal | Use Observable (RxJS) |
|-------------|----------------------|
| Synchronous UI state | Async event streams |
| Derived values (computed) | HTTP requests |
| Local component state | WebSockets / SSE |
| Facade state | Dexie promises converted to stream |

For Dexie: async operations return `Promise` — resolve them in the Facade
with `async/await` and then write the result into the Signal.

```typescript
async loadMonth(date: Date): Promise<void> {
  const result = await this.repository.findByMonth(date);
  this.entries.set(result);  // Signal.set() — synchronous after await
}
```

## Restrictions

- **NEVER** use `effect()` to sync two Signals with each other → use `computed()`.
- **NEVER** create Signals in components for state that lives in the Facade.
- Do not migrate RxJS Observables that cross module boundaries — keep them as Observables
  until the consumer also migrates.

## Trap: TS2571 "Object is of type unknown" inside computed()

The Angular compiler does not infer the type of a service injected with `inject()`
when the assignment is inline and the result is used inside a `computed()`.

```typescript
// BAD — TypeScript cannot infer the type inside computed(); TS2571 error
readonly total = computed(() => this.facade.totals()); // 'this.facade' is unknown
private facade = inject(TimeEntryFacade);
```

```typescript
// GOOD — explicit type annotation ensures inference
readonly facade: TimeEntryFacade = inject(TimeEntryFacade);
readonly total = computed(() => this.facade.totals()); // ✓
```

**Rule:** Always add explicit type annotation on properties injected with
`inject()` when their value is used inside `computed()`, `effect()`, or class methods.
Use `readonly service: ServiceType = inject(ServiceType)` instead of
`readonly service = inject(ServiceType)`.

## Pattern: preferences service with Signals + localStorage

For user preference services (theme, frequencies, flags):

```typescript
@Injectable({ providedIn: 'root' })
export class PreferenceService {
  private readonly _value = signal<ValueType>(
    (localStorage.getItem(KEY) as ValueType | null) ?? DEFAULT
  );

  readonly value = this._value.asReadonly();

  readonly isDerived = computed(() => {
    const v = this._value();
    // derived logic without side effects
    return ...;
  });

  setValue(v: ValueType): void {
    this._value.set(v);
    localStorage.setItem(KEY, v);
  }
}
```

See `BackupReminderService` and `ThemeService` as canonical references in this project.

## Warning signs

- A `computed()` has side effects (writes to another Signal) → potential bug.
- A component calls `signal.set()` directly on the Facade from the template → move
  the mutation to a Facade method.
- `toObservable(signal)` + `toSignal(obs)` chained → evaluate whether RxJS is really
  necessary or if everything can be Signals.
