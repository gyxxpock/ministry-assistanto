# Skill: pr

Push the current branch and create a Pull Request toward `main`.
Script: `.claude/scripts/pr.sh`

Invoke with `/pr` when the user approves a change and wants to send it to production.

---

## When to activate this skill

- The user says "make the PR", "send to main", "push and PR", "create the pull request".
- After closing an issue and the user confirms the change is ready.
- **Do not create PRs without explicit user approval.**

---

## Full flow

### 1. Verify state

```bash
git status
git log origin/main..HEAD --oneline
.claude/scripts/pr.sh commits
```

- If there are uncommitted changes → create commit first (or alert the user).
- If there are no new commits relative to `main` → nothing to send; inform the user.

### 2. Push

```bash
.claude/scripts/pr.sh push
```

### 3. Build PR title and body

**Title:** One imperative line, ≤70 chars. Based on the branch commits.
Suggested format: `<type>(<scope>): <description> (#<issue>)`
Example: `feat(ux): sticky header + compact tiles on iPhone SE (#20)`

**Body:** Follow the structure of `.github/PULL_REQUEST_TEMPLATE.md` — fill in
each section with information from the real diff. Do not use a simplified structure.

Sections to complete (omit only those that genuinely do not apply):

```markdown
# Summary
<1-2 sentences: what changed and why>

## Type of change
- [x] feat / fix / refactor / docs / chore  ← mark the applicable one

## Related issues
- Closes #N  ← if there is an associated issue

## Implementation notes
- Which layers were touched (domain / data / facade / presentation)
- Relevant design decisions (Clean Architecture, patterns used)
- Key files modified

## How to test
- npm run build
- npm run i18n:check  ← if translations were touched
- Manual QA steps for UI changes (golden path + edge cases)

## Release notes
- `<type>(<scope>): <one-line description>`

## Checklist
- [x] Build passes (`npm run build`)
- [x] i18n: keys added/updated and `npm run i18n:check` passes  ← if applicable
- [x] Small, focused commits with clear messages
```

Fill in with real information from the commits — do not leave placeholders or empty sections
that add no value.

### 4. Create PR

```bash
.claude/scripts/pr.sh create "<title>" "<body>"
```

For a draft PR (work in progress):
```bash
.claude/scripts/pr.sh draft "<title>" "<body>"
```

### 5. Show URL

The script prints the PR URL. Present it to the user.

---

## Pre-flight checks

- [ ] Clean build (`npm run build`) before pushing.
- [ ] Related issue closed (or in correct state).
- [ ] No sensitive files in the diff (`.env`, credentials, tokens).
- [ ] `public/assets/changelog.json` updated with the changes in this delivery
      (types: `feature` for new functionality, `fix` for fixed bugs,
      `ux` for minor performance/visual improvements grouped together).

---

## Rules

- Always push **before** creating the PR.
- Base is always `main`.
- Include `Closes #N` in the body if there is a related issue.
- Do not push to `main` directly — only PRs from working branches.
- If a PR already exists for the branch, use `pr.sh status` to see its URL instead of creating a new one.
