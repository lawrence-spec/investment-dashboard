# NeuralSeek Claude Code Reference Docs

These files hold the larger reference material that should not live in startup context unless needed.

## Contents

- `reference-api.md` complete endpoint reference for Public and Console APIs
- `reference-ntl.md` NTL syntax, core parameters, and authoring patterns
- `ntl-dictionary.md` comprehensive dictionary of all 234 NTL nodes with syntax, parameters, and descriptions
- `patterns-and-examples.md` modular component library (inputs, streaming, orchestration, REST, LLM, doc gen, email, webhooks, databases) with a composition guide showing how to snap them together
- `debugging-and-operations.md` troubleshooting, replay, red team, naming, and batch use

## Guidance

Use the concise files in `.claude/rules/` for session behavior. In particular, `.claude/rules/25-api-and-data-extraction.md` is the authoritative guidance whenever an agent touches an external API, database, or structured-data node — it defines the "know the shape, extract what you need, never dump into an LLM" philosophy. `.claude/rules/40-conditions-and-agentic-flow.md` is the authoritative guidance for the `condition` node grammar and for making flows agentic by pairing LLM classifiers with parallel `condition` gates.

Use the docs in this folder when you need detailed examples, exact payload patterns, endpoint lookup, or the full node reference.

The `ntl-dictionary.md` is the authoritative source for which NTL nodes exist and what parameters they accept. Consult it whenever you need to find the right node for a task or verify a node's parameter names and types.
