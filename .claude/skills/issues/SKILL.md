# Skill: issues

GitHub Issues management for Ministry Assistanto.
Script: `.claude/scripts/issues.sh`

Invoke with `/issues` or when the context requires it (session start, bug report, feature request).

---

## When to activate this skill

- **Session start** — Always. Before any task, list issues and ask the user which one to work on.
- **Bug report or feedback** — The user describes a problem → create issue and ask whether to work on it now.
- **Feature request** — The user asks for new functionality → create issue with user story.
- **After completing an implementation** — Document what was done in the issue and wait for explicit user confirmation before closing.

---

## Session flow

### 1. Start — list and choose

```bash
.claude/scripts/issues.sh list
```

Present the list to the user. Propose the highest-priority one (order: `bug` > `ux` > `feature` > `tech-debt`). Wait for confirmation.

### 2. Start an issue

```bash
.claude/scripts/issues.sh start <number>
.claude/scripts/issues.sh view <number>
```

Read the full issue body to understand the acceptance criteria before touching any code.

### 3. Implement and iterate

Follow the normal agent flow (dispatcher → Explore/Plan → forks → build). The
implementation may require multiple iterations: re-reviews, test fixes, adjustments.
All rework is part of the normal cycle — skip no step.

### 4. Verify acceptance criteria

Before considering the issue ready, check each acceptance criterion in the issue body one by one:
- Tests passing and coverage ≥90%
- Every acceptance criterion marked as met
- Re-review with agents if there were changes after the first implementation

### 5. Document in the issue

**Always before closing**, add a comment to the issue summarizing everything done in
the session, including rework:

```bash
gh issue comment <number> --body "<full summary>"
```

The summary must include:
- What was implemented (files touched, design decisions)
- What rework occurred and why (bugs found in re-review, test adjustments)
- Derived issues created, if any
- Final test and coverage result

### 6. Confirm with the user and close

**Never close without explicit user confirmation.** Present the summary of what was
done and ask: "Shall we close issue #N?"

Only when the user confirms:

```bash
npx ng test --no-watch --code-coverage
.claude/scripts/check-coverage.sh  # verifies >=90%
.claude/scripts/issues.sh close <number> "<summary of what was implemented>"
```

The `issues.sh close` script automatically includes the coverage table in the closing
comment if `coverage/coverage-summary.json` exists.

---

## Creating a new issue

When the user reports a bug or requests a feature:

```bash
.claude/scripts/issues.sh create \
  "<concise title>" \
  "<labels: bug|feature|ux|ios|enhancement|tech-debt>" \
  "<body with context, acceptance criteria and relevant files>"
```

### Body format (bug)

```
## Description
<what happens vs what should happen>

## Steps to reproduce
1. ...

## Technical context
- File: ...
- Device/condition: ...

## Acceptance criteria
- [ ] ...
```

### Body format (feature)

```
## User story
As a <role>, I want <what>, so that <why>.

## Acceptance criteria
- [ ] ...

## Files involved
- ...

## Design notes (UXAgent)
...
```

---

## Available labels

| Label | Use |
|-------|-----|
| `bug` | Something is not working |
| `feature` | New functionality |
| `ux` | User experience / design |
| `ios` | iOS-specific behavior |
| `enhancement` | Improvement to existing functionality |
| `tech-debt` | Refactor / technical debt |

---

## Rules

- **Never close an issue without explicit user confirmation** — even if the implementation looks complete.
- **Never close without documenting in the issue** — all session work (including rework, bugs found in re-review, derived issues) must be in a comment before closing.
- Never close without verifying the build and coverage >=90%.
- If the issue has multiple acceptance criteria, verify each one before proposing closure.
- If additional unplanned work arises during implementation, create a new issue — do not expand the current issue's scope.
- The script uses `gh` which is already authenticated; no additional token is needed.
