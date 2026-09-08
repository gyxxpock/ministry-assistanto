# TestingAgent

Transversal role. Defines the testing strategy per layer and writes specs that are coherent
with the project's architecture. Stack: Karma + Jasmine.

## Existing spec files

```
domain/
  time-entry.usecase.spec.ts       ← use case tests
  time-entry.integration.spec.ts   ← domain integration tests

data/
  time-entry.dexie.spec.ts         ← Dexie repository tests
  time-entry.export.spec.ts        ← export tests

facade/
  time-entry.facade.spec.ts        ← facade tests
  time-entry.exporter.spec.ts      ← exporter tests

presentation/
  time-entry-list.component.spec.ts
  time-entry-calendar.spec.ts
  layout.spec.ts
core/
  i18n/translate.spec.ts
```

> **Orientation**: run `graphify query "<question>"` to understand which files to cover before reading specs or existing source.

## Strategy per layer

### Domain — pure tests, no Angular TestBed

```typescript
// DO NOT use TestBed in domain specs
it('should count unique courses', () => {
  const entries = [makeEntry('Math'), makeEntry('Math'), makeEntry('Science')];
  expect(countUniqueCourses(entries)).toBe(2);
});
```
- No `@Injectable`, no Angular mocks. Pure TypeScript only.
- Use cases are instantiated with `new UseCase(mockRepo)` where `mockRepo` implements the interface.

### Data — integration tests with real Dexie (unique DB name per test)

```typescript
// Use a unique DB name per test — this project uses Karma (real browser), NOT fake-indexeddb
const db = new GoalsDB(`test-db-${Math.random().toString(36).slice(2)}`);
```
- **Do NOT mock Dexie** — test against a real instance with a unique name per test.
- Clean up in `afterEach`: `await db.delete()`.
- **IMPORTANT**: This project runs Karma (browser environment). Do NOT use `fake-indexeddb`
  even if older docs mention it. The established pattern (from `time-entry.dexie.spec.ts`)
  is a unique DB name per test + `afterEach: db.delete()`.
- Verify that version migrations work with pre-existing data.

### Facade — mock ITimeEntryRepository

```typescript
const mockRepo: jasmine.SpyObj<ITimeEntryRepository> =
  jasmine.createSpyObj('ITimeEntryRepository', ['findByMonth', 'save', 'delete']);

// Inject via TestBed with the correct token
providers: [{ provide: TIME_ENTRY_REPOSITORY_TOKEN, useValue: mockRepo }]
```
- The Facade is tested with `TestBed` but with the repository as a spy.
- Do not call real Dexie in Facade tests.

### Presentation — TestBed with mocked Facade

```typescript
// Mock the full Facade, not its internal dependencies
const mockFacade = jasmine.createSpyObj('TimeEntryFacade', ['loadMonth', 'addEntry']);
providers: [{ provide: TimeEntryFacade, useValue: mockFacade }]
```
- Use `NO_ERRORS_SCHEMA` with care — prefer real Material imports when relevant to the test.
- Component tests verify: correct rendering, Facade calls, user events.

## Conventions

- File name: `*.spec.ts` next to the file it tests.
- Describe in English (Jasmine convention); failure messages in Spanish if it helps context.
- One `it` per behavior, not per method.
- Use `factory functions` (`makeEntry()`, `makeMonth()`) to build reusable test data —
  do not repeat inline literals.

## Warning signs

- A `domain/` spec imports `TestBed` → unnecessary, domain tests are pure TypeScript.
- A `data/` spec mocks Dexie instead of using a real instance → false positives.
- A `presentation/` spec directly injects `DexieTimeEntryRepository` → layer violation
  in the test itself.

## Coverage mandate

**Rule:** Every implementation that adds or modifies logic must include its spec file in the same commit/PR.

- **Minimum acceptable:** 90% line coverage on touched files
- **Goal:** 100% when the file contains pure logic (functions, computed, business rules)
- **No exceptions:** An issue is not considered closed if new files have no spec

### What to test per file type

| Type | What to cover | Priority |
|------|--------------|---------|
| Services with logic (`isReminderDue`, computed) | All edge cases, dates, flags | HIGH |
| Pure functions (`date.utils.ts`) | All valid and invalid inputs | HIGH |
| Components with getters/filters | Each getter with test data | HIGH |
| Infrastructure services (SwUpdate, HTTP) | Happy path + error path | MEDIUM |
| Simple presentational components | Correct rendering, emitted outputs | LOW |

### Mock conventions for this project

- `localStorage`: mock with `spyOn(window.localStorage, 'getItem')` / `setItem`
- `SwUpdate`: `jasmine.createSpyObj('SwUpdate', [], { versionUpdates: EMPTY })` — use `EMPTY` from rxjs for the empty Observable
- `HttpClient`: `HttpClientTestingModule` from `@angular/common/http/testing`
- Angular core services (`TranslateService`): spy object with the used methods
- `navigator.serviceWorker`: `spyOnProperty(navigator, 'serviceWorker').and.returnValue({...} as unknown as ServiceWorkerContainer)`

### Services with async work in the constructor

When the constructor starts async work (`Promise`, `navigator.serviceWorker.ready`, `setTimeout`, etc.),
the service **MUST** be injected inside `fakeAsync`, not in `beforeEach`:

```typescript
// ❌ BAD — the Promise resolves outside the fakeAsync zone
beforeEach(() => {
  service = TestBed.inject(MyService); // Promise runs here, outside the zone
});
it('...', fakeAsync(() => {
  flushMicrotasks(); // drains nothing — already resolved before
}));

// ✓ GOOD
beforeEach(() => {
  TestBed.configureTestingModule({...}); // configure only, do not inject
});
it('...', fakeAsync(() => {
  const service = TestBed.inject(MyService); // constructor runs inside the zone
  flushMicrotasks(); // correctly drains the Promise
}));
```

**Warning sign**: constructor calls `.then()` or `Promise.resolve()` → inject inside `fakeAsync`, not in `beforeEach`.

### Warning signs in PRs

- New `.ts` files without a sibling `.spec.ts` → block the PR
- Empty `it` blocks or `expect(true).toBe(true)` → does not count as coverage
- Tests that pass even when behavior is incorrect (mocks that never fail) → review assertions

### Enforcement flow

1. **Pre-commit hook** (`.git/hooks/pre-commit`): blocks the commit if `.ts` files are modified and coverage drops below 90%. Runs `ng test --no-watch --code-coverage --browsers=ChromeHeadless`.
2. **Report in issue**: when closing an issue, `issues.sh close` automatically includes the coverage table in the closing comment (reads `coverage/coverage-summary.json`).
3. **Generate report manually**: `npx ng test --no-watch --code-coverage` generates `coverage/coverage-summary.json` and `coverage/html/index.html`.
