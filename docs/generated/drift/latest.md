---
doc_type: drift-report
source_commit: e461526035a179d92b034f04ec05b2f3ed670980
generated_by: documentation-reviewer
---

# Drift report (latest)

Repo-wide `/docs drift` run (no `--path` given). Scan performed at commit
`e461526035a179d92b034f04ec05b2f3ed670980`.

## 1. Stale architecture docs

- `docs/generated/architecture/dependency-overview.md`: `source_commit` = HEAD — not stale by the diff test.
- `docs/generated/architecture/known-violations.md`: `source_commit` = HEAD — not stale by the diff test, but flagged as a caveat: its content is factually wrong regardless (see check 3), since a doc's `source_commit` being current doesn't guarantee its content was accurate when written.
- `docs/curated/architecture/overview.md` and the ADRs under `docs/curated/architecture/adr/`: curated architecture docs carry no `source_commit` field by schema design — not applicable.

## 2. Outdated agent definitions

- `.claude/agents/data-agent.md`: describes `ITimeEntryRepository`/`data/time-entry.repository.ts` as a still-pending violation — already fixed (see check 3), so this content is stale.
- `.claude/agents/domain-agent.md`: describes `ITimeEntryRepository`/`data/time-entry.repository.ts` and `file-util.service.ts` as still-pending violations — already fixed (see check 3), so this content is stale.
- `.claude/agents/ui-agent.md`: Scope tree omits `components/shared/` (`option-pill-group/`, `month-paginator/`), which now has genuine cross-module reuse (`OptionPillGroupComponent` imported by both `time-entry.module.ts` and `planning.module.ts`) — last touched at commit `04892f9`, newer than `ui-agent.md`'s own last-modified commit `88822c5`.
- `CLAUDE.md`: line 26 says "The 8 roles in `.claude/agents/`" but there are now 14 agent files; `AGENTS.md`'s role table already correctly lists all 14 — live, uncommitted inconsistency.
- The 6 new documentation agents (`documentation-agent`, `documentation-reviewer`, `human-docs-agent`, `ai-docs-agent`, `architecture-doc-agent`, `compodoc-agent`) are uncommitted, so commit-based comparison does not apply to them yet.

## 3. Moved or renamed files

- `data/time-entry.repository.ts` (cited in `docs/generated/architecture/known-violations.md:19`, `.claude/agents/data-agent.md:19`, `.claude/agents/domain-agent.md:24`): **HIGH SEVERITY** — does not exist. `ITimeEntryRepository` now correctly lives at `src/app/time-entry/domain/i-time-entry.repository.ts`.
- `domain/utils/file-util.service.ts` (cited in the same three docs): **HIGH SEVERITY** — does not exist. `FileUtilService` now lives at `src/app/core/services/file-util.service.ts` (moved by commit `b0e5abc`, predating even the agent files' current wording).
- All `planning` module doc paths and all other cited paths resolved fine.
- `.claude/agents/compodoc-agent.md`'s cited `.compodocrc.json` not existing is intentional/documented, not drift.

## 4. Broken doc-to-doc links

- `docs/curated/architecture/adr/0000-template.md:17`: the `[ADR-NNNN](NNNN-slug.md)` link doesn't resolve, but this is an intentional template placeholder, not a real defect.
- All other 42 links and anchors checked (43 total) resolve correctly.

## 5. Feature/module mismatch

- `planning`: fully covered (`docs/generated/modules/planning/overview.md`, `docs/generated/ai/planning/context.md`).
- `goals`: has all 4 layer subfolders — missing both `docs/generated/modules/goals/overview.md` and `docs/generated/ai/goals/context.md`.
- `time-entry`: has all 4 layer subfolders — missing both `docs/generated/modules/time-entry/overview.md` and `docs/generated/ai/time-entry/context.md`.
- `shared`: only has `domain/`/`presentation/` (not applicable by the check's own criterion) — still undocumented.
- `core`: not applicable (no 4-layer structure).
- `docs/generated/ai/index.json`: still `{"docs": []}` despite `docs/generated/ai/planning/context.md` existing — the retrieval index itself is stale.

## 6. Stale invariants

- `docs/generated/ai/planning/context.md`: all 13 cited `file:line` locations spot-verified correct against current source. `source_commit` = HEAD for this doc, so nothing flagged. (none found)
- `docs/generated/ai/invariants.md` and `docs/generated/ai/_template-context.md` are not yet generated (placeholder `source_commit`) — out of scope.
</content>
