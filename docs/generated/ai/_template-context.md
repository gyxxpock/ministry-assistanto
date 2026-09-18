---
doc_type: ai-context
module: <module-name>
source_commit: <pending-first-generation>
generated_by: ai-docs-agent
status: draft
sources: []
---

# AI context: <module-name>

> Template — this file is the fixed schema every per-module AI-context doc under
> `docs/generated/ai/` follows. It is never linked directly from `docs/index.md`;
> `ai-docs-agent` copies this shape when generating `docs/generated/ai/<module>.md`.

## Purpose

<One paragraph: what this module is responsible for, in domain terms, not
implementation terms.>

## Public API surface

<The exported symbols other modules/layers are meant to depend on — classes,
interfaces, tokens, functions. Not every symbol in the module, only the contract.>

- `<Symbol>` — `<file>:<line>`

## Key invariants

<Rules that must hold for this module to behave correctly, each cited to the file/line
that enforces or documents it. Pull from the owning agent's "Absolute restrictions" /
"Warning signals" where applicable — see [invariants.md](invariants.md).>

- `<invariant statement>` — `<file>:<line>`

## Dependencies

<What this module depends on (inner layers/modules it imports) and, if relevant, what
depends on it. Prefer citing a `graphify query`/`graphify path` result over hand-listing
imports that will drift.>

## God Nodes / edges in scope

<Any God Nodes (per `graphify-out/GRAPH_REPORT.md`) that live in or touch this module,
and why they haven't been split yet, if known.>

## Test coverage summary

<Coverage state for this module per `testing-agent`'s mandate — not a duplicate of the
coverage tool's output, just enough for an agent to know whether it's safe to change
this module without adding tests first.>

## source_commit

`<the commit SHA this doc was generated against — set by ai-docs-agent, never by hand>`
