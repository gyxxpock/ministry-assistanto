---
doc_type: adr
module: root
adr_number: 0
status: template
date: n/a
supersedes: null
superseded_by: null
generated_by: human
sources: []
---

# ADR-NNNN: <short title, imperative mood>

## Status

Proposed | Accepted | Superseded by [ADR-NNNN](NNNN-slug.md) | Deprecated

## Context

What is the issue we're seeing that motivates this decision? State the forces at play
(technical, business, team) without yet arguing for a specific solution.

## Decision

What is the change we're actually proposing/doing? State it in full sentences, not
bullet fragments.

## Consequences

What becomes easier or harder as a result of this decision? Include negative and
neutral consequences, not only positive ones.

## Alternatives considered

What other options were evaluated, and why were they not chosen?

---

**ADR conventions** (see [ADR-0001](0001-record-architecture-decisions.md)):

- File name: `NNNN-slug.md`, zero-padded, sequential, never reused.
- Once `status: accepted`, an ADR is **immutable** — to change course, write a new ADR
  and set `supersedes`/`superseded_by` on both records. Never edit an accepted ADR's
  Decision in place.
