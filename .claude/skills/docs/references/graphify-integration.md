# graphify integration (Step 1 for every subcommand)

Every subcommand starts here before any file is read or written. graphify is the source of truth for structure; this skill never re-derives its own ranking of "important" files, God Nodes, or communities.

## Which call to make

| Subcommand | Call |
|---|---|
| `/docs feature <module>` | `graphify query "<module> module"` then `graphify explain "<module>"` for its core concepts |
| `/docs module <module>` | `graphify query "<module> module"` |
| `/docs architecture` | Read `graphify-out/GRAPH_REPORT.md` in full (this is the one subcommand allowed to read the whole report, since it IS the architecture review); `graphify query "god nodes"` and `graphify query "communities"` for current values |
| `/docs drift` | `graphify query "<module>"` per module under review, to compare current graph facts against what a generated doc claims |
| `/docs ai-context <module>` | `graphify explain "<module>"` for its public API and invariants; `graphify path "<Module>Facade" "<Module>Repository"` if the context doc needs to describe a cross-layer dependency |
| `/docs onboarding` | `graphify query "module structure"` for the top-level module list; no per-module depth needed |
| `/docs adr` | Skip graphify unless the decision concerns a structural boundary — then `graphify path "<A>" "<B>"` to confirm the current dependency actually exists before writing the ADR's Context section |
| `/docs release` | `graphify query "<module>"` for each module touched since the last release tag |

## Fallback when a query returns nothing

graphify's index can lag a fresh module. Before treating an empty result as "this module doesn't exist":

1. Run `graphify update .` (AST-only, no API cost) to refresh the index.
2. Re-run the same query once.
3. If still empty, fall back to `Glob`/`Grep` against `src/app/<module>/` directly, but say so explicitly in the generated doc's front matter note — never silently substitute a hand-derived summary for a graph-grounded one without flagging it.

## Citation rule

Any fact pulled from graphify (a God Node, a community boundary, a violation) is cited by linking to `graphify-out/GRAPH_REPORT.md` or by naming the exact `graphify query`/`explain` invocation that produced it — never pasted as a bare claim with no way for a reader to reproduce it.
