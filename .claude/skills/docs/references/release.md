# Workflow: release documentation prep (`/docs release`)

Does not create a standalone docs file. Prepares release-notes text and hands it back into the `pr` skill's PR body — the `changelog.json` update itself stays owned by the `pr` skill, never written here.

## Steps

1. Step 1 orientation — `graphify query "<module>"` for each module with commits since the last release tag (`git describe --tags --abbrev=0` to find it, `git log <tag>..HEAD --name-only` to find touched modules).
2. For each touched module, check whether `/docs feature <module>` is overdue (manifest `source_commit` older than the module's latest commit). If so, run it now — a release should never ship with stale generated docs for the modules it changed.
3. Dispatch `architecture-doc-agent` and `ai-docs-agent` only for the modules actually touched, not a full-repo regenerate.
4. Draft the release-notes text: a short, user-facing summary per touched module (tone matches existing `public/assets/changelog.json` entries — read a couple of recent entries first to match voice), plus a link to each module's generated overview for anyone who wants the technical detail.
5. Return the drafted text directly in the report (Step 6) — do not write it to any file. The `pr` skill is responsible for putting it into `changelog.json` and the PR body.

## Rule

Never write to `public/assets/changelog.json` from this workflow. If the user wants it written, say so explicitly and point them to the `pr` skill.
