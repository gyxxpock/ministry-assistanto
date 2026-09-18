# Workflow: generated module overview (`/docs module <module>`)

The narrower half of `/docs feature <module>` — writes only `docs/generated/modules/<module>/overview.md`, skips AI-context and curated onboarding. Use this when you specifically need the generated overview refreshed (e.g. after a facade API change) without touching anything else.

## Fixed structure for `overview.md`

1. Front matter: `doc_type: module-overview`, `module`, `source_commit`, `generated_by: architecture-doc-agent`.
2. **Purpose** — one paragraph, what the module is for.
3. **Layers** — a short list of what lives in `domain/`, `data/`, `facade/`, `presentation/` for this module specifically (not a restatement of Clean Architecture in general — that belongs in `docs/curated/architecture/overview.md`).
4. **Public surface** — the facade's public methods/observables/signals, named, not explained line-by-line.
5. **Depends on** / **Depended on by** — from `graphify path`/`graphify query`, cited.
6. **Known violations** — link to `docs/generated/architecture/known-violations.md#<module>` if an entry exists there; otherwise omit the section entirely (never write "none found").

## Steps

1. Step 1 orientation.
2. Check the manifest (Step 2 of `SKILL.md`) — if `source_commit` for `src/app/<module>/**` matches HEAD, report up to date and stop.
3. Dispatch `architecture-doc-agent` to write the file per the structure above.
4. Update manifest, reviewer self-check.
