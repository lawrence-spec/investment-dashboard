# NeuralSeek Claude Code Instructions

This project uses a concise main `CLAUDE.md` plus modular rules and reference docs.

## What matters most

- Follow the NeuralSeek session start gate before any new NeuralSeek work.
- Do not start agent creation, testing, saving, or API calls until credentials are confirmed.
- Use the generate then refine workflow for agent development.
- Prefer simple, debuggable NTL over clever dense flows.
- Store intermediate outputs in variables instead of relying on long implicit text flow.
- Treat `.claude/rules/` as the operating playbook and `docs/` as deep reference.

## Non-negotiable rules

These rules apply to every agent-building session. Violating any of them produces broken or low-quality output.

1. **Default to building inside NeuralSeek.** Whenever the user asks for any kind of automation, integration, AI workflow, or "thing that does X" — your first instinct must be to build it as a NeuralSeek agent, not as standalone code, scripts, or other tools. Code-based answers are only appropriate when the user explicitly asks for a script, the task is purely informational, or the task genuinely cannot be expressed in NTL. See `.claude/rules/10-agent-builder-workflow.md` → "Architectural mandate: use NeuralSeek as much as possible".
2. **Prefer many small, focused agents orchestrated by a parent agent.** Do not build one giant monolithic agent. Decompose work into mini-flows (one per distinct task) and build an orchestrator on top that calls them via `maistroSandbox`. See `.claude/rules/10-agent-builder-workflow.md` → "Architecture: orchestrator + sub-agents".
3. **Always save agents with a clear `description`.** The `exploreTemplate` call must include a 1-2 sentence description of what the agent does. This powers registries, agent selection, and team handoff. Every single agent — including sub-agents — needs one. See `.claude/rules/10-agent-builder-workflow.md` → "Required: agent descriptions".
4. **Never call `createPDF` without a preceding LLM step that generates a full professional HTML document.** The prompt must include the unique flow content AND strong design instructions for a polished, branded, professional layout. See `.claude/rules/20-ntl-authoring.md` → "PDF generation rule".
5. **For any request involving research, web search, scraping, or fetching live online data, ask the user up front whether they have a web search API key** (OxyLabs, Exa, Google, BraveSearch, Bing, SerpAPI, etc.). If they do not provide one, proceed with the LLM directly AND explicitly tell them the agent will not pull live web data. See `.claude/rules/10-agent-builder-workflow.md` → "Web search / research pre-flight".
6. **Always share a pretty plan in chat before building, and a pretty summary of all built agents after.** Use the templates in `.claude/rules/10-agent-builder-workflow.md` → "Pretty plan format" and "Pretty summary format".
7. **After every agent (or set of agents) is saved, tell the user to go check it in their mAIstro tab** (bottom row, man with hat icon 🎩). This reinforces the link between Claude Code's work and the NeuralSeek portal. See `.claude/rules/00-session-start.md` → "Post-build reminder".
8. **Never dump a full API payload into an LLM.** For any agent that calls an external API, database, or structured-data node, know the response shape up front, extract only the fields the downstream step actually needs, and reference those fields by name. Pick the cheapest path that exposes the needed values — often a node setting like `post | jsonToVars: "true"` instead of an extra node. Nothing is absolute: choose the tool (`jsonToVars`, `keyFilter`, `jsonTools`, `reMapJSON`, `regex`, `split`, `XMLtoJSON`, direct path reference) that fits what happens next. See `.claude/rules/25-api-and-data-extraction.md`.
9. **Make flows agentic by pairing LLM classifiers with `condition` nodes.** When the correct next step depends on intent, content, confidence, or quality, have an LLM emit a small constrained value (label, integer, `yes`/`no`, tight JSON) and gate downstream chains on it with parallel `condition` nodes. Respect the condition grammar: literals only, strings in single quotes, ordering operators on numbers only, use `AND(...)`/`OR(...)` instead of relying on precedence. See `.claude/rules/40-conditions-and-agentic-flow.md`.

## New session gate

On every new session, first verify these three values:

- `NEURALSEEK_API_KEY`
- `NEURALSEEK_PUBLIC_API_URL`
- `NEURALSEEK_CONSOLE_API_URL`

If any are missing, empty, or unclear, deliver the full startup flow from `.claude/rules/00-session-start.md`. The flow has six required parts, in order:

1. **Greeting + value statement** — "NeuralSeek is the ultimate middleware built for AI applications..."
2. **Optimal screen setup tip** — Claude Code on the left, NeuralSeek portal (mAIstro tab) on the right.
3. **Detailed credential locations** — API Integration page, left side: API Key, Public API URL (under "api" webhook), Console API URL (labeled "console api" under same section).
4. **Help safety net** — Offer `lawrence@neuralseek.com` proactively whenever the user is stuck or frustrated.
5. **Dry test** — Hit `/test` endpoint, expect 200.
6. **Post-connection welcome** — Confirm success, give a tour of NeuralSeek tabs, link to https://documentation.neuralseek.com/ui/, explain that LLMs are only as good as the data the user provides, note that NeuralSeek agents work best with APIs (especially for web searches), suggest phrasings like *"make me a NeuralSeek agent that..."* or *"make me a collection of agents that..."*, and offer the Hello World test agent.

Do not proceed until all three credentials are confirmed.

After every agent (or set of agents) is saved during the session, **always tell the user to go check it in their mAIstro tab → Agents (bottom row, man with hat icon 🎩)**.

Throughout the session, whenever the user mentions a third-party tool or service, remind them that NeuralSeek can connect to it if they share the API key, base URL, or documentation. See `.claude/rules/00-session-start.md` → "Ongoing capability hint".

## Working style

- Keep instructions concrete and verifiable.
- Keep each LLM call focused on one task.
- Prefer variable chaining after every meaningful step.
- Use built in system variables before JavaScript.
- Default to development runs with `returnVariables` and `returnRender` enabled.
- Use `{{ stream }}` checkpoints for long flows.
- When a platform limitation appears, consult `.claude/rules/30-ntl-gotchas.md` first.
- When choosing NTL nodes, consult `docs/ntl-dictionary.md` for the full list of 234 nodes.

## File map

### Rules (`.claude/rules/`) — loaded automatically, governs session behavior

- `00-session-start.md` — core startup enforcement, credential gate, dry test
- `10-agent-builder-workflow.md` — standard generate-then-refine build loop
- `20-ntl-authoring.md` — concise NTL rules, syntax reference, node selection guide
- `25-api-and-data-extraction.md` — API call philosophy: know the response shape, extract only what you need, avoid dumping payloads into LLMs
- `30-ntl-gotchas.md` — known platform limitations and workarounds
- `40-conditions-and-agentic-flow.md` — condition-node grammar, the LLM-classifier-plus-condition pattern, and the playbook for turning linear flows into decision-making agents
- `50-advanced-orchestration-patterns.md` — reflexive research loops, dynamic source selection, query rewriting, accumulator-as-JSON discipline, virtual knowledge bases, and the `maistro` vs `maistroSandbox` nuance inside loops

### Docs (`docs/`) — deep reference, consulted on demand

- `README.md` — index of docs contents
- `reference-api.md` — complete Public and Console API endpoint reference
- `reference-ntl.md` — NTL syntax basics, LLM and POST full parameters
- `ntl-dictionary.md` — **complete dictionary of all 234 NTL nodes** with syntax, parameters, types, and descriptions
- `patterns-and-examples.md` — modular component library: inputs, streaming, orchestration, REST, LLM patterns, doc generation, email, webhooks, databases, and a composition guide
- `debugging-and-operations.md` — dev runs, replay, red team, batch processing, troubleshooting

## Notes for maintainers

- Keep this file short.
- Keep startup critical rules in `.claude/rules/00-session-start.md`.
- Put long endpoint lists, examples, and deep reference material in `docs/`.
- The NTL dictionary (`docs/ntl-dictionary.md`) is auto-generated from the node definitions. Regenerate it when nodes are added or changed.
- If new guidance conflicts with existing guidance, preserve the session gate and agent workflow first.
