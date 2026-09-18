---
doc_type: adr
module: root
adr_number: 1
status: accepted
date: 2026-09-15
supersedes: null
superseded_by: null
generated_by: human
sources: []
---

# ADR-0001: Record architecture decisions

## Status

Accepted

## Context

Ministry Assistanto makes structural decisions over time (layering rules, module
boundaries, DI scoping, storage choices). Without a durable record, the reasoning
behind a decision is lost as soon as the conversation or PR that made it scrolls out
of view, and future contributors — human or agent — end up re-litigating settled
questions or violating constraints they never knew existed.

## Decision

We use Architecture Decision Records (ADRs), one Markdown file per decision, stored in
`docs/curated/architecture/adr/`, following the template in
[0000-template.md](0000-template.md):

- Numbered sequentially, zero-padded, never reused: `0001-slug.md`, `0002-slug.md`, ...
- Each has `Status` / `Context` / `Decision` / `Consequences` / `Alternatives
  considered` sections.
- Once `status: accepted`, an ADR is immutable. A changed decision gets a **new** ADR
  that sets `supersedes` on itself and `superseded_by` on the old one — the old file's
  Decision text is never rewritten.
- ADRs are curated docs: agents may draft one (`status: draft`/`proposed`), but only a
  human promotes it to `accepted`.

## Consequences

- Decisions become greppable and linkable instead of buried in chat history or PR
  descriptions.
- Adds a small amount of process overhead for any decision worth recording — trivial
  or easily-reversed choices don't need an ADR.
- Requires discipline to actually write one when a real decision is made; nothing
  enforces this automatically.

## Alternatives considered

- **No formal record, rely on git history/PR descriptions** — rejected: git history
  answers "what changed" but not "why," and PR descriptions are not indexed anywhere
  a future reader would look first.
- **A single running `DECISIONS.md` file** — rejected: loses per-decision status
  (proposed/accepted/superseded) and immutability, and grows unreadable over time.
