---
doc_type: adr
module: goals
adr_number: 2
status: proposed
date: 2026-09-17
supersedes: null
superseded_by: null
generated_by: human-docs-agent
sources: []
---

# ADR-0002: Monthly vs. daily prorating granularity in goal progress calculation

## Status

Proposed

## Context

The Goals feature (`src/app/goals/domain/goal.usecase.ts`) computes progress to
date (`progress-to-date`) and a status badge (`on-track` / `behind-in-margin` /
`out-of-margin`) for both `regular`-type goals (regular pioneer, 600h/year goal)
and `auxiliary` goals (auxiliary pioneer). The calculation is based on counting
complete calendar months, not on day-level prorating:

- `monthsElapsedInServiceYear(sy, currentDate)` (lines 22-28): computes
  `elapsed = (cy*12+cm) - (sy.startYear*12 + sy.startMonth) + 1`, clamped to `[0,12]`.
  This counts the CURRENT calendar month as 100% elapsed from its very first day.
- `countActiveMonths(...)` (lines 55-81) derives `activeMonthsElapsed` from that
  same complete-month count — it is always an integer, never fractioned by day.
- `computeRegularGoalProgress` / `computeAuxiliaryGoalProgress` (lines 126-203) derive
  `targetToDate = round2(targetHours * activeMonthsElapsed / totalActiveMonths)` and
  `projection = (accumulated/activeMonthsElapsed) * totalActiveMonths` directly from
  that complete-month value.
- `computeStatus` (lines 87-97) classifies as `on-track` if `projection >= target`,
  `behind-in-margin` if `projection >= margin` (margin = target * 560/600), or
  otherwise `out-of-margin`.

**Concrete reproduction** (regular pioneer, service year starting in
September 2026 (service year '2027', labeled by the year it ends),
current date = 17-Sep-2026, 33h logged):

- Current behavior (with the bug): `activeMonthsElapsed=1` (all of September is
  counted as elapsed even though only 17 of 30 days have passed), `totalActiveMonths=12`,
  `targetHours=600`, `targetToDate=50`, `hoursDifference = 33 - 50 = -17`,
  `projection = (33/1)*12 = 396`, `margin = 560` → since `396 < 560`,
  `status = 'out-of-margin'`.
- Alternative with daily prorating (prorating the current month by day of month
  instead of treating it as 100% elapsed): `targetToDate ≈ 50 * (17/30) ≈ 28.33`,
  `hoursDifference ≈ 33 - 28.33 ≈ +4.67` — this would show the user as ahead of the
  expected pace, not "out of margin".
- This produces a false "out-of-margin" badge negative and a misleading negative
  `hoursDifference` during the first days of any month, for any goal.

**Scope**: this affects BOTH goal types, `regular` and `auxiliary`, and recurs at
the START OF EVERY calendar month (it is not limited to mid-year enrollment /
`startMonth` cases, which was a distinct bug already fixed). The root-cause
functions are `monthsElapsedInServiceYear`, `countActiveMonths`,
`computeRegularGoalProgress`, and `computeAuxiliaryGoalProgress`, all in
`src/app/goals/domain/goal.usecase.ts`. This is a purely Domain-layer calculation
issue — there is no Data/Facade/Presentation involvement in the root cause.

This is a decision about calculation granularity, not about a structural Clean
Architecture layer boundary; therefore, per the ADR rule in
`references/graphify-integration.md`, no structural confirmation via
`graphify path` was required for this ADR.

## Decision

The identified gap — complete-month granularity causing a false-negative status
at the start of each month — is accepted, for now, as a known and documented
limitation, to be fixed in a future, separate implementation session
(explicitly NOT fixed by this ADR). The anticipated fix direction recorded as
the decision is: progress-to-date calculations should prorate the current
calendar month by days elapsed (day-of-month / days-in-month) instead of
counting it as 100% elapsed, applied uniformly to both the `regular` and
`auxiliary` types in the Domain layer (`goal.usecase.ts`), preserving the
existing complete-month behavior for all previous months that are already
fully completed.

## Consequences

- Easier: user-visible status badges will be accurate during the first days of
  a month; a recurring false "out-of-margin" alarm is eliminated; day-level
  prorating is a small, localized change, confined to the Domain layer (no
  changes are anticipated in Data/Facade/Presentation, consistent with how
  `targetToDate`/`hoursDifference` were already centralized in the Domain layer
  by a previous fix).
- Harder / trade-offs: day-level prorating changes the exact numeric outputs of
  status/target/projection during in-progress months for ALL existing goals
  (regular and auxiliary) — this will need to be re-verified against the
  existing test fixtures in `goal.usecase.spec.ts`; it introduces a dependency
  on day-of-month/days-in-month relative to the exact `currentDate` received
  (timezone/day-boundary edge cases must be considered); until fixed, users may
  see confusing or discouraging status badges during the first days of each
  month.

## Alternatives considered

- **Do nothing / permanently accept the complete-month granularity** — rejected
  because it produces a predictable, recurring false-negative signal every
  month, undermining trust in the badge.
- **Prorate only for the `regular` type** (mirroring how the mid-year-start fix
  was scoped) — rejected because the bug is demonstrably present for
  `auxiliary` goals as well (same code path in
  `countActiveMonths`/`monthsElapsedInServiceYear`), so a type-scoped fix would
  leave the auxiliary case broken.
- **Hide/suppress the status badge during the first N days of a month instead
  of computing it precisely** — rejected as a workaround that reduces the
  information available to the user instead of fixing the underlying
  calculation.

## Implementation

**2026-09-18** — The fix described in the "Decision" section was implemented
as anticipated, in `src/app/goals/domain/goal.usecase.ts`, under GitHub issue
#70. It was not yet committed to git as of this note.

- Added `rawMonthsElapsedInServiceYear(sy, currentDate)`, an unclamped count of
  elapsed months (unlike `monthsElapsedInServiceYear`, which remains clamped to
  `[0,12]`).
- Added `currentMonthDayFraction(currentDate)`, which computes
  `currentDate.getDate() / daysInMonth`.
- `countActiveMonths()` now identifies the single in-progress month (when
  `rawElapsed` falls within `[1,12]`) and adds `inProgressFraction` to it
  instead of a full `1`; every other active month already elapsed still adds a
  full `1` — exactly the uniform prorating for `regular` and `auxiliary` that
  the Decision anticipated.
- `activeMonthsElapsed` is only rounded with `round2()` in the final
  `GoalProgress` object; the internal arithmetic (`projection`, `targetToDate`,
  `hoursDifference`) uses full precision up to that point.
- Verification against this same ADR's reproduction scenario (Regular goal,
  service year 2027, current date 2026-09-17, 33h accumulated): now
  `targetToDate≈28.33`, `hoursDifference≈+4.67`, `projectedHours≈698.82`,
  `status='on-track'` — the false `out-of-margin` described in Context no
  longer occurs.
- Test suite: 38/38 tests passing in `goal.usecase.spec.ts` (new regression
  tests were added for the exact issue scenario, a day-1-of-service-year edge
  case, and an `auxiliary`-goal variant); full project suite 690/690 passing;
  coverage 98.71%/96.23%/96.33%/99.06%
  (statements/branches/functions/lines).
