# NeuralSeek Patterns and Examples

A modular library of reusable NTL components. Mix and match these building blocks to compose agents.

## Input and setup

### Declare input parameters

Every agent that accepts user input should declare parameters at the top.

```ntl
{{ text | text: "<< name: company_name, prompt: true, desc: "Company name to research" >>
<< name: website_url, prompt: true, desc: "Company website URL" >>
" }}
```

### Capture today's date

```ntl
{{ date }}=>{{ variable | name: "today" }}
```

## Progress and streaming

### Stream checkpoints between phases

Use `stream` to give the user visibility into long-running flows. Place one before each major phase.

```ntl
{{ stream | string: "Phase 1: Researching account..." }}
# ... work ...
{{ stream | string: "Phase 2: Generating output..." }}
# ... work ...
{{ stream | string: "Done!" }}
```

### Annotate nodes for UI clarity

Add `nsdescription` to any node so the visual flow editor shows meaningful labels.

```ntl
{{ post | url: "https://example.com/feed/" | operation: "GET" | nsdescription: "Fetch RSS feed" }}=>{{ variable | name: "feed_data" }}
```

## Agent orchestration

### Shared vs isolated execution

- `maistro` runs a sub-agent in shared variable space — the child can read and write parent variables.
- `maistroSandbox` runs a sub-agent in an isolated space — only the final output is returned via variable capture.
- Multiple independent sandbox calls run in parallel automatically.

### Call a sub-agent and capture its output

```ntl
{{ maistroSandbox | template: "Account-Research-Brief" | params: "{\"company_name\":\"<< name: company_name >>\",\"website_url\":\"<< name: website_url >>\"}" }}=>{{ variable | name: "research_brief" }}
```

### Parallel fan-out with synthesis

Launch multiple independent agents, then cross-reference their results in a single LLM call.

```ntl
{{ maistroSandbox | template: "Research-Agent-A" | params: "{\"query\":\"<< name: input >>\"}" }}=>{{ variable | name: "result_a" }}
{{ maistroSandbox | template: "Research-Agent-B" | params: "{\"query\":\"<< name: input >>\"}" }}=>{{ variable | name: "result_b" }}
{{ maistroSandbox | template: "Research-Agent-C" | params: "{\"query\":\"<< name: input >>\"}" }}=>{{ variable | name: "result_c" }}

{{ LLM | prompt: "Cross reference these independent reports. Identify agreements, contradictions, and gaps.

REPORT A: << name: result_a, prompt: false >>
REPORT B: << name: result_b, prompt: false >>
REPORT C: << name: result_c, prompt: false >>" | maxTokens: "3000" }}
```

Important: runtime variables resolve in LLM prompts more reliably than inside later sandbox params.

### Sequential pipeline

```ntl
{{ maistroSandbox | template: "Step-1-Extract" | params: "{\"input\":\"<< name: raw_data >>\"}" }}=>{{ variable | name: "extracted" }}
{{ maistroSandbox | template: "Step-2-Enrich" | params: "{\"data\":\"<< name: extracted >>\"}" }}=>{{ variable | name: "enriched" }}
{{ maistroSandbox | template: "Step-3-Report" | params: "{\"data\":\"<< name: enriched >>\"}" }}=>{{ variable | name: "report" }}
```

Use with caution — later sandbox params may not reliably resolve runtime variables.

### Dynamic agent selection

```ntl
{{ selectAgent | registry: "my-agent-registry" | query: "<< name: user_question >>" }}
```

### Agent plan execution

```ntl
{{ selectAgentPlan | registry: "my-registry" | query: "Perform a full competitive analysis" }}
{{ agentLoop }}
```

## REST fetch and external data

See `.claude/rules/25-api-and-data-extraction.md` for the full API philosophy. The short version: know the response shape, extract only the fields you need, pick the leanest path, and never dump a raw payload into an LLM.

### GET external data (RSS, APIs)

Use `post` with `operation: "GET"` to fetch external content.

```ntl
{{ post | url: "https://techcrunch.com/tag/openai/feed/" | operation: "GET" | nsdescription: "Fetch OpenAI RSS" }}=>{{ variable | name: "openai_rss" }}
```

### Parallel data fetching

Independent GET calls run in parallel automatically. Capture each into its own variable.

```ntl
{{ post | url: "https://source-a.com/feed/" | operation: "GET" }}=>{{ variable | name: "feed_a" }}
{{ post | url: "https://source-b.com/feed/" | operation: "GET" }}=>{{ variable | name: "feed_b" }}
```

### POST with JSON body and headers

```ntl
{{ post | url: "https://api.example.com/endpoint"
       | body: "{\"key\":\"value\"}"
       | headers: "{\"Content-Type\":\"application/json\",\"Authorization\":\"Bearer TOKEN\"}"
       | operation: "POST" }}=>{{ variable | name: "api_response" }}
```

### Flatten JSON response directly via node setting

When the next step needs to reference fields of the response by path (e.g. `data.results[0].name`), skip the extra `jsonToVars` node entirely — toggle it on the `post` itself.

```ntl
{{ post | url: "https://api.example.com/weather?q=Miami"
       | apikey: "<< name: weather_key >>"
       | operation: "GET"
       | jsonToVars: "true" }}

# now << name: current.temp_f >> and << name: forecast.forecastday[0].summary >> are available
```

### Trim the payload before it goes anywhere

`keyFilter` keeps only the keys you name — ideal for shrinking a bulky response to the few fields you care about.

```ntl
{{ post | url: "https://api.crm.example/v2/contacts/<< name: contact_id >>"
       | headers: "{\"Authorization\":\"Bearer << name: crm_token, prompt: false >>\"}"
       | operation: "GET" }}=>{{ keyFilter | filter: "name,email,company" }}=>{{ variable | name: "contact" }}
```

### Navigate to a sub-path, prefix the vars

Use a standalone `jsonToVars` node when you need to start from a nested path or namespace the variables.

```ntl
{{ post | url: "https://api.news.example/rss.json" | operation: "GET" }}=>{{ variable | name: "news_raw" }}
{{ jsonToVars | startingPath: "data.channel.items" | prefix: "news" | flatten: "true" }}
# news[0].title, news[0].link, news[1].title, ... are now available
```

### Non-JSON payloads: convert before you extract

```ntl
{{ post | url: "https://enterprise.example/api/report" | operation: "GET" }}=>{{ XMLtoJSON }}=>{{ variable | name: "report_json" }}
```

For plain text responses, use `regex` or `split` to pick out the exact substring you need.

### Reference specific fields in the LLM prompt (not the whole payload)

The correct shape is: extract → reference by name. Do not interpolate a raw response into a prompt.

```ntl
# GOOD - lean prompt, LLM sees only the two values it needs
{{ LLM | prompt: "Write two sentences. Current temp in Miami: << name: current.temp_f, prompt: false >>F. Week's forecast: << name: forecast.forecastday, prompt: false >>."
       | maxTokens: "200" }}
```

```ntl
# BAD - full payload into the prompt, wastes tokens, dilutes signal
{{ LLM | prompt: "Here is the weather API response. Write two sentences about Miami:
<< name: weather_raw, prompt: false >>" }}
```

## Web scraping and link extraction

### Scrape a webpage for text

Use `web` to fetch a URL and return its cleaned text content. Optionally pass CSS `selectors` to target specific elements.

```ntl
{{ web | url: "https://example.com" | selectors: "['']" }}=>{{ variable | name: "page_text" }}
```

### Extract all links from a page

`linkRipper` scrapes a URL and returns a JSON array of link objects at `linkRipper.links`. Each object has an `href` property.

```ntl
{{ linkRipper | url: "https://ibm.com" | filters: "['']" }}
```

The results are available as `linkRipper.links` for use in loops.

### Scrape and summarize every link on a page

Combine `linkRipper` with `variableLoop` to iterate through all discovered links, fetch each page, and summarize. Use `mode: "append"` to accumulate results and `endLoop | sleep` to add a polite delay.

```ntl
{{ linkRipper | url: "https://ibm.com" | filters: "['']" }}
{{ variableLoop | variable: "linkRipper.links" | loopType: "array-objects" }}
{{ web | url: "<< name: loopObject.href, prompt: false >>" | selectors: "['']" }}=>{{ summarize | length: "1000" }}=>{{ variable | name: "summaries" | mode: "append" }}
{{ endLoop | sleep: "1000" }}
```

## Loops

### Basic counted loop

```ntl
{{ startLoop | end: "5" }}
# ... work repeated 5 times ...
{{ endLoop }}
```

### Loop over an array variable

Use `variableLoop` to iterate over a JSON array. Inside the loop, the current element is available as `loopObject` (for array-objects) or `loopValue` (for simple arrays).

```ntl
{{ variableLoop | variable: "myArray" | loopType: "array-objects" }}
# << name: loopObject.fieldName, prompt: false >> is available here
{{ endLoop }}
```

### Accumulate results across loop iterations

Use `mode: "append"` on the variable node to collect output from each iteration rather than overwriting.

```ntl
{{ variableLoop | variable: "items" | loopType: "array-objects" }}
{{ LLM | prompt: "Summarize: << name: loopObject.text, prompt: false >>" | stream: "disable_streaming" }}=>{{ variable | name: "all_summaries" | mode: "append" }}
{{ endLoop }}
```

### Loop with delay

Add `sleep` (in milliseconds) to `endLoop` to throttle API calls or be polite to external servers.

```ntl
{{ endLoop | sleep: "1000" }}
```

### Conditional loop exit

Use `condition` with `breakLoop` to exit early. Strings must be wrapped in single quotes; interpolate the variable so the expression is a literal at parse time.

```ntl
{{ condition | value: "'<< name: status, prompt: false >>' == 'done'" }}=>{{ breakLoop }}
{{ endLoop }}
```

### Context loop (split text by tokens)

Split large text into overlapping chunks and process each. Useful for working within LLM token limits.

```ntl
{{ contextLoop | tokens: "2000" | overlap: "10" }}
{{ LLM | prompt: "Extract key facts from: << name: contextLoop.text, prompt: false >>" | stream: "disable_streaming" }}=>{{ variable | name: "facts" | mode: "append" }}
{{ endLoop }}
```

### PDF page loop

Iterate through each page of a PDF as both text and images.

```ntl
{{ pdfLoop }}
# << name: pdfLoop.text >> and << name: pdfLoop.image >> available per page
{{ endLoop }}
```

## Conditions and agentic branching

Full grammar, gotchas, and the deeper playbook live in `.claude/rules/40-conditions-and-agentic-flow.md`. These are the snap-in patterns.

### LLM-classifier plus `condition` (triage by label)

The single most useful agentic pattern: an LLM emits a tiny constrained label, parallel `condition` nodes route to different sub-agents.

```ntl
{{ LLM | prompt: "Classify into exactly one of URGENT, NORMAL, SPAM. Output only the label — no punctuation, no explanation.

MESSAGE:
<< name: incoming_message, prompt: false >>"
       | stream: "disable_streaming"
       | temperatureMod: "-0.8"
       | maxTokens: "5" }}=>{{ variable | name: "triage_label" }}

{{ condition | value: "'<< name: triage_label, prompt: false >>' == 'URGENT'" }}=>{{ maistroSandbox | template: "Pager-Duty-Escalate" | params: "{\"msg\":\"<< name: incoming_message, prompt: false >>\"}" }}

{{ condition | value: "'<< name: triage_label, prompt: false >>' == 'NORMAL'" }}=>{{ maistroSandbox | template: "Standard-Reply-Drafter" | params: "{\"msg\":\"<< name: incoming_message, prompt: false >>\"}" }}

{{ condition | value: "'<< name: triage_label, prompt: false >>' == 'SPAM'" }}=>{{ text | text: "Dropped as spam." }}
```

### Confidence gate before expensive work

A cheap classifier decides whether to spend tokens on heavier extraction or to escalate for human review.

```ntl
{{ LLM | prompt: "On a scale of 0-100, how confident are you that this text is a legitimate order? Respond with only the integer.

TEXT:
<< name: inbound, prompt: false >>"
       | stream: "disable_streaming"
       | temperatureMod: "-0.8"
       | maxTokens: "4" }}=>{{ variable | name: "order_confidence" }}

{{ condition | value: "<< name: order_confidence, prompt: false >> >= 70" }}=>{{ maistroSandbox | template: "Order-Extractor" | params: "{\"text\":\"<< name: inbound, prompt: false >>\"}" }}=>{{ variable | name: "order_json" }}

{{ condition | value: "<< name: order_confidence, prompt: false >> < 70" }}=>{{ maistroSandbox | template: "Human-Review-Queue" | params: "{\"text\":\"<< name: inbound, prompt: false >>\"}" }}
```

### Multi-field JSON decision

One LLM call produces multiple signals; the flow gates on composites via `AND`/`OR`.

```ntl
{{ LLM | prompt: "Output ONLY a JSON object with exact keys: { \"intent\": one of 'quote' | 'support' | 'spam', \"priority\": integer 1-5, \"needs_human\": 'yes' or 'no' }.

EMAIL:
<< name: email_body, prompt: false >>"
       | stream: "disable_streaming"
       | temperatureMod: "-0.8"
       | maxTokens: "60" }}=>{{ extractCode }}=>{{ jsonToVars }}

{{ condition | value: "AND( '<< name: intent, prompt: false >>' == 'quote', '<< name: needs_human, prompt: false >>' == 'no' )" }}=>{{ maistroSandbox | template: "Auto-Quote-Builder" | params: "{\"email\":\"<< name: email_body, prompt: false >>\"}" }}

{{ condition | value: "OR( '<< name: needs_human, prompt: false >>' == 'yes', << name: priority, prompt: false >> <= 2 )" }}=>{{ maistroSandbox | template: "Human-Handoff" | params: "{\"email\":\"<< name: email_body, prompt: false >>\"}" }}
```

### Self-check retry loop

Generate, validate with a second LLM call, break out of the loop as soon as the validator says `yes`.

```ntl
{{ startLoop | end: "3" }}

{{ LLM | prompt: "Produce a valid JSON array of the top 3 sources for: << name: query, prompt: false >>. Output only the JSON array."
       | stream: "disable_streaming"
       | temperatureMod: "-0.5" }}=>{{ extractCode }}=>{{ variable | name: "sources_raw" }}

{{ LLM | prompt: "Is this a syntactically valid JSON array with exactly 3 objects? Respond 'yes' or 'no'.

<< name: sources_raw, prompt: false >>"
       | stream: "disable_streaming"
       | temperatureMod: "-0.9"
       | maxTokens: "2" }}=>{{ variable | name: "ok" }}

{{ condition | value: "'<< name: ok, prompt: false >>' == 'yes'" }}=>{{ breakLoop }}

{{ endLoop }}
```

### Gate on emptiness or presence

Skip a whole downstream chain when the prior step produced nothing useful.

```ntl
{{ condition | value: "NOT(ISEMPTY('<< name: scraped_text, prompt: false >>'))" }}=>{{ maistroSandbox | template: "Summarize-Page" | params: "{\"text\":\"<< name: scraped_text, prompt: false >>\"}" }}
```

### Condition cheatsheet

- Strings in single quotes: `'<< name: x, prompt: false >>' == 'URGENT'`
- Numbers bare: `<< name: score, prompt: false >> >= 70`
- Dates on both sides: `DATE('<< name: d, prompt: false >>') <= DATE('2026-12-31')`
- Composites: `AND(...)`, `OR(...)`, `NOT(...)` — do not rely on operator precedence
- Ordering (`>`, `<`, `>=`, `<=`) only works on numbers (and `DATE(...)`) — never strings
- `ISEMPTY('')` is `true`; `ISEMPTY(0)` is `false` (non-string)
- `CONTAINS` needs literal string args; wrap interpolations in single quotes

## LLM patterns

### Summarize fetched content with constraints

Use `stream: "disable_streaming"` for intermediate LLM steps so partial output doesn't leak. Use `temperatureMod` for deterministic output.

```ntl
{{ LLM | prompt: "You are a concise news curator. From this RSS XML, extract the 5 most recent items. For each include the title (bold) and a one-sentence summary. Format as a bullet list.

RSS XML:
<< name: rss_data, prompt: false >>"
     | stream: "disable_streaming"
     | maxTokens: "500"
     | temperatureMod: "-0.3"
     | nsdescription: "Summarize feed" }}=>{{ variable | name: "summary" }}
```

### Compose formatted output for a platform

Feed prior variables into an LLM that formats for a specific target (Discord, Slack, email, etc.).

```ntl
{{ LLM | prompt: "Compose a daily AI news digest for Discord. Keep total under 1800 characters. Use Discord markdown (**bold**, bullet points).

Source A:
<< name: summary_a, prompt: false >>

Source B:
<< name: summary_b, prompt: false >>"
     | stream: "disable_streaming"
     | maxTokens: "450"
     | temperatureMod: "-0.2" }}=>{{ variable | name: "digest" }}
```

### Generate structured HTML from data

Use a strict system prompt that forces raw HTML output — no markdown, no backticks. Chain through `extractCode` to clean any wrapping.

```ntl
{{ LLM | prompt: "You must output a complete HTML document and NOTHING ELSE. No markdown. No backticks. Your response must start with <!DOCTYPE html> and end with </html>.

Create a one-page branded brief for << name: company_name >>.

DATA:
<< name: research_brief, prompt: false >>

DESIGN:
- inline CSS only (PDF compatible)
- table-based layout
- max-width 800px, centered
- keep to one printable page"
     | cache: "false"
     | maxTokens: "4000" }}=>{{ extractCode }}=>{{ variable | name: "html_output" }}
```

### Build a JSON payload with LLM

When you need to construct a JSON payload from free text (e.g., for a webhook), use a dedicated LLM step with very low temperature.

```ntl
{{ LLM | prompt: "Output ONLY a valid JSON object with a single key called content. The value must be the text below, properly JSON-escaped. No markdown code fences, no explanation.

Text to encode:
<< name: digest, prompt: false >>"
     | stream: "disable_streaming"
     | maxTokens: "700"
     | temperatureMod: "-0.8" }}=>{{ variable | name: "json_payload" }}
```

## Document generation

### HTML to PDF (REQUIRED pattern)

**Rule:** `createPDF` must always be preceded by an LLM step that generates a complete, professional HTML document. Never feed raw text or minimal markup directly into `createPDF`.

The LLM prompt must include both the unique flow content AND strong design instructions emphasizing a polished, branded, professional layout. See `.claude/rules/20-ntl-authoring.md` → "PDF generation rule" for the full required template.

```ntl
{{ LLM | prompt: "You must output a complete HTML document and NOTHING ELSE. No markdown. No backticks. Your response must start with <!DOCTYPE html> and end with </html>.

<UNIQUE CONTENT FOR THIS FLOW>

DESIGN REQUIREMENTS:
- Premium, polished, professional layout.
- Inline CSS only (PDF compatible).
- Table-based layout, max-width 800px, centered.
- Modern font: Inter, Helvetica Neue, Arial, sans-serif.
- Branded header with gradient background.
- Cards with #F5F7FA background, border-radius 8px, accent borders.
- Compact body text (11-12px), one printable page.
- Footer with divider and small attribution."
     | cache: "false"
     | maxTokens: "4000" }}=>{{ extractCode }}=>{{ variable | name: "pdf_html" }}

{{ text | text: "<< name: pdf_html, prompt: false >>" }}=>{{ createPDF | file: "Report.pdf" }}
```

### Create other document types

```ntl
{{ text | text: "<< name: content, prompt: false >>" }}=>{{ createDOC | file: "Report.docx" }}
{{ text | text: "<< name: content, prompt: false >>" }}=>{{ createPPT | file: "Slides.pptx" }}
{{ text | text: "<< name: content, prompt: false >>" }}=>{{ createFile | file: "output.csv" }}
```

## Email

### Send email with attachment

After creating a file (PDF, DOCX, etc.), reference its filename in the `attachment` parameter.

```ntl
{{ email | to: "recipient@example.com"
        | subject: "Report: << name: company_name >> | << name: today, prompt: false >>"
        | message: "Your report for << name: company_name >> is attached."
        | attachment: "Report.pdf"
        | host: ""
        | port: "465"
        | user: ""
        | pass: ""
        | from: "" }}
```

Note: SMTP credentials (`host`, `user`, `pass`, `from`) must be configured. Leave blank to use instance defaults if configured.

## Webhook outbound

### Slack

```ntl
{{ post | url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
       | body: "{\"text\":\"Your message here\"}"
       | headers: "{\"Content-Type\":\"application/json\"}"
       | operation: "POST" }}
```

Use simple `text` payloads instead of nested block payloads when possible.

### Discord

```ntl
{{ post | url: "https://discord.com/api/webhooks/YOUR/WEBHOOK/URL"
       | body: "<< name: json_payload, prompt: false >>"
       | headers: "{\"Content-Type\":\"application/json\"}"
       | operation: "POST" }}=>{{ variable | name: "webhook_response" }}
```

### Slack inbound bridge

Use a thin translation layer that:

1. Receives Slack form-encoded POST
2. Converts it to JSON
3. Forwards to NeuralSeek `maistro`
4. Returns the agent response to Slack

## Database best practices

- Use single CTE queries for multi-step work.
- Use `RETURNING` for confirmation messages.
- Use `COALESCE` for not-found fallbacks.
- Prefer one agent per query variant.
- Return JSON from Postgres for structured downstream processing.

## Composition guide

These components snap together. Here are two common agent skeletons.

### Skeleton A: multi-phase pipeline (gather, process, generate, deliver)

```ntl
# 1. Inputs
{{ text | text: "<< name: input_a, prompt: true, desc: "..." >>
<< name: input_b, prompt: true, desc: "..." >>" }}

# 2. Gather data
{{ stream | string: "Phase 1: Gathering data..." }}
{{ maistroSandbox | template: "Data-Agent" | params: "..." }}=>{{ variable | name: "raw_data" }}
{{ post | url: "https://..." | operation: "GET" }}=>{{ variable | name: "external_data" }}

# 3. Process with LLM
{{ stream | string: "Phase 2: Analyzing..." }}
{{ LLM | prompt: "..." | stream: "disable_streaming" }}=>{{ variable | name: "analysis" }}

# 4. Generate output
{{ stream | string: "Phase 3: Generating deliverable..." }}
{{ LLM | prompt: "..." | maxTokens: "4000" }}=>{{ extractCode }}=>{{ variable | name: "html" }}
{{ text | text: "<< name: html, prompt: false >>" }}=>{{ createPDF | file: "Output.pdf" }}

# 5. Deliver
{{ stream | string: "Phase 4: Delivering..." }}
{{ email | to: "..." | subject: "..." | attachment: "Output.pdf" }}
{{ stream | string: "Done!" }}

# 6. Return to user
{{ text | text: "<< name: html, prompt: false >>" }}
```

### Skeleton B: reflexive research loop (search, judge, refine, retry)

Three-agent pattern for questions where one search probably is not enough. An orchestrator runs a bounded retry loop that calls a search sub-agent, accumulates the results, asks an LLM classifier "is this enough?", and either breaks on `YES` or rewrites the query for the next iteration. Depth and discipline live in `.claude/rules/50-advanced-orchestration-patterns.md`.

**Orchestrator** — reflexive loop with empty-input short-circuit, accumulator-as-JSON-array, classifier gate, and LLM query rewriter. Note the use of `maistro` (shared vars), not `maistroSandbox` — the loop needs the sub-agent's `found_info` and `sub_queries` back.

```ntl
{{ virtualKbIn | passPrefs: "false" }}=>{{ variable | name: "query" | value: "<< name: virtualKbIn.originalQuery, prompt: true >>" }}=>{{ condition | value: "ISEMPTY('<< name: query, prompt: false >>')" }}=>{{ virtualKbOut | context: "[]" | kbCoverage: "100" | kbScore: "100" | url: "" | document: "" }}=>{{ stop }}

{{ variable | name: "all_results" | value: "[\n" }}

{{ startLoop | count: "3" }}
  {{ maistro | template: "search_skill" }}
  {{ variable | name: "all_results" | value: "<< name: kb_docs, prompt: false >>" | mode: "append" }}
  {{ condition | value: "'<< name: found_info, prompt: false >>' == 'YES'" }}=>{{ breakLoop }}
  {{ LLM | prompt: "Return ONLY the single best query string from this JSON array of follow-ups, distinct from the previous query (<< name: query, prompt: false >>). No quotes, no explanation.

<< name: sub_queries, prompt: false >>"
         | cache: "true"
         | stream: "disable_streaming"
         | maxTokens: "80"
         | temperatureMod: "-0.5" }}=>{{ variable | name: "query" | mode: "overwrite" }}
{{ endLoop | sleep: "0" }}

{{ text | text: "\n<< name: all_results, prompt: false >>" }}=>{{ regex | match: "/,\\s*$/" | replace: "" | group: "" }}=>{{ variable | name: "all_results" | mode: "overwrite" }}=>{{ variable | name: "all_results" | value: "<< name: all_results, prompt: false >>]" }}

{{ virtualKbOut | context: "<< name: all_results, prompt: false >>" | kbCoverage: "100" | kbScore: "100" | url: "" | document: "" }}
```

**Search sub-agent** — one honest iteration. Dynamic source selection via LLM, dynamic recency window via `dateTime`, then two LLM calls at the tail emit the signals the orchestrator reads (`sub_queries`, `found_info`).

```ntl
{{ dateTime | timezone: "UTC" | offset: "-365" }}

{{ LLM | prompt: "Return ONLY a JSON array of domain (or domain+path) strings most relevant to answer: << name: query, prompt: false >>. Prefer official, structured, authoritative sources. Minimum count needed."
       | cache: "true"
       | stream: "disable_streaming" }}=>{{ variable | name: "paths" }}

{{ post | url: "https://api.exa.ai/search"
       | body: "{\"startPublishedDate\":\"<< name: sys_DateTime, prompt: false >>\",\"numResults\":5,\"includeDomains\":<< name: paths, prompt: true >>,\"query\":\"<< name: query, prompt: true >>\",\"type\":\"auto\",\"contents\":{\"highlights\":{\"maxCharacters\":4000}}}"
       | headers: "{\"Accept\":\"application/json\",\"Content-Type\":\"application/json\",\"x-api-key\":\"<< name: exa_key, prompt: false >>\"}"
       | operation: "POST" }}=>{{ variable | name: "jsonp" }}=>{{ text | text: "<< name: jsonp, prompt: false >>" }}=>{{ jsonToVars }}

{{ maistro | template: "cleanse_passages" }}

{{ LLM | prompt: "Create a JSON string array of 5 follow-up web searches based on the data. Preserve the intent of the original query.
Data: << name: jsonp, prompt: false >>
Original query: << name: query, prompt: false >>
Output ONLY the JSON array:"
       | cache: "true"
       | stream: "disable_streaming" }}=>{{ variable | name: "sub_queries" }}

{{ LLM | prompt: "Classifier. Does the data contain a usable answer to the query? Output ONLY YES or NO.
Data: << name: jsonp, prompt: false >>
Query: << name: query, prompt: false >>"
       | cache: "true"
       | stream: "disable_streaming"
       | maxTokens: "3"
       | temperatureMod: "-0.8" }}=>{{ variable | name: "found_info" }}
```

**Cleanse sub-agent** — normalization. Every free-text field gets `jsonEscape`'d into its own variable before being composed into `kb_docs`, which ends with a trailing comma so the orchestrator's accumulator just works.

```ntl
{{ text | text: "<< name: results[0].highlights[0], prompt: false >>" }}=>{{ jsonEscape }}=>{{ variable | name: "rp0" }}
{{ text | text: "<< name: results[0].title, prompt: false >>" }}=>{{ jsonEscape }}=>{{ variable | name: "rt0" }}
{{ text | text: "<< name: results[1].highlights[0], prompt: false >>" }}=>{{ jsonEscape }}=>{{ variable | name: "rp1" }}
{{ text | text: "<< name: results[1].title, prompt: false >>" }}=>{{ jsonEscape }}=>{{ variable | name: "rt1" }}
# ... rp2/rt2, rp3/rt3, rp4/rt4 ...

{{ variable | name: "kb_docs" | value: "{\"document\":\"<< name: rt0, prompt: false >>\",\"url\":\"<< name: results[0].url, prompt: false >>\",\"passage\":\"<< name: rp0, prompt: false >>\",\"score\":50},
{\"document\":\"<< name: rt1, prompt: false >>\",\"url\":\"<< name: results[1].url, prompt: false >>\",\"passage\":\"<< name: rp1, prompt: false >>\",\"score\":50}," }}
```

### Virtual knowledge base (virtualKbIn / virtualKbOut)

Wrap any agent with `virtualKbIn` at the top and `virtualKbOut` at the bottom to expose it as a Seek-compatible knowledge source. Seek hands you enriched query signals (`virtualKbIn.originalQuery`, `.contextQuery`, `.language`, `.intent`, `.categoryName`, `.filter`) and expects a context array of `{document, url, passage, score}` objects plus `kbCoverage` and `kbScore`. The reflexive research loop above is an excellent candidate for a virtual KB: Seek asks a question, the KB delegates to an adaptive research agent, and returns structured passages.

### Skeleton C: scrape-loop-accumulate (discover, iterate, collect)

```ntl
# 1. Discover links / items
{{ linkRipper | url: "https://target-site.com" | filters: "['']" }}

# 2. Loop and process each item
{{ variableLoop | variable: "linkRipper.links" | loopType: "array-objects" }}
{{ web | url: "<< name: loopObject.href, prompt: false >>" | selectors: "['']" }}=>{{ summarize | length: "1000" }}=>{{ variable | name: "collected" | mode: "append" }}
{{ endLoop | sleep: "1000" }}

# 3. Synthesize
{{ LLM | prompt: "Analyze these summaries and produce a report:
<< name: collected, prompt: false >>" }}
```
