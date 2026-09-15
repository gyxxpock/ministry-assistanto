# Workflow: new ADR (`/docs adr "<title>"`)

Writes one new file under `docs/curated/architecture/adr/`. ADRs are immutable once accepted — never edit an accepted ADR's Decision in place; a changed decision gets a new ADR that supersedes the old one.

## Numbering and filename

`000N-slug.md`, N is the next unused number (check existing files under `docs/curated/architecture/adr/`, don't trust a manifest count that could be stale). Slug is the title, kebab-case, no stop-word trimming beyond the obvious.

## Template (from `0000-template.md`)

Front matter: `doc_type: adr`, `adr_number`, `date` (today, `YYYY-MM-DD`), `status: proposed` (this workflow always starts here — never write `accepted` directly), `supersedes` / `superseded_by` (omit if not applicable).

Body sections, in order:
1. **Status** — mirrors the front matter, human-readable (`Proposed`).
2. **Context** — what forces led here. If the decision concerns a structural boundary, confirm the current dependency actually exists via `graphify path "<A>" "<B>"` before asserting it in prose.
3. **Decision** — the decision itself, stated plainly, one paragraph.
4. **Consequences** — what becomes easier/harder as a result, both directions.
5. **Alternatives** — what else was considered and why it was rejected.

## Supersession

A new ADR that changes a prior decision sets its own `supersedes: 000N` and requires a follow-up edit to the *old* ADR's front matter only (`superseded_by: 000M`, `status: superseded`) — the old ADR's body text is never rewritten, only its front matter status fields.

## Steps

1. Determine the next number by listing `docs/curated/architecture/adr/*.md`.
2. Dispatch `human-docs-agent` to write the file per the template above, `status: proposed`.
3. If this ADR supersedes an existing one (the user says so, or the Context section makes it obvious), update only that old ADR's front matter — not its body.
4. Update manifest. Report: new ADR path, and remind that `status: proposed`/`accepted` is a human call this workflow does not make.
