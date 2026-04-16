# NeuralSeek Claude Code Pack Manifest

This pack converts the large consolidated reference into a Claude Code friendly structure.

## Design choices

- The main `CLAUDE.md` is intentionally short.
- Startup critical behavior is separated into `.claude/rules/00-session-start.md`.
- Daily working guidance lives in modular rule files.
- Larger reference material is moved into `docs/` so it does not bloat startup context.
- The NTL dictionary provides a complete, categorized reference of all 234 available nodes.
- The session start gate is treated as the highest priority rule.

## File tree

```text
CLAUDE.md                              Main instructions (short, high-level)
MANIFEST.md                            This file
.claude/
  rules/
    00-session-start.md                Credential gate + dry test
    10-agent-builder-workflow.md       Generate-then-refine build loop
    20-ntl-authoring.md                NTL syntax rules + node selection
    30-ntl-gotchas.md                  Platform limitations + workarounds
docs/
  README.md                            Docs index
  reference-api.md                     Public + Console API endpoints
  reference-ntl.md                     NTL syntax, LLM/POST full params
  ntl-dictionary.md                    All 234 NTL nodes (syntax, params, types)
  patterns-and-examples.md             Modular component library + composition guide
  debugging-and-operations.md          Dev runs, replay, red team, batch, troubleshooting
```

## How it works

1. User drops this folder into their project root.
2. Claude Code reads `CLAUDE.md` on startup.
3. `.claude/rules/` files are loaded automatically and govern session behavior.
4. `docs/` files are consulted on demand when deeper reference is needed.
5. On first interaction, the session start gate prompts for API Key, Public API URL, and Console API URL.
6. Once credentials are confirmed, the user can immediately start building, testing, and deploying NeuralSeek agents.
