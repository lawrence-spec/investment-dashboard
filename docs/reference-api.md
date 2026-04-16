# NeuralSeek API Reference

## Environment

```bash
NEURALSEEK_API_KEY=$NEURALSEEK_API_KEY
NEURALSEEK_PUBLIC_API_URL=$NEURALSEEK_PUBLIC_API_URL
NEURALSEEK_CONSOLE_API_URL=$NEURALSEEK_CONSOLE_API_URL
```

All endpoints use `apikey` header auth.

The URLs already include the instance path.

```text
Public API:  ${NEURALSEEK_PUBLIC_API_URL}/{endpoint}
Console API: ${NEURALSEEK_CONSOLE_API_URL}/{endpoint}
```

## Public API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/maistro` | Run agent |
| GET | `/maistro/{agent}` | Run agent via GET |
| POST | `/maistro_stream` | Run agent with streaming |
| POST | `/maistro_batch` | Submit batch job |
| GET | `/maistro_batch` | Poll batch results |
| DELETE | `/maistro_batch` | Cancel batch job |
| POST | `/chat/completions` | OpenAI compatible chat endpoint |
| POST | `/seek` | RAG question answering |
| POST | `/seek_stream` | Streaming RAG |
| POST | `/categorize` | Categorize text |
| POST | `/extract` | Extract entities |
| POST | `/translate` | Translate text |
| POST | `/identify` | Identify language |
| POST | `/pii` | Find PII |
| POST | `/score` | Semantic scoring |
| POST | `/rate` | Rate an answer |
| POST | `/analytics` | Instance analytics |
| POST | `/logs` | Instance logs |
| POST | `/keycheck` | Validate API key |
| GET | `/test` | Health check |
| POST | `/maistroRate` | Rate agent run |
| POST | `/maistroRatings` | Get agent ratings |

## Console API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/makeNTL` | Generate NTL from description |
| POST | `/exploreTemplate` | Save or update agent |
| POST | `/exploreTemplates` | List agents |
| POST | `/deleteTemplates` | Delete agents |
| POST | `/genSpec` | Generate OpenAPI spec |
| POST | `/ntlToVis` | Convert NTL to visual flow |
| POST | `/maistroreplay` | Replay agent execution |
| POST | `/createAgentRegistry` | Create agent registry |
| POST | `/addAgentToRegistry` | Add agent to registry |
| POST | `/removeAgentFromRegistry` | Remove agent from registry |
| POST | `/getAgentRegistries` | List registries |
| POST | `/deleteAgentRegistry` | Delete registry |
| POST | `/createMaistroSchedule` | Create schedule |
| POST | `/updateMaistroSchedule` | Update schedule |
| POST | `/getMaistroSchedules` | List schedules |
| POST | `/deleteMaistroSchedule` | Delete schedule |
| POST | `/agentdashboards` | List dashboards |
| POST | `/agentdashboards/add` | Create dashboard |
| POST | `/exploreUpload` | Upload file for agent |
| POST | `/maistroFiles` | List uploaded files |
| POST | `/fdel` | Delete file |
| POST | `/maistroOCR` | OCR a file |
| POST | `/exportPDF` | Export as PDF |
| POST | `/exportDOCX` | Export as DOCX |
| POST | `/exportPPTX` | Export as PPTX |
| POST | `/exportHTML` | Export as HTML |
| POST | `/maistroredteam` | Start red team test |
| GET | `/maistroredteam/status/` | Red team status |
| GET | `/maistroredteam/{agent}` | Red team results |
| POST | `/gomaistro` | Governance overview |
| POST | `/gomaistrotokens` | Token usage report |
| POST | `/exportDB` | Export instance backup |
| POST | `/importDB` | Import instance backup |
| POST | `/apikeys` | List API keys |
| POST | `/createapikey` | Create API key |
| POST | `/deleteapikey` | Delete API key |

## OpenAI compatible endpoint

```bash
curl -X POST "${NEURALSEEK_PUBLIC_API_URL}/chat/completions" \
  -H "apikey: ${NEURALSEEK_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "AgentName",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```
