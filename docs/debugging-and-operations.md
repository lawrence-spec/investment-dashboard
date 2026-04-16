# NeuralSeek Debugging and Operations

## Development run options

Always prefer these options during development:

```json
{
  "agent": "MyAgent",
  "params": [{"name": "input", "value": "test"}],
  "options": {
    "returnVariables": true,
    "returnRender": true
  }
}
```

## Progress tracking

Add stream checkpoints between phases:

```ntl
{{ stream | string: "Phase 1 complete..." }}
```

## Replay failed executions

Use `POST ${NEURALSEEK_CONSOLE_API_URL}/maistroreplay` to replay prior runs.

## Red team testing

```bash
curl -X POST "${NEURALSEEK_CONSOLE_API_URL}/maistroredteam" \
  -H "apikey: ${NEURALSEEK_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"agent":"MyAgent"}'
```

Then poll status and fetch results.

## Agent naming and organization

- use alphanumeric plus dots, dashes, and underscores only
- prefer descriptive prefixes by domain
- keep descriptions accurate so registries and selection work well

Examples:

- `CI-CompanyProfiler`
- `CI-PricingAnalyzer`
- `Pipeline-LeadScorer`

## Batch processing

```bash
curl -X POST "${NEURALSEEK_PUBLIC_API_URL}/maistro_batch" \
  -H "apikey: ${NEURALSEEK_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "MyAgent",
    "batch": [
      {"params": [{"name": "input", "value": "item1"}]},
      {"params": [{"name": "input", "value": "item2"}]},
      {"params": [{"name": "input", "value": "item3"}]}
    ]
  }'
```

Poll results with the returned job id.

## Troubleshooting checklist

1. confirm all three environment variables are set
2. confirm `apikey` header is being sent
3. verify public and console URLs already include the instance path
4. parse `genSpec` responses explicitly
5. if `makeNTL` returns `infoN`, rewrite the prompt with more detail
6. if runtime values fail in `post` or `postgres`, use a workaround from the gotchas file
