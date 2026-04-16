# NeuralSeek NTL Dictionary

A comprehensive reference of all NTL nodes, their syntax, parameters, and descriptions.

## NTL Syntax Quick Reference

| Concept | Syntax | Notes |
|---------|--------|-------|
| Input param | `<< name: varName, prompt: true, desc: "description" >>` | Declare at top of agent |
| Set variable | `{{ variable \| name: "x" \| value: "y" }}` | Create or overwrite |
| Use variable | `<< name: x >>` | Use `prompt: false` for internal refs |
| Chain output | `{{ function }}=>{{ variable \| name: "result" }}` | Capture output |
| Append mode | `{{ variable \| name: "x" \| mode: "append" }}` | Append instead of overwrite |
| Annotation | `nsdescription: "tooltip text"` | Add to any node |
| Function call | `{{ functionName \| param1: "value1" \| param2: "value2" }}` | Pipe-delimited params |
| Chaining | `{{ nodeA \| ... }}=>{{ nodeB \| ... }}=>{{ variable \| name: "out" }}` | Chain multiple nodes |

## Table of Contents

- [Core Flow & Variables](#core-flow--variables) (6 nodes)
- [LLM & AI](#llm--ai) (10 nodes)
- [Agent Orchestration](#agent-orchestration) (13 nodes)
- [Control Flow & Loops](#control-flow--loops) (9 nodes)
- [Text Processing](#text-processing) (20 nodes)
- [Data Transformation](#data-transformation) (15 nodes)
- [Math, Date & Utilities](#math-date--utilities) (5 nodes)
- [Security & Encoding](#security--encoding) (5 nodes)
- [Code Sandboxes](#code-sandboxes) (2 nodes)
- [Charts & Visualization](#charts--visualization) (6 nodes)
- [Web, REST & Search](#web-rest--search) (10 nodes)
- [File Operations](#file-operations) (9 nodes)
- [Database Connectors](#database-connectors) (13 nodes)
- [Caching](#caching) (9 nodes)
- [Cloud Storage (AWS S3)](#cloud-storage-aws-s3) (4 nodes)
- [Cloud Storage (Azure Blob)](#cloud-storage-azure-blob) (5 nodes)
- [SFTP](#sftp) (3 nodes)
- [Email (SMTP)](#email-smtp) (3 nodes)
- [Google Gmail](#google-gmail) (7 nodes)
- [Google Calendar](#google-calendar) (6 nodes)
- [Google Drive](#google-drive) (2 nodes)
- [Slack](#slack) (8 nodes)
- [Jira](#jira) (5 nodes)
- [GitHub](#github) (5 nodes)
- [Trello](#trello) (5 nodes)
- [SharePoint](#sharepoint) (3 nodes)
- [Box](#box) (3 nodes)
- [Media (Image, Audio, Video)](#media-image-audio-video) (10 nodes)
- [Seek, Knowledge Base & Governance](#seek-knowledge-base--governance) (29 nodes)
- [Corporate Logging](#corporate-logging) (2 nodes)
- [WatsonX Governance](#watsonx-governance) (2 nodes)

**Total: 234 nodes**

---

## Core Flow & Variables

### `comment`

This node allows for comments and description of surrounding NTL

**NTL Syntax:**

```ntl
{{ comment | nsdescription: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `nsdescription` | text6 | — | Comments |

---

### `deleteVariable`

Delete a variable.

**NTL Syntax:**

```ntl
{{ deleteVariable | name: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text | — | The name of the variable |

---

### `stop`

Stop all further processing

**NTL Syntax:**

```ntl
{{ stop | about: "Stop all further processing" | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Stop all further processing | Stop all further processing | Stop all further processing |
| `plan` |  | — | — |

---

### `stream`

Send a string to the client when response streaming is enabled

**NTL Syntax:**

```ntl
{{ stream }}
```

---

### `text`

This node inserts text

**NTL Syntax:**

```ntl
{{ text | text: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | text | — | The text |

---

### `variable`

Collect all current flowing text into this node, and set it to a variable for use in later steps. You can also use this to clear existing text.

**NTL Syntax:**

```ntl
{{ variable | name: "..." | mode: "..." | value: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text | — | The name of the variable |
| `mode` | — | — | Overwrite (default) or Append to this variable |
| `value` | text | — | (Optional) Directly set the value. Leave this blank to collect the input to this node. |

---

## LLM & AI

### `LLM`

Call the configured LLM with a prompt. The primary node for all AI-powered text generation, classification, summarization, and reasoning tasks.

**Plan hint:** Call LLM

**NTL Syntax:**

```ntl
{{ LLM | prompt: "Your prompt here"
        | cache: "true"
        | images: ""
        | modelCard: ""
        | stream: "false"
        | maxTokens: ""
        | minTokens: ""
        | temperatureMod: ""
        | toppMod: ""
        | freqpenaltyMod: ""
        | timeout: "" }}
```

**Chaining example:**

```ntl
{{ LLM | prompt: "Summarize: << name: input >>" | maxTokens: "500" }}=>{{ variable | name: "result" }}
```

**Recommended patterns:**

- Use `stream: "disable_streaming"` for non-streaming intermediate steps
- Use `temperatureMod: "-0.5"` for deterministic structured output
- Use `maxTokens: "150"` for concise structured output

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | text | — | A prompt to prepend to the LLM input |
| `cache` | boolean | true | Cache and reuse LLM response for identical requests |
| `images` | images | — | Images to include with the prompt |
| `modelCard` | llm | — | Override the default LLM model |
| `stream` | — | — | Set to `"disable_streaming"` to disable streaming output |
| `messages` | text | — | Raw messages array for advanced prompt construction |
| `maxTokens` | text | — | Maximum tokens in the response |
| `minTokens` | text | — | Minimum tokens in the response |
| `temperatureMod` | slider | — | Temperature modifier (e.g. `"-0.5"` for more deterministic) |
| `toppMod` | slider | — | Top-p modifier |
| `freqpenaltyMod` | slider | — | Frequency penalty modifier |
| `timeout` | slider | — | Timeout in milliseconds |

---

### `TableUnderstanding`

Take CSV input data and try and answer a query directly

**Plan hint:** Answer from table

**NTL Syntax:**

```ntl
{{ TableUnderstanding | query: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The Question to ask of the table |

---

### `contextGrammar`

This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:contextGrammar.text: The input text to process.contextGrammar.language: The name of the identified language.contextGrammar.langCode: The language code identified from the input text.

**Plan hint:** Extract grammar

**NTL Syntax:**

```ntl
{{ contextGrammar | about: "This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:contextGrammar.text: The input text to process.contextGrammar.language: The name of the identified language.contextGrammar.langCode: The language code identified from the input text." | plan: "Extract grammar" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:contextGrammar.text: The input text to process.contextGrammar.language: The name of the identified language.contextGrammar.langCode: The language code identified from the input text. | This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:contextGrammar.text: The input text to process.contextGrammar.language: The name of the identified language.contextGrammar.langCode: The language code identified from the input text. | This node is used only for extracting parts of speech for use in Seek, mAIstro, or other places. This node provides the following variables:contextGrammar.text: The input text to process.contextGrammar.language: The name of the identified language.contextGrammar.langCode: The language code identified from the input text. |
| `plan` | Extract grammar | Extract grammar | Extract grammar |

---

### `describeNTL`

Use the default LLM to describe an NTL script

**Plan hint:** Generate an agent

**NTL Syntax:**

```ntl
{{ describeNTL | ntl: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ntl` | text5 | — | The NTL. |

---

### `embeddings`

Create embeddings from input text

**NTL Syntax:**

```ntl
{{ embeddings | text: "..." | model: "..." }}
```

**Chaining example:**

```ntl
{{ embeddings | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | text6 | — | Input text. Leave blank to take text flowing into the node instead. |
| `model` | embeddings | — | The embedding Model to use |

---

### `llmAct`

This node acts on a LLM plan by spawning sub-llm calls 

**Plan hint:** >

**NTL Syntax:**

```ntl
{{ llmAct | task: "..."
             | plan: "..."
             | cache: "true"
             | context: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task` | text | > | A task to plan |
| `plan` | text5 | > | The plan in JSON format |
| `cache` | boolean | true | Cache and reuse LLM response for identical requests |
| `context` | text5 | > | Context for use in sub-processing |

---

### `llmPlan`

This node creates a plan in JSON format for use with the llmAct node

**Plan hint:** LLM Plan

**NTL Syntax:**

```ntl
{{ llmPlan | task: "..." | cache: "true" | context: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task` | text | — | A task to plan |
| `cache` | boolean | true | Cache and reuse LLM response for identical requests |
| `context` | text5 | — | Context for use in sub-processing |

---

### `makeNTL`

Use the default LLM to generate NTL

**Plan hint:** Generate an agent

**NTL Syntax:**

```ntl
{{ makeNTL | query: "..." | modelCard: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text5 | — | The text that describes the usecase to generate NTL for. |
| `modelCard` | llm | — | The LLM to use |

---

### `semanticScore`

Run the semantic scoring model

**Plan hint:** Score response

**NTL Syntax:**

```ntl
{{ semanticScore | text: "..." | truth: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | text4 | — | The text to score (leave blank for current input) |
| `truth` | text4 | — | The ground truth (leave blank for identified sources) |

---

### `titleNTL`

Use the default LLM to title NTL and ntl script

**Plan hint:** Generate an agent

**NTL Syntax:**

```ntl
{{ titleNTL | ntl: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ntl` | text5 | — | The NTL. |

---

## Agent Orchestration

### `agentLoop`

Loop thru an Agent Plan. Must be used with selectAgentPlan

**NTL Syntax:**

```ntl
{{ agentLoop | about: "Loop thru an Agent Plan. Must be used with selectAgentPlan" | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Loop thru an Agent Plan. Must be used with selectAgentPlan | Loop thru an Agent Plan. Must be used with selectAgentPlan | Loop thru an Agent Plan. Must be used with selectAgentPlan |
| `plan` |  | — | — |

---

### `agentsData`

Get details about Agents created in this instance

**Plan hint:** Get agents data

**NTL Syntax:**

```ntl
{{ agentsData | about: "Get details about Agents created in this instance" | plan: "Get agents data" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Get details about Agents created in this instance | Get details about Agents created in this instance | Get details about Agents created in this instance |
| `plan` | Get agents data | Get agents data | Get agents data |

---

### `callA2A`

Call an agent by a2a.

**Plan hint:** Call external agent

**NTL Syntax:**

```ntl
{{ callA2A | url: "..."
              | text: "..."
              | data: "..."
              | authHeader: "..."
              | apikey: "..."
              | taskId: "..."
              | operation: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text | — | The URL of the agent |
| `text` | text | — | The text to send |
| `data` | text | — | The data to send |
| `authHeader` | text | — | The authentication header |
| `apikey` | text | — | The api key |
| `taskId` | text | — | the task id |
| `operation` | — | — | The operation |

---

### `callMCP`

Call a tool by MCP.

**Plan hint:** Call external tool

**NTL Syntax:**

```ntl
{{ callMCP | baseURL: "..."
              | endpoint: "..."
              | action: "..."
              | method: "..."
              | tool: "..."
              | params: "..."
              | arguments: "..."
              | headers: "..."
              | bearer: "..."
              | timeout: "30000" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `baseURL` | text | — | The URL of the MCP server |
| `endpoint` | text | — | MCP endpoint (/mcp) |
| `action` | — | — | The action to take |
| `method` | text | — | The method to send |
| `tool` | text | — | The tool to call |
| `params` | text | — | The params |
| `arguments` | text | — | The Arguments |
| `headers` | text | — | The headers |
| `bearer` | text | — | The bearer token |
| `timeout` | slider | 30000 | — |

---

### `customConnector`

Call another mAIstro template as a custom connector, keeping a separate variable space from the current mAIstro and only returning the final output.

**Plan hint:** Call custom connector

**NTL Syntax:**

```ntl
{{ customConnector | template: "..."
                      | params: "..."
                      | path: "..."
                      | apikey: "..." }}
```

**Chaining example:**

```ntl
{{ customConnector | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `template` | template | — | The mAIstro agent name. |
| `params` | params | — | The parameters to pass to the agent, in JSON format |
| `path` | text | — | (Optional) mAIstro call url of the region/instance |
| `apikey` | text | — | (Optional) mAIstro api key |

---

### `getNTL`

Get the NTL of a mAIstro agent as a string.

**Plan hint:** Get agent NTL

**NTL Syntax:**

```ntl
{{ getNTL | agent: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `agent` | template | — | The mAIstro agent name. |

---

### `getPackedConfig`

Get the current configuration as an encrypted string.

**Plan hint:** Export config

**NTL Syntax:**

```ntl
{{ getPackedConfig | about: "Get the current configuration as an encrypted string." | plan: "Export config" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Get the current configuration as an encrypted string. | Get the current configuration as an encrypted string. | Get the current configuration as an encrypted string. |
| `plan` | Export config | Export config | Export config |

---

### `maistro`

Import and run another mAIstro agent in the same variable space as the current mAIstro.

**Plan hint:** Run agent

**NTL Syntax:**

```ntl
{{ maistro | template: "..." | ntl: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `template` | template | — | The mAIstro agent name. This agent will share the same variable space as your current agent. |
| `ntl` | text5 | — | The NTL - Do not include both a agent and NTL. Set one or the other only. |

---

### `maistroSandbox`

Call another mAIstro agent, keeping a separate variable space from the current mAIstro and only returning the final output.

**Plan hint:** Run sandboxed agent

**NTL Syntax:**

```ntl
{{ maistroSandbox | template: "..." | params: "..." | ntl: "..." }}
```

**Chaining example:**

```ntl
{{ maistroSandbox | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `template` | template | — | The mAIstro agent name. |
| `params` | params | — | The parameters to pass to the agent, in JSON format |
| `ntl` | text5 | — | The NTL - Do not include both a template and NTL. Set one or the other only. |

---

### `maistroSaveAgentIn`

This node is used only for mAIstro save agents. This node must be the first step in a mAIstro agent save agent.

**NTL Syntax:**

```ntl
{{ maistroSaveAgentIn | about: "This node is used only for mAIstro save agents. This node must be the first step in a mAIstro agent save agent." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for mAIstro save agents. This node must be the first step in a mAIstro agent save agent. | This node is used only for mAIstro save agents. This node must be the first step in a mAIstro agent save agent. | This node is used only for mAIstro save agents. This node must be the first step in a mAIstro agent save agent. |
| `plan` |  | — | — |

---

### `maistroUsersData`

Get details about mAIstro users in this instance

**Plan hint:** Get mAIstro users data

**NTL Syntax:**

```ntl
{{ maistroUsersData | about: "Get details about mAIstro users in this instance" | plan: "Get mAIstro users data" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Get details about mAIstro users in this instance | Get details about mAIstro users in this instance | Get details about mAIstro users in this instance |
| `plan` | Get mAIstro users data | Get mAIstro users data | Get mAIstro users data |

---

### `selectAgent`

Select a single agent from an agent registry to accomplish a task

**Plan hint:** Select an agent

**NTL Syntax:**

```ntl
{{ selectAgent | registry: "..." | query: "..." | modelCard: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `registry` | registry | — | The Registry to select from |
| `query` | text5 | — | The query to use to choose the correct agent |
| `modelCard` | llm | — | The LLM to use |

---

### `selectAgentPlan`

Select an ordered list of agents to accomplish a task

**Plan hint:** Create agent plan

**NTL Syntax:**

```ntl
{{ selectAgentPlan | registry: "..." | query: "..." | modelCard: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `registry` | registry | — | The Registry to select from |
| `query` | text5 | — | The query to use to choose the correct agents |
| `modelCard` | llm | — | The LLM to use |

---

## Control Flow & Loops

### `breakLoop`

Break Loop stops a loop early. Use it in conjunction with the condition node.

**NTL Syntax:**

```ntl
{{ breakLoop | about: "Break Loop stops a loop early. Use it in conjunction with the condition node." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Break Loop stops a loop early. Use it in conjunction with the condition node. | Break Loop stops a loop early. Use it in conjunction with the condition node. | Break Loop stops a loop early. Use it in conjunction with the condition node. |
| `plan` |  | — | — |

---

### `condition`

Evaluate a condition. If true continue processing the attached chain. If false, break out of the chain and continue to the next node in the flow. Use single quotes around text string to compare them.

**NTL Syntax:**

```ntl
{{ condition | value: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | text | — | A condition to evaluate |

---

### `contextLoop`

Split on input text based on token count and set a percentage of overlap for each loop, then loop on the split.

**NTL Syntax:**

```ntl
{{ contextLoop | tokens: "1000" | overlap: "0" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tokens` | slider | 1000 | — |
| `overlap` | slider | 0 | — |

---

### `delay`

Delay for a set time

**NTL Syntax:**

```ntl
{{ delay }}
```

---

### `endLoop`

Loop for a set number of times. Use the Break Loop node to stop the loop early

**NTL Syntax:**

```ntl
{{ endLoop }}
```

---

### `pdfLoop`

Split a PDF by page and loop thru the pages as both text and images. Each iteration of the loop will populate 3 variables:pdfLoopPage[0-x] - the page numberpdfLoopText[0-x] - the text on the pagepdfLoopImage[0-x] - a png image of the page

**NTL Syntax:**

```ntl
{{ pdfLoop | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | document | — | PDF File |

---

### `startLoop`

Loop for a set number of times. Use the Break Loop node to stop the loop early

**NTL Syntax:**

```ntl
{{ startLoop | count: "2" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | slider | 2 | — |

---

### `variableLoop`

Loop on an array variable, iterating thru each element of the array

**NTL Syntax:**

```ntl
{{ variableLoop | variable: "..." | loopType: "..." | consumeDelete: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variable` | text | — | The base variable name |
| `loopType` | — | — | The type of input object (defaults to 'array-strings') |
| `consumeDelete` | boolean | — | Delete the variable as it is looped thru |

---

### `videoLoop`

Break a video down to still frames and loop thru the frames. Each iteration of the loop will populate 2 variables:videoLoopFrame - the frame numbervideoLoopImage[0-x] - the frame as a jpg

**NTL Syntax:**

```ntl
{{ videoLoop | url: "..." | video: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text | — | URL of remote file (this or video required) |
| `video` | document | — | Video file (this or url required) |

---

## Text Processing

### `doc`

Read a local document

**Plan hint:** Read document

**NTL Syntax:**

```ntl
{{ doc | name: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | document | — | The document name |

---

### `extract`

NeuralSeek Entity extraction. Define custom entities on the Extract Tab

**Plan hint:** Extract entities

**NTL Syntax:**

```ntl
{{ extract | useLLM: "true" }}
```

**Chaining example:**

```ntl
{{ extract | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `useLLM` | boolean | true | Use the configued extract LLM |

---

### `extractCode`

Extract code from markdown.

**NTL Syntax:**

```ntl
{{ extractCode | about: "Extract code from markdown." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Extract code from markdown. | Extract code from markdown. | Extract code from markdown. |
| `plan` |  | — | — |

---

### `gather`

Gather info from a user based on slots. Create new custom entities on the Extract tab of the NeuralSeek UI.

**Plan hint:** Collect user info

**NTL Syntax:**

```ntl
{{ gather | slots: "..." | input: "..." | retries: "3" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `slots` | slots | — | The slots to fill |
| `input` | text | — | The user statement (leave blank to take the node input) |
| `retries` | slider | 3 | — |

---

### `grammar`

Extract grammar from text

**Plan hint:** Extract grammar

**NTL Syntax:**

```ntl
{{ grammar | about: "Extract grammar from text" | plan: "Extract grammar" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Extract grammar from text | Extract grammar from text | Extract grammar from text |
| `plan` | Extract grammar | Extract grammar | Extract grammar |

---

### `intents`

Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category

**Plan hint:** List intents

**NTL Syntax:**

```ntl
{{ intents | about: "Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category" | plan: "List intents" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category | Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category | Return the most recent 10 intents. If used as part of seek they will be filtered by the detected category |
| `plan` | List intents | List intents | List intents |

---

### `keywords`

Extract keywords from input text

**Plan hint:** Extract keywords

**NTL Syntax:**

```ntl
{{ keywords }}
```

---

### `lowercase`

Convert a string to lowercase.

**NTL Syntax:**

```ntl
{{ lowercase | about: "Convert a string to lowercase." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Convert a string to lowercase. | Convert a string to lowercase. | Convert a string to lowercase. |
| `plan` |  | — | — |

---

### `profanity`

Filter for profane text and block it.

**NTL Syntax:**

```ntl
{{ profanity | about: "Filter for profane text and block it." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Filter for profane text and block it. | Filter for profane text and block it. | Filter for profane text and block it. |
| `plan` |  | — | — |

---

### `random`

*(No description)*

**NTL Syntax:**

```ntl
{{ random | upper: "..." | lower: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `upper` | text | — | The max number |
| `lower` | text | — | The Min Number |

---

### `regex`

Use a Regular Expression to modify or extract data from text. The match option must be a valid regex, starting with a forward slash and ending with a forward slash plus any regex flags, for example: /d+.d+/. In the regex escape all special characters with a single backslash. Use either the replace option to replace matched text, or the group option to extract text from the specified regex group number 

**NTL Syntax:**

```ntl
{{ regex | match: "..." | replace: "..." | group: "..." }}
```

**Chaining example:**

```ntl
{{ regex | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `match` | regex | — | The regular expression |
| `replace` | text | — | The text to replace the match. Use this OR 'group' |
| `group` | — | — | The group to extract. Use this OR 'replace' |

---

### `split`

Take input text and extract a section from it based on matching start and end text of the section, while optionally removing headers and footers. You must specifiy a unique start and end character set for this node to work.

**NTL Syntax:**

```ntl
{{ split | start: "..." | end: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `start` | text | — | Find text to start the split. |
| `end` | text | — | Find text to end the split |

---

### `splitDelim`

Take input text and split it by a specified delimiter into an array of values.

**NTL Syntax:**

```ntl
{{ splitDelim | delimiter: "..." | outputJson: "..." | variable: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `delimiter` | text | — | The delimiting string or regex on which to split the input text |
| `outputJson` | boolean | — | Output the split result as a JSON array (defaults to false) |
| `variable` | text | — | The base variable name to use for the array |

---

### `stopwords`

Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text.

**Plan hint:** Remove stopwords

**NTL Syntax:**

```ntl
{{ stopwords | about: "Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text." | plan: "Remove stopwords" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text. | Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text. | Extract stopwords (either our defaults or the ones you have set on the Configure tab) from input text. |
| `plan` | Remove stopwords | Remove stopwords | Remove stopwords |

---

### `summarize`

Summarize a large block of text into a smaller set of extracted sentences.

**Plan hint:** Summarize

**NTL Syntax:**

```ntl
{{ summarize | match: "..." }}
```

**Chaining example:**

```ntl
{{ summarize | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `match` | text | — | Text to prioritize building the summary around |

---

### `tablePrep`

Take CSV input data and reduce it down to the rows and columns that most likely contain the answer to a query, for use in later steps or to send to an LLM.

**NTL Syntax:**

```ntl
{{ tablePrep | query: "..." | sentences: "sentences" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The Question to ask of the table |
| `sentences` | — | sentences | Return as sentences, an array, or an object |

---

### `translate`

Translate input text.

**Plan hint:** Translate text

**NTL Syntax:**

```ntl
{{ translate | target: "en" }}
```

**Chaining example:**

```ntl
{{ translate | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target` | text | en | The 2-char language code |

---

### `translateHTML`

Translate a HTML document.

**Plan hint:** Translate HTML

**NTL Syntax:**

```ntl
{{ translateHTML | target: "en" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target` | text | en | The 2-char language code |

---

### `truncateToken`

Truncate text to a max number of LLM tokens.

**NTL Syntax:**

```ntl
{{ truncateToken }}
```

---

### `uppercase`

Convert a string to UPPERCASE.

**NTL Syntax:**

```ntl
{{ uppercase | about: "Convert a string to UPPERCASE." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Convert a string to UPPERCASE. | Convert a string to UPPERCASE. | Convert a string to UPPERCASE. |
| `plan` |  | — | — |

---

## Data Transformation

### `JSONtoCSV`

Turn JSON to CSV

**Plan hint:** Convert JSON to CSV

**NTL Syntax:**

```ntl
{{ JSONtoCSV | about: "Turn JSON to CSV" | plan: "Convert JSON to CSV" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Turn JSON to CSV | Turn JSON to CSV | Turn JSON to CSV |
| `plan` | Convert JSON to CSV | Convert JSON to CSV | Convert JSON to CSV |

---

### `JSONtoXML`

Turn JSON to XML

**Plan hint:** Convert JSON to XML

**NTL Syntax:**

```ntl
{{ JSONtoXML | about: "Turn JSON to XML" | plan: "Convert JSON to XML" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Turn JSON to XML | Turn JSON to XML | Turn JSON to XML |
| `plan` | Convert JSON to XML | Convert JSON to XML | Convert JSON to XML |

---

### `XMLtoJSON`

Turn XML into JSON

**Plan hint:** Convert XML to JSON

**NTL Syntax:**

```ntl
{{ XMLtoJSON | about: "Turn XML into JSON" | plan: "Convert XML to JSON" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Turn XML into JSON | Turn XML into JSON | Turn XML into JSON |
| `plan` | Convert XML to JSON | Convert XML to JSON | Convert XML to JSON |

---

### `arrayFilter`

*(No description)*

**NTL Syntax:**

```ntl
{{ arrayFilter | filter: "..." | filterType: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filter` | text | — | The value to filter for based on Filter Type |
| `filterType` | — | — | Select the type of filter |

---

### `arrayMerge`

Merge two JSON arrays

**NTL Syntax:**

```ntl
{{ arrayMerge | array1: "..." | array2: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `array1` | text | — | The first array |
| `array2` | text | — | The second array |

---

### `forceNumeric`

Extract numbers from text. When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array.

**NTL Syntax:**

```ntl
{{ forceNumeric | about: "Extract numbers from text. When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Extract numbers from text. When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array. | Extract numbers from text. When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array. | Extract numbers from text. When getting numerical imput from users, LLM's or external sources always use the forceNumeric node to cleanse them for downstream use. If multiple numbers are found in the input they will return in an array. |
| `plan` |  | — | — |

---

### `jsonEscape`

Escapes a string for use within a JSON object.

**Plan hint:** Escape JSON

**NTL Syntax:**

```ntl
{{ jsonEscape | about: "Escapes a string for use within a JSON object." | plan: "Escape JSON" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Escapes a string for use within a JSON object. | Escapes a string for use within a JSON object. | Escapes a string for use within a JSON object. |
| `plan` | Escape JSON | Escape JSON | Escape JSON |

---

### `jsonToVars`

Turn a JSON object into variables for use in later steps. By default this will flatten the object into dot and bracket notation EG: var[0], var[1] for an input object {var: ['a','b']}

**NTL Syntax:**

```ntl
{{ jsonToVars | startingPath: "..." | prefix: "..." | flatten: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startingPath` | text | — | Starting path name (optional). Navigate into a nested JSON path before flattening to variables. Use dot notation for nested paths, e.g. 'data.results'. |
| `prefix` | text | — | Prefix (optional). Prepend a prefix to all variable names. e.g. a prefix of 'myPrefix' turns 'test.a.b' into 'myPrefix.test.a.b'. |
| `flatten` | boolean | — | Flatten any nested arrays or objects forund into variables in dot notation of their path. (default true) |

---

### `jsonTools`

Turn a JSON object into flattened variables for use in later steps.

**NTL Syntax:**

```ntl
{{ jsonTools | filter: "..." | filterType: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filter` | text3 | — | A comma separated list of values to filter for |
| `filterType` | — | — | Equals or Not Equals Filter |

---

### `keyFilter`

Filter a JSON Object by list of keys

**NTL Syntax:**

```ntl
{{ keyFilter | filter: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filter` | text2 | — | A comma separated list of keys to filter a json object by |

---

### `pack`

Pack text

**NTL Syntax:**

```ntl
{{ pack | text: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | text5 | — | The text to pack. Leave blank to take the node input |

---

### `reMapJSON`

Remap elements in a JSON object from one key name to another. 

**Plan hint:** Remap JSON

**NTL Syntax:**

```ntl
{{ reMapJSON | match: "..." | replace: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `match` | text | — | The element to match. |
| `replace` | text | — | The replacement. |

---

### `resortArray`

Resort an array by a string of index numbers. Either include a full list of the new indici positions, or a partial list of indicis to order.  EG: -1 would mean make the last array item the first. 3,4 would bring the 3rd and 4th index to the front.

**NTL Syntax:**

```ntl
{{ resortArray | array: "..." | sort: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `array` | — | — | The array |
| `sort` | — | — | A string of numbers separated by comma specifying the new array indici order  |

---

### `unPack`

UnPack text

**NTL Syntax:**

```ntl
{{ unPack | text: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | text5 | — | The text to unpack. Leave blank to take the node input |

---

### `varsToJSON`

Turn flattened variables into JSON object. (The opposite of jsonToVars) 

**NTL Syntax:**

```ntl
{{ varsToJSON | path: "..." | variable: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | text | — | The starting path of the flattened JSON to begin from, in dot notation. |
| `variable` | text | — | The variable to assign the formed JSON to. |

---

## Math, Date & Utilities

### `date`

*(No description)*

**NTL Syntax:**

```ntl
{{ date | timezone: "..." | offset: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timezone` | timezone | — | The timezone |
| `offset` | text | — | The number of days before or after the current day |

---

### `dateTime`

*(No description)*

**NTL Syntax:**

```ntl
{{ dateTime | timezone: "..." | offset: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timezone` | timezone | — | The timezone |
| `offset` | text | — | The number of days before or after the current day |

---

### `math`

Run a mathematical equation using math.js equation syntax

**Plan hint:** Calculate

**NTL Syntax:**

```ntl
{{ math | equation: "..." }}
```

**Chaining example:**

```ntl
{{ math | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `equation` | text | — | The equation, eg: 1+1 |

---

### `time`

*(No description)*

**NTL Syntax:**

```ntl
{{ time | timezone: "..." | offset: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timezone` | timezone | — | The timezone |
| `offset` | text | — | The number of hours before or after the current hour |

---

### `uuid`

*(No description)*

**NTL Syntax:**

```ntl
{{ uuid | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `plan` |  | — | — |

---

## Security & Encoding

### `b64decode`

Take input text and decode it from Base64 encoding.

**NTL Syntax:**

```ntl
{{ b64decode | about: "Take input text and decode it from Base64 encoding." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Take input text and decode it from Base64 encoding. | Take input text and decode it from Base64 encoding. | Take input text and decode it from Base64 encoding. |
| `plan` |  | — | — |

---

### `b64encode`

Take input text and encode it to Base64 encoding.

**NTL Syntax:**

```ntl
{{ b64encode | about: "Take input text and encode it to Base64 encoding." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Take input text and encode it to Base64 encoding. | Take input text and encode it to Base64 encoding. | Take input text and encode it to Base64 encoding. |
| `plan` |  | — | — |

---

### `cleanSQL`

Cleanse SQL.

**Plan hint:** Validate SQL

**NTL Syntax:**

```ntl
{{ cleanSQL | reformat: "false" | onlySelect: "true" | dbType: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `reformat` | — | false | Parse and reformat the SQL |
| `onlySelect` | — | true | Only allow select statements |
| `dbType` | — | — | The type of database |

---

### `urldecode`

Take input text and URL decode it.

**NTL Syntax:**

```ntl
{{ urldecode | about: "Take input text and URL decode it." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Take input text and URL decode it. | Take input text and URL decode it. | Take input text and URL decode it. |
| `plan` |  | — | — |

---

### `urlencode`

Take input text and URL encode it.

**NTL Syntax:**

```ntl
{{ urlencode | about: "Take input text and URL encode it." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Take input text and URL encode it. | Take input text and URL encode it. | Take input text and URL encode it. |
| `plan` |  | — | — |

---

## Code Sandboxes

### `javascriptSandbox`

Run arbitrary javascript ESM code. You must use import and not require (CJS)

**NTL Syntax:**

```ntl
{{ javascriptSandbox | script: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `script` | text10 | — | The script |

---

### `pythonSandbox`

Run arbitrary Python code.

**NTL Syntax:**

```ntl
{{ pythonSandbox | script: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `script` | text10 | — | The script |

---

## Charts & Visualization

### `areaChart`

Create an area chart in HTML. 

**Plan hint:** Create chart

**NTL Syntax:**

```ntl
{{ areaChart | title: "..." | data: "..." | labels: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title. |
| `data` | text3 | — | An Array of objects of the data. |
| `labels` | text | — | An array of labels (x axis) |

---

### `barChart`

Create a bar chart in HTML. 

**Plan hint:** Create chart

**NTL Syntax:**

```ntl
{{ barChart | title: "..." | data: "..." | labels: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title. |
| `data` | text3 | — | An Array of objects of the data. |
| `labels` | text | — | An array of labels (x axis) |

---

### `bubbleChart`

Create a bubble chart in HTML. 

**Plan hint:** Create chart

**NTL Syntax:**

```ntl
{{ bubbleChart | title: "..." | data: "..." | labels: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title. |
| `data` | text3 | — | An Array of objects of the data. |
| `labels` | text | — | An array of labels (x axis) |

---

### `doughnutChart`

Create a Doughnut chart in HTML. 

**Plan hint:** Create chart

**NTL Syntax:**

```ntl
{{ doughnutChart | title: "..." | data: "..." | labels: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title. |
| `data` | text3 | — | An Array of objects of the data. |
| `labels` | text | — | An array of labels (x axis) |

---

### `lineChart`

Create a line chart in HTML. 

**Plan hint:** Create chart

**NTL Syntax:**

```ntl
{{ lineChart | title: "..." | data: "..." | labels: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title. |
| `data` | text3 | — | An Array of objects of the data. |
| `labels` | text | — | An array of labels (x axis) |

---

### `pieChart`

Create a pie chart in HTML. 

**Plan hint:** Create chart

**NTL Syntax:**

```ntl
{{ pieChart | title: "..." | data: "..." | labels: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title. |
| `data` | text3 | — | An Array of objects of the data. |
| `labels` | text | — | An array of labels (x axis) |

---

## Web, REST & Search

### `bingSearch`

Search the web using Bing.

**Plan hint:** Web search

**NTL Syntax:**

```ntl
{{ bingSearch | query: "..." }}
```

**Chaining example:**

```ntl
{{ bingSearch | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The search query |

---

### `braveSearch`

Search the web using Brave.

**Plan hint:** Web search

**NTL Syntax:**

```ntl
{{ braveSearch | query: "..."
                  | apiKey: "..."
                  | count: "..."
                  | cache: "..." }}
```

**Chaining example:**

```ntl
{{ braveSearch | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The search query |
| `apiKey` | password | — | Your api key |
| `count` | slider | — | — |
| `cache` | boolean | — | Cache results |

---

### `cleanHTML`

Cleanse HTML.

**Plan hint:** Clean HTML

**NTL Syntax:**

```ntl
{{ cleanHTML | selectors: "['']" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selectors` | text | [''] | An array of CSS selectors to remove from the HTML |

---

### `duckSearch`

Search the web using DuckDuckGo.

**Plan hint:** Web search

**NTL Syntax:**

```ntl
{{ duckSearch | query: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The search query |

---

### `googleSearch`

Search the web using Google.

**Plan hint:** Web search

**NTL Syntax:**

```ntl
{{ googleSearch | query: "..." | apiKey: "..." | engine: "..." }}
```

**Chaining example:**

```ntl
{{ googleSearch | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The search query |
| `apiKey` | password | — | Google API Key |
| `engine` | text | — | Programmable Search Engine ID |

---

### `jwtCreate`

Create/Sign a JWT

**Plan hint:** Create JWT

**NTL Syntax:**

```ntl
{{ jwtCreate | signingkey: "..." | algorithm: "RS256" | body: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `signingkey` | password | — | Private key for signing the JWT |
| `algorithm` | — | RS256 | Algorithm for signing the JWT |
| `body` | text6 | — | JWT payload, must be valid JSON |

---

### `linkRipper`

Scrape a webpage for links and return a JSON array of objects of the links.

**Plan hint:** Extract links

**NTL Syntax:**

```ntl
{{ linkRipper | url: "..." | filters: "['']" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text | — | The URL to scrape |
| `filters` | text | [''] | An array of filters to remove from the links |

---

### `post`

Send a REST request and return the received data

**Plan hint:** Call REST API

**NTL Syntax:**

```ntl
{{ post | url: "..."
           | headers: "..."
           | username: "..."
           | password: "..."
           | apikey: "..."
           | body: "..."
           | operation: "..."
           | tlsverify: "..."
           | jsonToVars: "..."
           | filename: "..."
           | attachment: "..." }}
```

**Chaining example:**

```ntl
{{ post | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text | — | The URL to send the POST to |
| `headers` | text | — | The JSON formatted header |
| `username` | text | — | Username for APIs using Basic Auth |
| `password` | password | — | Password for APIs using Basic Auth |
| `apikey` | password | — | API Key for APIs using Oauth/Bearer tokens |
| `body` | text | — | The message body |
| `operation` | — | — | The REST operation |
| `tlsverify` | boolean | — | TLS certificate verification (defaults to true) |
| `jsonToVars` | boolean | — | Transform response JSON to variables |
| `filename` | text | — | Save the output to a file directly |
| `attachment` | text | — | Attach a file to the operation |

---

### `web`

Scrape a webpage or a document from a URL and cleanse and return the text on it.

**Plan hint:** Scrape webpage

**NTL Syntax:**

```ntl
{{ web | url: "..." | selectors: "['']" }}
```

**Chaining example:**

```ntl
{{ web | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text | — | The URL to scrape |
| `selectors` | text | [''] | An array of CSS selectors to remove from the HTML |

---

### `yahooSearch`

Search the web using Yahoo.

**Plan hint:** Web search

**NTL Syntax:**

```ntl
{{ yahooSearch | query: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The search query |

---

## File Operations

### `convertToHTML`

Convert a document to HTML

**Plan hint:** Convert to HTML

**NTL Syntax:**

```ntl
{{ convertToHTML | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | document | — | The source PDF |

---

### `createDOC`

Create a local Microsoft Word file.

**Plan hint:** Create Word doc

**NTL Syntax:**

```ntl
{{ createDOC | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | text | — | The filename |

---

### `createFile`

Create a local file.

**Plan hint:** Create file

**NTL Syntax:**

```ntl
{{ createFile | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | text | — | The filename |

---

### `createPDF`

Create a local PDF file.

**Plan hint:** Create PDF

**NTL Syntax:**

```ntl
{{ createPDF | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | text | — | The filename |

---

### `createPPT`

Create a local file.

**Plan hint:** Create PowerPoint

**NTL Syntax:**

```ntl
{{ createPPT | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | text | — | The filename |

---

### `deleteFile`

Delete a local file.

**NTL Syntax:**

```ntl
{{ deleteFile | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | text | — | The filename |

---

### `htmlToPDF`

Convert HTML to PDF

**Plan hint:** Convert to PDF

**NTL Syntax:**

```ntl
{{ htmlToPDF | file: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | document | — | The source HTML |

---

### `readB64Doc`

Read a local document as base64 encoded data

**Plan hint:** Read document

**NTL Syntax:**

```ntl
{{ readB64Doc | name: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | document | — | The document name |

---

### `saveB64Doc`

Save a base64 encoded document

**Plan hint:** Save document

**NTL Syntax:**

```ntl
{{ saveB64Doc | name: "..." | base64String: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text | — | The document name |
| `base64String` | text5 | — | The base 64 encoded document string |

---

## Database Connectors

### `bigquery`

Connect to a BigQuery database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ bigquery | query: "..."
               | projectId: "..."
               | credentials: "..."
               | location: "..."
               | sentences: "true" }}
```

**Chaining example:**

```ntl
{{ bigquery | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The BigQuery query |
| `projectId` | text | — | The Project Id |
| `credentials` | text | — | Your credentials (JSON) |
| `location` | text | — | The dataset location |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `databricks`

Connect to Databricks SQL and run a query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ databricks | query: "..."
                 | host: "..."
                 | path: "..."
                 | token: "..."
                 | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The SQL query to run |
| `host` | text | — | The Databricks workspace hostname (e.g. adb-xxxx.azuredatabricks.net) |
| `path` | text | — | The SQL Warehouse HTTP path (e.g. /sql/1.0/warehouses/abcdef123) |
| `token` | password | — | The personal access token for authentication |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `db2`

Connect to a DB2 database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ db2 | query: "..."
          | DATABASE: "..."
          | HOSTNAME: "..."
          | UID: "..."
          | PWD: "..."
          | PORT: "..."
          | SECURE: "true"
          | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The DB2 query |
| `DATABASE` | text | — | The Database name |
| `HOSTNAME` | text | — | The DB hostname |
| `UID` | text | — | The user Id |
| `PWD` | password | — | The password |
| `PORT` | number | — | The port number |
| `SECURE` | boolean | true | Use SSL |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `elastic`

Run an exists, index, get, search, update, delete, create index, delete index or delete by query operation on ElasticSearch

**Plan hint:** Query Elastic

**NTL Syntax:**

```ntl
{{ elastic | operation: "get" | credentials: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `operation` | — | get | The Elastic operation |
| `credentials` | text6 | — | The elastic credentials JSON object. Leave blank if you have configured ElasticSearch as your Seek KB and want to use those. EG:{'node': 'https://fd109b3.us-west-2.aws.found.io', 'auth': {'apiKey': 'cTRlNUZKRUJYncGtN01tUQ=='}, 'tls':{'rejectUnauthorized': false } } |

---

### `mariadb`

Connect to a MariaDB database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ mariadb | query: "..." | uri: "..." | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The MariaDB query |
| `uri` |  | — | A connection string in the format: user:pass@example.com:3306/dbname |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `mssql`

Connect to a MS SQL database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ mssql | query: "..." | uri: "..." | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The MS SQL query |
| `uri` |  | — | A connection string in the format: user:pass@example.com:1433/dbname |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `mysql`

Connect to a MySQL database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ mysql | query: "..." | uri: "..." | sentences: "true" }}
```

**Chaining example:**

```ntl
{{ mysql | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The MySQL query |
| `uri` |  | — | A connection string in the format: user:pass@example.com:3306/dbname |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `neo4j`

Connect to Neo4j and run a cypher query, returning the data.

**Plan hint:** Query graph DB

**NTL Syntax:**

```ntl
{{ neo4j | query: "..."
            | boltURI: "..."
            | username: "..."
            | password: "..."
            | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The cypher query |
| `boltURI` | text | — | The bolt URI to use |
| `username` | text | — | The username to use |
| `password` | password | — | The password to use |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `oracle`

Connect to a Oracle database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ oracle | query: "..." | uri: "..." | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The Oracle query |
| `uri` |  | — | A connection string in the format: user:pass@example.com:1521/dbname |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `postgres`

Connect to a Postgres database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ postgres | query: "..."
               | uri: "..."
               | sentences: "true"
               | rds: "false"
               | ssl: "true" }}
```

**Chaining example:**

```ntl
{{ postgres | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The Postgres query |
| `uri` |  | — | A connection string in the format: user:pass@example.com:5432/dbname |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |
| `rds` | boolean | false | Is this connection using an RDS Proxy? |
| `ssl` | boolean | true | Use a secure connection (SSL) |

---

### `redshift`

Connect to a Redshift database and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ redshift | query: "..." | uri: "..." | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The redshift query |
| `uri` |  | — | A connection string in the format: user:pass@example.com:5432/dbname |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `snowflake`

Connect to Snowflake and run a sql query, returning the data.

**Plan hint:** Query database

**NTL Syntax:**

```ntl
{{ snowflake | query: "..."
                | accessUrl: "..."
                | username: "..."
                | password: "..."
                | database: "..."
                | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The Snowflake query |
| `accessUrl` | text | — | The account URL to use, from Admin/Accounts/Manage URLs. EG: https://abcd-hijk.snowflakecomputing.com |
| `username` | text | — | The username to use |
| `password` | password | — | The password to use |
| `database` | text | — | The database to use |
| `sentences` | boolean | true | Return in sentences (true) or as CSV (false) |

---

### `watsonDiscovery`

Connect to the Watson Discovery api

**Plan hint:** Query Discovery

**NTL Syntax:**

```ntl
{{ watsonDiscovery | operation: "query" | url: "..." | apiKey: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `operation` | — | query | The Discovery operation |
| `url` | text1 | — | The url. Leave blank if you have configured Discovery as your Seek KB and want to use that url. |
| `apiKey` | text1 | — | The apiKey. Leave blank if you have configured Discovery as your Seek KB and want to use that apiKey. |

---

## Caching

### `deleteCacheIndex`

Delete an index from local cache

**NTL Syntax:**

```ntl
{{ deleteCacheIndex | index: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |

---

### `deleteCacheKey`

Delete a key from local cache

**NTL Syntax:**

```ntl
{{ deleteCacheKey | index: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |
| `key` | text | — | The key |

---

### `listCacheIndexes`

List all current Cache Indexes

**NTL Syntax:**

```ntl
{{ listCacheIndexes | about: "List all current Cache Indexes" | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | List all current Cache Indexes | List all current Cache Indexes | List all current Cache Indexes |
| `plan` |  | — | — |

---

### `listCacheKeys`

List all keys on a Cache Index

**NTL Syntax:**

```ntl
{{ listCacheKeys | index: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |

---

### `phoneticSearchCacheIndex`

Phonetic search an index in local cache by value

**NTL Syntax:**

```ntl
{{ phoneticSearchCacheIndex | index: "..." | value: "..." | blockchars: "3" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |
| `value` | text | — | The search value |
| `blockchars` | slider | 3 | — |

---

### `readCacheKey`

Read from local cache

**NTL Syntax:**

```ntl
{{ readCacheKey | index: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |
| `key` | text | — | The key |

---

### `searchCacheIndex`

Search an index in local cache by index key

**NTL Syntax:**

```ntl
{{ searchCacheIndex | index: "..." | value: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |
| `value` | text | — | The key or partial key to search for |

---

### `writeCacheKey`

Write a key to local cache. Pass a single string, an array, or values separated by comma or newline

**NTL Syntax:**

```ntl
{{ writeCacheKey | index: "..."
                    | key: "..."
                    | timeExpire: "..."
                    | value: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |
| `key` | text | — | The key |
| `timeExpire` | text | — | The expiration time in seconds (maximum 1 day / 86400 seconds) |
| `value` | text5 | — | The Value |

---

### `writePhoneticCacheKey`

Write a value to local cache with automatic phonetic keying. Takes either node input or defined value. Pass a single string, an array, or values separated by comma or newline

**NTL Syntax:**

```ntl
{{ writePhoneticCacheKey | index: "..." | value: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | text | — | The index |
| `value` | text5 | — | The Value |

---

## Cloud Storage (AWS S3)

### `s3Delete`

Connect to AWS s3 and delete a file

**Plan hint:** Delete from S3

**NTL Syntax:**

```ntl
{{ s3Delete | key: "..."
               | bucket: "..."
               | region: "..."
               | accessKeyId: "..."
               | secretAccessKey: "..."
               | endpoint: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | text | — | The filename in S3 to delete |
| `bucket` | text | — | The bucket name |
| `region` | text | — | The provider's region |
| `accessKeyId` | text | — | Access Key or ID |
| `secretAccessKey` | password | — | Access Key Secret |
| `endpoint` |  | — | Override S3 endpoint |

---

### `s3List`

Connect to AWS s3 and list objects

**Plan hint:** List S3 objects

**NTL Syntax:**

```ntl
{{ s3List | bucket: "..."
             | prefix: "..."
             | region: "..."
             | accessKeyId: "..."
             | secretAccessKey: "..."
             | endpoint: "..."
             | maxKeys: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bucket` | text | — | The bucket name |
| `prefix` | text | — | Optional prefix to filter keys |
| `region` | text | — | The provider's region |
| `accessKeyId` | text | — | Access Key or ID |
| `secretAccessKey` | password | — | Access Key Secret |
| `endpoint` | text | — | Override S3 endpoint |
| `maxKeys` | text | — | Maximum number of objects to return (optional) |

---

### `s3Read`

Connect to AWS s3 and read a file

**Plan hint:** Read from S3

**NTL Syntax:**

```ntl
{{ s3Read | key: "..."
             | bucket: "..."
             | region: "..."
             | accessKeyId: "..."
             | secretAccessKey: "..."
             | endpoint: "..."
             | filename: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | text | — | The filename in S3 to read |
| `bucket` | text | — | The bucket name |
| `region` | text | — | The provider's region |
| `accessKeyId` | text | — | Access Key or ID |
| `secretAccessKey` | password | — | Access Key Secret |
| `endpoint` |  | — | Override S3 endpoint |
| `filename` | text | — | Optional - save the file locally with this name |

---

### `s3Write`

Connect to AWS s3 and write a file

**Plan hint:** Write to S3

**NTL Syntax:**

```ntl
{{ s3Write | data: "..."
              | key: "..."
              | bucket: "..."
              | region: "..."
              | accessKeyId: "..."
              | secretAccessKey: "..."
              | endpoint: "..."
              | filename: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | text4 | — | The data to write (or leave blank to use chain input) |
| `key` | text | — | The filename in S3 to write |
| `bucket` | text | — | The bucket name |
| `region` | text | — | The provider's region |
| `accessKeyId` | text | — | Access Key or ID |
| `secretAccessKey` | password | — | Access Key Secret |
| `endpoint` | text | — | Override S3 endpoint |
| `filename` | document | — | Optional - read and upload this local file instead of data |

---

## Cloud Storage (Azure Blob)

### `azBlobDelete`

Connect to Azure Blob Storage and delete a blob

**Plan hint:** Delete from Azure Blob

**NTL Syntax:**

```ntl
{{ azBlobDelete | blobName: "..." | containerName: "..." | connectionString: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `blobName` | text | — | The blob name (path) to delete |
| `containerName` | text | — | The container name |
| `connectionString` | password | — | Azure Storage connection string |

---

### `azBlobList`

Connect to Azure Blob Storage and list blobs

**Plan hint:** List Azure Blobs

**NTL Syntax:**

```ntl
{{ azBlobList | containerName: "..."
                 | connectionString: "..."
                 | prefix: "..."
                 | maxResults: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `containerName` | text | — | The container name |
| `connectionString` | password | — | Azure Storage connection string |
| `prefix` | text | — | Optional prefix to filter blobs |
| `maxResults` | text | — | Maximum number of blobs to return (optional) |

---

### `azBlobListContainers`

Connect to Azure Blob Storage and list containers

**Plan hint:** List Azure Blob containers

**NTL Syntax:**

```ntl
{{ azBlobListContainers | connectionString: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `connectionString` | password | — | Azure Storage connection string |

---

### `azBlobRead`

Connect to Azure Blob Storage and read a blob

**Plan hint:** Read from Azure Blob

**NTL Syntax:**

```ntl
{{ azBlobRead | blobName: "..."
                 | containerName: "..."
                 | connectionString: "..."
                 | filename: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `blobName` | text | — | The blob name (path) to read |
| `containerName` | text | — | The container name |
| `connectionString` | password | — | Azure Storage connection string |
| `filename` | text | — | Optional - save the file locally with this name |

---

### `azBlobWrite`

Connect to Azure Blob Storage and write a blob

**Plan hint:** Write to Azure Blob

**NTL Syntax:**

```ntl
{{ azBlobWrite | data: "..."
                  | blobName: "..."
                  | containerName: "..."
                  | connectionString: "..."
                  | filename: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | text4 | — | The data to write (or leave blank to use chain input) |
| `blobName` | text | — | The blob name (path) to write |
| `containerName` | text | — | The container name |
| `connectionString` | password | — | Azure Storage connection string |
| `filename` | document | — | Optional - read and upload this local file instead of data |

---

## SFTP

### `sftpListFolder`

Connect to SFTP and list a folder, returning the data.

**Plan hint:** List SFTP folder

**NTL Syntax:**

```ntl
{{ sftpListFolder | folder: "..."
                     | host: "..."
                     | port: "..."
                     | user: "..."
                     | password: "..."
                     | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folder` | text | — | The path to list |
| `host` | text | — | The hostname or ip |
| `port` | text | — | The port |
| `user` | text | — | The username |
| `password` | password | — | Password. Enter this or the key |
| `key` | text4 | — | SSH Key. Enter this or the password |

---

### `sftpReadFile`

Connect to SFTP and read a file, saving it locally.

**Plan hint:** Read from SFTP

**NTL Syntax:**

```ntl
{{ sftpReadFile | name: "..."
                   | folder: "..."
                   | host: "..."
                   | port: "..."
                   | user: "..."
                   | password: "..."
                   | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text | — | The file to read |
| `folder` | text | — | The path the file will be read from |
| `host` | text | — | The hostname or ip |
| `port` | text | — | The port |
| `user` | text | — | The username |
| `password` | password | — | Password. Enter this or the key |
| `key` | text4 | — | SSH Key. Enter this or the password |

---

### `sftpWriteFile`

Connect to SFTP and write a file.

**Plan hint:** Write to SFTP

**NTL Syntax:**

```ntl
{{ sftpWriteFile | name: "..."
                    | folder: "..."
                    | host: "..."
                    | port: "..."
                    | user: "..."
                    | password: "..."
                    | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | document | — | The file to write |
| `folder` | text | — | The path the file will be written to |
| `host` | text | — | The hostname or ip |
| `port` | text | — | The port |
| `user` | text | — | The username |
| `password` | password | — | Password. Enter this or the key |
| `key` | text4 | — | SSH Key. Enter this or the password |

---

## Email (SMTP)

### `createEmail`

Create a .eml file, output as a string. Takes the input of the parseEmail node to recreate a .eml.

**Plan hint:** Create email file

**NTL Syntax:**

```ntl
{{ createEmail | emlJSON: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `emlJSON` | text5 | — | The eml input JSON (parseEmail output) |

---

### `email`

Connect to an SMTP server and send an email. Leave the host, port, user, password, and from fields blank to use the NS default email.

**Plan hint:** Send email

**NTL Syntax:**

```ntl
{{ email | to: "..."
            | subject: "..."
            | message: "..."
            | attachment: "..."
            | host: "..."
            | port: "465"
            | user: "..."
            | pass: "..."
            | from: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `to` | text | — | The Email 'to' address. Separate multiple by comma. |
| `subject` | text | — | The Email subject |
| `message` | text | — | The Email body |
| `attachment` | document | — | Optional Attachments. Separate multiple attachements filenames by newline or semicolon |
| `host` | text | — | The SMTP server (optional) |
| `port` | text | 465 | The SMTP server port (optional) |
| `user` | text | — | The Email username (optional) |
| `pass` | password | — | The Email password (optional) |
| `from` | text | — | The Email 'from' address (optional) |

---

### `parseEmail`

Read and parse an email in either .eml or .msg format.

**Plan hint:** Parse email

**NTL Syntax:**

```ntl
{{ parseEmail | name: "..." | data: "..." | includeHeaders: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | document | — | The email file (.eml or .msg). Include this or the email data. |
| `data` | text3 | — | The email data. Include this or the file name |
| `includeHeaders` | boolean | — | Return the email headers (Default False) |

---

## Google Gmail

### `gmailDelete`

Delete a gmail email. Requires a JSON key and a email id.

**Plan hint:** Delete an email

**NTL Syntax:**

```ntl
{{ gmailDelete | emailId: "..." | userId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `emailId` | text | — | The email ID. |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `gmailGetEmail`

Get a gmail email. Requires a JSON key and a email id.

**Plan hint:** Get an email

**NTL Syntax:**

```ntl
{{ gmailGetEmail | emailId: "..." | userId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `emailId` | text | — | The email ID. |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `gmailList`

List a gmail inbox. Requires a JSON key.

**Plan hint:** List a gmail inbox

**NTL Syntax:**

```ntl
{{ gmailList | timeMin: "..."
                | timeMax: "..."
                | userId: "..."
                | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timeMin` | text | — | The minimum time |
| `timeMax` | text | — | The max time |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `gmailMove`

Move a gmail email. Requires a JSON key and a email id.

**Plan hint:** Move an email

**NTL Syntax:**

```ntl
{{ gmailMove | folder: "..."
                | emailId: "..."
                | userId: "..."
                | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folder` | text | — | The folder to move to |
| `emailId` | text | — | The email ID. |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `gmailReply`

List a gmail inbox. Requires a JSON key.

**Plan hint:** List a gmail inbox

**NTL Syntax:**

```ntl
{{ gmailReply | text: "..."
                 | emailId: "..."
                 | replyAll: "..."
                 | userId: "..."
                 | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | text3 | — | The reply text |
| `emailId` | text | — | The email ID |
| `replyAll` | boolean | — | Reply to all? |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `gmailSearch`

Search gmail. Requires a JSON key.

**Plan hint:** Search Gmail

**NTL Syntax:**

```ntl
{{ gmailSearch | search: "..." | userId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | text | — | The search query. |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `gmailSend`

Send a gmail email. Requires a JSON key.

**Plan hint:** Add an email

**NTL Syntax:**

```ntl
{{ gmailSend | to: "..."
                | cc: "..."
                | bcc: "..."
                | subject: "..."
                | html: "..."
                | userId: "..."
                | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `to` | text | — | To. |
| `cc` | text | — | CC. |
| `bcc` | text | — | BCC. |
| `subject` | text | — | Subject. |
| `html` | text5 | — | HTML. |
| `userId` | text | — | The user ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

## Google Calendar

### `googleCalendarAddEvent`

Add a google calendar event. Requires a JSON key and a calendar id.

**Plan hint:** Add a calendar event

**NTL Syntax:**

```ntl
{{ googleCalendarAddEvent | calendarId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `calendarId` | text | — | The calendar ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `googleCalendarDeleteEvent`

Delete a google calendar event. Requires a JSON key and a calendar id.

**Plan hint:** Delete a calendar event

**NTL Syntax:**

```ntl
{{ googleCalendarDeleteEvent | eventId: "..." | calendarId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `eventId` | text | — | The event ID. |
| `calendarId` | text | — | The calendar ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `googleCalendarGetEvent`

Get a google calendar event. Requires a JSON key and a calendar id.

**Plan hint:** Get a calendar event

**NTL Syntax:**

```ntl
{{ googleCalendarGetEvent | eventId: "..." | calendarId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `eventId` | text | — | The event ID. |
| `calendarId` | text | — | The calendar ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `googleCalendarList`

Search a google calendar. Requires a JSON key and a calendar id.

**Plan hint:** List a Google calendar

**NTL Syntax:**

```ntl
{{ googleCalendarList | timeMin: "..."
                         | timeMax: "..."
                         | calendarId: "..."
                         | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timeMin` | text | — | The minimum time |
| `timeMax` | text | — | The max time |
| `calendarId` | text | — | The calendar ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `googleCalendarSearch`

Search a google calendar. Requires a JSON key and a calendar id.

**Plan hint:** Search a Google calendar

**NTL Syntax:**

```ntl
{{ googleCalendarSearch | search: "..."
                           | timeMin: "..."
                           | timeMax: "..."
                           | calendarId: "..."
                           | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | text | — | The search query. |
| `timeMin` | text | — | The minimum time |
| `timeMax` | text | — | The max time |
| `calendarId` | text | — | The calendar ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

### `googleCalendarUpdateEvent`

Update a google calendar event. Requires a JSON key and a calendar id.

**Plan hint:** Update a calendar event

**NTL Syntax:**

```ntl
{{ googleCalendarUpdateEvent | eventId: "..." | calendarId: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `eventId` | The event ID. | — | The event ID. |
| `calendarId` | text | — | The calendar ID (typically your email address) |
| `key` | text5 | — | The Google Service account key, in JSON format |

---

## Google Drive

### `readGoogleDrive`

Read from Google Drive. To set this up, enable the Google Drive API and create a service account and JSON key. Then in your Google drive, choose a folder ID to write to and share it with the service account's email. The folder ID is viewable in the URL when in that folder in Googgle Drive.

**Plan hint:** Read from Drive

**NTL Syntax:**

```ntl
{{ readGoogleDrive | title: "..."
                      | id: "..."
                      | key: "..."
                      | folder: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The document title. Either this or the ID are required. |
| `id` | text | — | The ID of the document. Either this or the title are required. |
| `key` | text5 | — | The Google Service account key, in JSON format |
| `folder` | text | — | The folder ID containing the file. Ensure you have shared it with the service account |

---

### `writeGoogleDrive`

Write text to Google Drive. To set this up, enable the Google Drive API and create a service account and JSON key. Then in your Google drive, choose a folder ID to write to and share it with the service account's email. The folder ID is viewable in the URL when in that folder in Googgle Drive.

**Plan hint:** Write to Drive

**NTL Syntax:**

```ntl
{{ writeGoogleDrive | title: "..." | key: "..." | folder: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The document title |
| `key` | text5 | — | The Google Service account key, in JSON format |
| `folder` | text | — | The folder ID to write to. Ensure you have shared it with the service account |

---

## Slack

### `slackApi`

Connect to any of Slack's API methods. See https://docs.slack.dev for more details.

**Plan hint:** Call Slack API

**NTL Syntax:**

```ntl
{{ slackApi | method: "..."
               | payload: "..."
               | token: "..."
               | outputJSON: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `method` | text | — | The API method to call (e.g. chat.postMessage) |
| `payload` | text6 | — | The JSON payload for the API method |
| `token` | password | — | A user, bot, or app token with correct permissions. |
| `outputJSON` | boolean | — | Output the response as JSON instead of variables. (default to false) |

---

### `slackConversationHistory`

Connect to Slack and get the conversation history for a channel. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc

**Plan hint:** Get Slack history

**NTL Syntax:**

```ntl
{{ slackConversationHistory | channel: "..."
                               | token: "..."
                               | arguments: "..."
                               | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `channel` | text1 | — | The channel to pull history from |
| `token` | password | — | A user, bot, or app token with correct permissions. |
| `arguments` | text2 | — | Additional arguments, separated by comma. EG: limit=2, oldest=1234567890.123456 |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

### `slackEventCancel`

This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running.

**NTL Syntax:**

```ntl
{{ slackEventCancel | about: "This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running. | This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running. | This node is used only for Slack integration, to cancel an event. This will prevent follow-up hooks from running. |
| `plan` |  | — | — |

---

### `slackEventIn`

This node is used only for Slack integration, to fulfill incoming events as hooks. This node must be the first step in a mAIstro flow.All parameters from Slack's Event object are accessible here.This node provides, but is not limited to, the following mAIstro variables:slackEventIn.type: The triggering event type.slackEventIn.event: The event object from Slack.slackEventIn.view: The view object from Slack.slackEventIn.actions: The actions object from Slack.slackEventIn.oauthToken: Your configured slack token for outgoing API calls.

**NTL Syntax:**

```ntl
{{ slackEventIn | placeholder: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | boolean | — | Enable to send the configured placeholder message. Disable this to skip the initial message. Useful when you don't need custom slack messaging payloads. |

---

### `slackEventOut`

This node is used only for Slack integration, to fulfill outgoing events as hooks. This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack.

**NTL Syntax:**

```ntl
{{ slackEventOut | about: "This node is used only for Slack integration, to fulfill outgoing events as hooks. This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for Slack integration, to fulfill outgoing events as hooks. This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack. | This node is used only for Slack integration, to fulfill outgoing events as hooks. This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack. | This node is used only for Slack integration, to fulfill outgoing events as hooks. This node must be the last step in a mAIstro flow. This node disables the automatic answer output to slack. |
| `plan` |  | — | — |

---

### `slackPostMessage`

Connect to Slack and post a message. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc

**Plan hint:** Send Slack message

**NTL Syntax:**

```ntl
{{ slackPostMessage | message: "..."
                       | channel: "..."
                       | token: "..."
                       | arguments: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `message` | text5 | — | The message to send |
| `channel` | text | — | The channel to send the message in |
| `token` | password | — | A user, bot, or app token with correct permissions. |
| `arguments` | text2 | — | Additional arguments, separated by comma. EG: sort=score, sort_dir=desc |

---

### `slackSearch`

Connect to Slack and run a search for messages based on the provided query. You may provide additional arguments to the arguments option, separated by comma. EG: sort=score, sort_dir=desc

**Plan hint:** Search Slack

**NTL Syntax:**

```ntl
{{ slackSearch | query: "..."
                  | token: "..."
                  | arguments: "..."
                  | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text2 | — | The search. Qualifiers are supported |
| `token` | password | — | A user, bot, or app token with correct permissions. |
| `arguments` | text2 | — | Additional arguments, separated by comma. EG: sort=score, sort_dir=desc |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

### `slackSendMessage`

Connect to Slack and post a message. You may provide the blockkit array, a body override, or just the message text. You may also provide a thread timestamp to send the message in a thread.

**Plan hint:** Send Slack message

**NTL Syntax:**

```ntl
{{ slackSendMessage | message: "..."
                       | channel: "..."
                       | token: "..."
                       | body: "..."
                       | thread_ts: "..."
                       | reply: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `message` | text2 | — | The message to send as text. Use this OR blockkit body, not both. |
| `channel` | text | — | The channel to send the message in. Use 'event' if you want to automatically reply to the incoming event. |
| `token` | password | — | A user, bot, or app token with correct permissions. |
| `body` | text5 | — | The json/blockkit body of the message. If not provided, the message will be sent as a markdown message. |
| `thread_ts` | text | — | The thread timestamp to send the message in. If not provided, the message will be sent as a new thread. Use 'event' if you want to automatically reply to the incoming event. |
| `reply` | boolean | — | Enable to automatically fill token, channel, and thread_ts to reply to the incoming event. |

---

## Jira

### `jiraAddIssue`

Connect to Jira add an issue to the specified project, based on project id or key.

**Plan hint:** Create Jira issue

**NTL Syntax:**

```ntl
{{ jiraAddIssue | summary: "..."
                   | description: "..."
                   | project: "..."
                   | raw: "..."
                   | URI: "..."
                   | username: "..."
                   | apitoken: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `summary` | text | — | The title of the Issue |
| `description` | text4 | — | The issue description |
| `project` | text | — | The project id or key to add the issue to |
| `raw` | text | — | Optional - pass a JSON Issue object to create the issue. This overrides summary and description. |
| `URI` | text | — | — |
| `username` | text | — | The username to use |
| `apitoken` | password | — | The API token to use |

---

### `jiraEditIssue`

*(No description)*

**Plan hint:** Update Jira issue

**NTL Syntax:**

```ntl
{{ jiraEditIssue | id: "..."
                    | raw: "..."
                    | URI: "..."
                    | username: "..."
                    | apitoken: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | text | — | The Jira Issue id or key |
| `raw` | text5 | — | — |
| `URI` | text | — | — |
| `username` | text | — | The username to use |
| `apitoken` | password | — | The API token to use |

---

### `jiraGetIssue`

Connect to Jira and get details about an issue by passing an issue id or key to the id option.

**Plan hint:** Get Jira issue

**NTL Syntax:**

```ntl
{{ jiraGetIssue | id: "..."
                   | URI: "..."
                   | username: "..."
                   | apitoken: "..."
                   | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | text | — | The Jira Issue id or key |
| `URI` | text | — | — |
| `username` | text | — | The username to use |
| `apitoken` | password | — | The API token to use |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

### `jiraGetProjects`

Connect to Jira and list all projects.

**Plan hint:** List Jira projects

**NTL Syntax:**

```ntl
{{ jiraGetProjects | URI: "..."
                      | username: "..."
                      | apitoken: "..."
                      | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `URI` | text | — | — |
| `username` | text | — | The username to use |
| `apitoken` | password | — | The API token to use |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

### `jiraSearch`

Connect to Jira and run a search based on the provided query, returning the data.

**Plan hint:** Search Jira

**NTL Syntax:**

```ntl
{{ jiraSearch | query: "..."
                 | URI: "..."
                 | username: "..."
                 | apitoken: "..."
                 | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text3 | — | The Jira search |
| `URI` | text | — | — |
| `username` | text | — | The username to use |
| `apitoken` | password | — | The API token to use |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

## GitHub

### `githubAddIssue`

Connect to Github add an issue to the specified repository.

**Plan hint:** Create GitHub issue

**NTL Syntax:**

```ntl
{{ githubAddIssue | title: "..."
                     | description: "..."
                     | owner: "..."
                     | repo: "..."
                     | token: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | text | — | The title of the Issue |
| `description` | text4 | — | The issue description |
| `owner` | text | — | The Github Account |
| `repo` | text | — | The Github Repository |
| `token` | password | — | A personal access token, an OAuth token, an installation access token or a JSON Web Token for GitHub App authentication |

---

### `githubEditIssue`

Connect to Github and edit an issue. Pass the Github Issue number and updates to the title and description.

**Plan hint:** Update GitHub issue

**NTL Syntax:**

```ntl
{{ githubEditIssue | issueNumber: "..."
                      | title: "..."
                      | description: "..."
                      | owner: "..."
                      | repo: "..."
                      | token: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `issueNumber` | text | — | The Github Issue number |
| `title` | text | — | The title of the Issue |
| `description` | text4 | — | The issue description |
| `owner` | text | — | The Github Account |
| `repo` | text | — | The Github Repository |
| `token` | password | — | A personal access token, an OAuth token, an installation access token or a JSON Web Token for GitHub App authentication |

---

### `githubGetIssue`

Connect to Github and get details about an issue by passing an issue number.

**Plan hint:** Get GitHub issue

**NTL Syntax:**

```ntl
{{ githubGetIssue | issueNumber: "..."
                     | owner: "..."
                     | repo: "..."
                     | token: "..."
                     | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `issueNumber` | text | — | The Github Issue number |
| `owner` | text | — | The Github Account |
| `repo` | text | — | The Github Repository |
| `token` | password | — | A personal access token, an OAuth token, an installation access token or a JSON Web Token for GitHub App authentication |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

### `githubGetIssues`

Connect to Github and list all issues for a repository.

**Plan hint:** List GitHub issues

**NTL Syntax:**

```ntl
{{ githubGetIssues | owner: "..."
                      | repo: "..."
                      | token: "..."
                      | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `owner` | text | — | The Github Account |
| `repo` | text | — | The Github Repository |
| `token` | password | — | A personal access token, an OAuth token, an installation access token or a JSON Web Token for GitHub App authentication |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

### `githubSearch`

Connect to Github and run a search for Issues and Pull Requests based on the provided query, returning the data.

**Plan hint:** Search GitHub

**NTL Syntax:**

```ntl
{{ githubSearch | query: "..."
                   | owner: "..."
                   | repo: "..."
                   | token: "..."
                   | sentences: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text3 | — | The Github search. Qualifiers are supported |
| `owner` | text | — | The Github Account |
| `repo` | text | — | The Github Repository |
| `token` | password | — | A personal access token, an OAuth token, an installation access token or a JSON Web Token for GitHub App authentication |
| `sentences` | boolean | true | Return in sentences (true) or as JSON (false) |

---

## Trello

### `trelloCreateCard`

Connect to Trello and create a card

**Plan hint:** Create Trello card

**NTL Syntax:**

```ntl
{{ trelloCreateCard | name: "..."
                       | desc: "..."
                       | listId: "..."
                       | raw: "..."
                       | apikey: "..."
                       | apitoken: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text2 | — | The card name |
| `desc` | text3 | — | The card description |
| `listId` | text | — | The list id to place the card in |
| `raw` | text3 | — | Optional - pass a JSON Issue object to create the issue. This overrides summary and description. |
| `apikey` | text | — | The API key to use |
| `apitoken` | password | — | The API token to use |

---

### `trelloGetCard`

Connect to Trello and get a card

**Plan hint:** Get Trello card

**NTL Syntax:**

```ntl
{{ trelloGetCard | id: "..."
                    | apikey: "..."
                    | apitoken: "..."
                    | sentences: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | text | — | The card id |
| `apikey` | text | — | The API key to use |
| `apitoken` | password | — | The API token to use |
| `sentences` | boolean | — | Return in sentences (true) or as JSON (false) |

---

### `trelloGetList`

Connect to Trello and get a list

**Plan hint:** Get Trello list

**NTL Syntax:**

```ntl
{{ trelloGetList | id: "..."
                    | apikey: "..."
                    | apitoken: "..."
                    | sentences: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | text | — | The list id |
| `apikey` | text | — | The API key to use |
| `apitoken` | password | — | The API token to use |
| `sentences` | boolean | — | Return in sentences (true) or as JSON (false) |

---

### `trelloSearch`

Connect to Trello and run a search

**Plan hint:** Search Trello

**NTL Syntax:**

```ntl
{{ trelloSearch | query: "..."
                   | apikey: "..."
                   | apitoken: "..."
                   | sentences: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text5 | — | The search query |
| `apikey` | text | — | The API key to use |
| `apitoken` | password | — | The API token to use |
| `sentences` | boolean | — | Return in sentences (true) or as JSON (false) |

---

### `trelloUpdateCard`

Connect to Trello and create a card

**Plan hint:** Update Trello card

**NTL Syntax:**

```ntl
{{ trelloUpdateCard | name: "..."
                       | desc: "..."
                       | id: "..."
                       | raw: "..."
                       | apikey: "..."
                       | apitoken: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text2 | — | The card name |
| `desc` | text3 | — | The card description |
| `id` | text | — | The id of the card to update |
| `raw` | text3 | — | Optional - pass a JSON Issue object to create the issue. This overrides summary and description. |
| `apikey` | text | — | The API key to use |
| `apitoken` | password | — | The API token to use |

---

## SharePoint

### `sharepointDownload`

Connect to SharePoint and download files.

**Plan hint:** Download from SharePoint

**NTL Syntax:**

```ntl
{{ sharepointDownload | name: "..."
                         | url: "..."
                         | driveName: "..."
                         | tenantName: "..."
                         | tenantId: "..."
                         | siteName: "..."
                         | clientId: "..."
                         | clientSecret: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text | — | The file name |
| `url` | text | — | the file url |
| `driveName` | text | — | The sharepoint site or drive name |
| `tenantName` | text | — | Sharepoint tennant name (the subdomain of the url) |
| `tenantId` | text | — | Sharepoint tennant ID |
| `siteName` | text | — | Sharepoint site name |
| `clientId` | text | — | Sharepoint client ID |
| `clientSecret` | password | — | Sharepoint client secret |

---

### `sharepointListFiles`

Connect to SharePoint and list files.

**Plan hint:** List SharePoint files

**NTL Syntax:**

```ntl
{{ sharepointListFiles | driveName: "..."
                          | path: "/"
                          | tenantName: "..."
                          | tenantId: "..."
                          | siteName: "..."
                          | clientId: "..."
                          | clientSecret: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `driveName` | text | — | The sharepoint site or drive name |
| `path` | text | / | The sharepoint path to start from (optional) |
| `tenantName` | text | — | Sharepoint tennant name (the subdomain of the url) |
| `tenantId` | text | — | Sharepoint tennant ID |
| `siteName` | text | — | Sharepoint site name |
| `clientId` | text | — | Sharepoint client ID |
| `clientSecret` | password | — | Sharepoint client secret |

---

### `sharepointUpload`

Connect to SharePoint and upload files.

**Plan hint:** Upload to SharePoint

**NTL Syntax:**

```ntl
{{ sharepointUpload | name: "..."
                       | driveName: "..."
                       | path: "/"
                       | tenantName: "..."
                       | tenantId: "..."
                       | siteName: "..."
                       | clientId: "..."
                       | clientSecret: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | text | — | The file name |
| `driveName` | text | — | The sharepoint site or drive name |
| `path` | text | / | The sharepoint path to start from (optional) |
| `tenantName` | text | — | Sharepoint tennant name (the subdomain of the url) |
| `tenantId` | text | — | Sharepoint tennant ID |
| `siteName` | text | — | Sharepoint site name |
| `clientId` | text | — | Sharepoint client ID |
| `clientSecret` | password | — | Sharepoint client secret |

---

## Box

### `boxListFolder`

Connect to Box and list a folder, returning the data.

**Plan hint:** List Box folder

**NTL Syntax:**

```ntl
{{ boxListFolder | folder: "..." | token: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folder` | text | — | The folder to list |
| `token` | text6 | — | The JWT |

---

### `boxReadFile`

Connect to Box and read a file, saving it locally.

**Plan hint:** Read from Box

**NTL Syntax:**

```ntl
{{ boxReadFile | id: "..." | token: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | text | — | The id of the file to read |
| `token` | text6 | — | The JWT |

---

### `boxWriteFile`

Connect to Box and write a file.

**Plan hint:** Write to Box

**NTL Syntax:**

```ntl
{{ boxWriteFile | name: "..." | folder: "..." | token: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | document | — | The file to write |
| `folder` | text | — | The folder the file will be written to |
| `token` | text6 | — | The JWT |

---

## Media (Image, Audio, Video)

### `ffmpeg`

This node is used to transform multimedia with ffmpeg.

**Plan hint:** Transform media

**NTL Syntax:**

```ntl
{{ ffmpeg | video: "..."
             | inputOptions: "..."
             | outputOptions: "..."
             | outputFile: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `video` | document | — | Media file |
| `inputOptions` | text | — | An array of arrays of input options |
| `outputOptions` | text | — | An array of arrays of output options |
| `outputFile` | text | — | The output filename |

---

### `generateImage`

*(No description)*

**Plan hint:** Generate image

**NTL Syntax:**

```ntl
{{ generateImage | prompt: "..." | name: "..." | cache: "true" }}
```

**Chaining example:**

```ntl
{{ generateImage | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | text3 | — | A prompt to prepend to the LLM input |
| `name` | text | — | An optional image filename |
| `cache` | — | true | Cache and reuse LLM response for identical requests |

---

### `generateImageEdit`

*(No description)*

**Plan hint:** Edit image

**NTL Syntax:**

```ntl
{{ generateImageEdit | prompt: "..."
                        | name: "..."
                        | images: "..."
                        | cache: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | text3 | — | A prompt to prepend to the LLM input |
| `name` | text | — | An optional image filename |
| `images` | images | — | Base64 encoded image strings to use in the edit generation |
| `cache` | — | true | Cache and reuse LLM response for identical requests |

---

### `generateSpeech`

*(No description)*

**Plan hint:** Generate speech

**NTL Syntax:**

```ntl
{{ generateSpeech | prompt: "..."
                     | instructions: "..."
                     | voice: "..."
                     | format: "..."
                     | cache: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | text3 | — | A prompt to prepend to the LLM input |
| `instructions` | text3 | — | Additional instructions to the model |
| `voice` | llmAudioVoice | — | The voice to use |
| `format` | llmAudioFormat | — | The output format |
| `cache` | — | true | Cache and reuse LLM response for identical requests |

---

### `generateVideo`

*(No description)*

**Plan hint:** Generate video

**NTL Syntax:**

```ntl
{{ generateVideo | prompt: "..." | image: "..." | cache: "true" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | text3 | — | A prompt to prepend to the LLM input |
| `image` | document | — | An image to use in the generation |
| `cache` | — | true | Cache and reuse LLM response for identical requests |

---

### `joinMedia`

This node is used to join multimedia files.

**Plan hint:** Join media

**NTL Syntax:**

```ntl
{{ joinMedia | files: "..." | outputFile: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `files` | files | — | The files to join |
| `outputFile` | text | — | The output filename |

---

### `mergeAudioVideo`

This node is used to Merge Audio and Video.

**Plan hint:** Merge audio/video

**NTL Syntax:**

```ntl
{{ mergeAudioVideo | audio: "..." | video: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `audio` | document | — | The audio file (.mp3) |
| `video` | document | — | The video file (.mp4) |

---

### `ocr`

OCR an image.

**Plan hint:** OCR image

**NTL Syntax:**

```ntl
{{ ocr | name: "..." }}
```

**Chaining example:**

```ntl
{{ ocr | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | document | — | The image name |

---

### `speechToText`

*(No description)*

**Plan hint:** Transcribe audio

**NTL Syntax:**

```ntl
{{ speechToText | prompt: "..." | cache: "true" }}
```

**Chaining example:**

```ntl
{{ speechToText | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | text | — | A prompt to prepend to the LLM input |
| `cache` | — | true | Cache and reuse LLM response for identical requests |

---

### `videoFrame`

This node is used to extract a frame from a video.

**Plan hint:** Extract video frame

**NTL Syntax:**

```ntl
{{ videoFrame | video: "..." | frame: "last" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `video` | document | — | Video file |
| `frame` | — | last | Which frame to extract |

---

## Seek, Knowledge Base & Governance

### `PII`

Find and mask PII in the input text, based on the settings in yout Configuration tab

**Plan hint:** Remove PII

**NTL Syntax:**

```ntl
{{ PII | about: "Find and mask PII in the input text, based on the settings in yout Configuration tab" | plan: "Remove PII" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Find and mask PII in the input text, based on the settings in yout Configuration tab | Find and mask PII in the input text, based on the settings in yout Configuration tab | — |
| `plan` | Remove PII | Remove PII | — |

---

### `addContext`

Add context to text

**Plan hint:** Add context

**NTL Syntax:**

```ntl
{{ addContext | session_id: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `session_id` | text | — | A session ID for the context. Must use the same as was sent to Curate |

---

### `categories`

Return the categories in the active configuration

**Plan hint:** List categories

**NTL Syntax:**

```ntl
{{ categories | about: "Return the categories in the active configuration" | plan: "List categories" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Return the categories in the active configuration | Return the categories in the active configuration | Return the categories in the active configuration |
| `plan` | List categories | List categories | List categories |

---

### `categorize`

Categorize a question

**Plan hint:** Categorize question

**NTL Syntax:**

```ntl
{{ categorize | question: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `question` | text | — | The text to categorize |

---

### `configSaveAgentIn`

This node is used only for configuration save agents. This node must be the first step in a mAIstro configuration save agent.

**NTL Syntax:**

```ntl
{{ configSaveAgentIn | about: "This node is used only for configuration save agents. This node must be the first step in a mAIstro configuration save agent." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for configuration save agents. This node must be the first step in a mAIstro configuration save agent. | This node is used only for configuration save agents. This node must be the first step in a mAIstro configuration save agent. | This node is used only for configuration save agents. This node must be the first step in a mAIstro configuration save agent. |
| `plan` |  | — | — |

---

### `curate`

Use with a custom RAG flow to send answers to Curate and Analytics. You do not need to pass any options when using with the Seek node.

**NTL Syntax:**

```ntl
{{ curate | question: "..."
             | answer: "..."
             | category: "..."
             | intent: "..."
             | session_id: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `question` | text | — | The User question (optional only if using the Seek node) |
| `answer` | text | — | The provided answer (optional only if using the Seek node) |
| `category` | number | — | The category (numerical - optional) |
| `intent` | text | — | The intent (optional) |
| `session_id` | text | — | A session id (optional) |

---

### `customGovernanceIn`

This node is used only for passing variables from seek to mAIstro for use in custom governance. This node must be the first step in a mAIstro custom governance flow.

**NTL Syntax:**

```ntl
{{ customGovernanceIn | about: "This node is used only for passing variables from seek to mAIstro for use in custom governance. This node must be the first step in a mAIstro custom governance flow." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for passing variables from seek to mAIstro for use in custom governance. This node must be the first step in a mAIstro custom governance flow. | This node is used only for passing variables from seek to mAIstro for use in custom governance. This node must be the first step in a mAIstro custom governance flow. | This node is used only for passing variables from seek to mAIstro for use in custom governance. This node must be the first step in a mAIstro custom governance flow. |
| `plan` |  | — | — |

---

### `customGovernanceOut`

This node is used only for returning a custom governance. This node must be the last step in the mAIstro agent.

**NTL Syntax:**

```ntl
{{ customGovernanceOut | blockMessage: "..."
                          | answer: "..."
                          | passages: "..."
                          | stump: "..."
                          | url: "..."
                          | document: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `blockMessage` | text | — | The message to return if blocking |
| `answer` | text | — | The answer |
| `passages` | text4 | — | The trusted information you used as an array. |
| `stump` | text2 | — | The stump context |
| `url` | text | — | The primary source URL (optional) |
| `document` | text | — | The primary source document name (optional) |

---

### `dynamicPersonalizationIn`

This node is used only for creating a dynamic personalization for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:dynamicPersonalizationIn.user: The user IDdynamicPersonalizationIn.originalQuery: The original user querydynamicPersonalizationIn.sessionId: The session IDdynamicPersonalizationIn.options: The full options object from the API call

**NTL Syntax:**

```ntl
{{ dynamicPersonalizationIn | about: "This node is used only for creating a dynamic personalization for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:dynamicPersonalizationIn.user: The user IDdynamicPersonalizationIn.originalQuery: The original user querydynamicPersonalizationIn.sessionId: The session IDdynamicPersonalizationIn.options: The full options object from the API call" | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for creating a dynamic personalization for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:dynamicPersonalizationIn.user: The user IDdynamicPersonalizationIn.originalQuery: The original user querydynamicPersonalizationIn.sessionId: The session IDdynamicPersonalizationIn.options: The full options object from the API call | This node is used only for creating a dynamic personalization for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:dynamicPersonalizationIn.user: The user IDdynamicPersonalizationIn.originalQuery: The original user querydynamicPersonalizationIn.sessionId: The session IDdynamicPersonalizationIn.options: The full options object from the API call | This node is used only for creating a dynamic personalization for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:dynamicPersonalizationIn.user: The user IDdynamicPersonalizationIn.originalQuery: The original user querydynamicPersonalizationIn.sessionId: The session IDdynamicPersonalizationIn.options: The full options object from the API call |
| `plan` |  | — | — |

---

### `dynamicPersonalizationOut`

This node is used only for creating a dynamic personalization agent for use in Seek. This node must be the last step in a mAIstro agent.

**NTL Syntax:**

```ntl
{{ dynamicPersonalizationOut | preferredName: "..."
                                | additionalDetails: "..."
                                | filter: "..."
                                | noWelcome: "..."
                                | forceFirstPerson: "..."
                                | products: "..."
                                | personalize: "..."
                                | override: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `preferredName` | text | — | The preferred name of the user |
| `additionalDetails` | text2 | — | Additional text to pass to language generation about the user. |
| `filter` | text | — | The filter string used to filter document queries. |
| `noWelcome` | boolean | — | The user has already been welcomed, do not re-welcome. Defaults to 'false'. |
| `forceFirstPerson` | boolean | — | Use a first-person speaking style, even if no preferred name is set. Defaults to 'false'. |
| `products` | text2 | — | The products this customer currently consumes from your company (Separate multiple by commas) |
| `personalize` | text4 | — | The personalization JSON object (seek's options.personalize) to override personalization. |
| `override` | text4 | — | The override data for the payload. USE WITH CARE. This will allow complete payload override (for other things like prompt engineering or other parameter overrides). |

---

### `kb`

Run a query directly against the KnowledgeBase. The options snippet and scoreRange are optional overrides of your configuration and should not normally be set.

**Plan hint:** Search KB

**NTL Syntax:**

```ntl
{{ kb | query: "..." }}
```

**Chaining example:**

```ntl
{{ kb | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The KnowledgeBase search |

---

### `maxWordsMsg`

This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:maxWordsMsg.originalQuery: The original user InputmaxWordsMsg.context: The previous message's context if in a mutli-turn conversation.maxWordsMsg.language: The selected or determined languagemaxWordsMsg.langCode: The selected or determined language codemaxWordsMsg.intent: The selected or determined Intent maxWordsMsg.categoryName: The selected or determined category nameminConfMsg.maxWordsMsg: The static response set in config 

**NTL Syntax:**

```ntl
{{ maxWordsMsg | about: "This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:maxWordsMsg.originalQuery: The original user InputmaxWordsMsg.context: The previous message's context if in a mutli-turn conversation.maxWordsMsg.language: The selected or determined languagemaxWordsMsg.langCode: The selected or determined language codemaxWordsMsg.intent: The selected or determined Intent maxWordsMsg.categoryName: The selected or determined category nameminConfMsg.maxWordsMsg: The static response set in config " | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:maxWordsMsg.originalQuery: The original user InputmaxWordsMsg.context: The previous message's context if in a mutli-turn conversation.maxWordsMsg.language: The selected or determined languagemaxWordsMsg.langCode: The selected or determined language codemaxWordsMsg.intent: The selected or determined Intent maxWordsMsg.categoryName: The selected or determined category nameminConfMsg.maxWordsMsg: The static response set in config  | This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:maxWordsMsg.originalQuery: The original user InputmaxWordsMsg.context: The previous message's context if in a mutli-turn conversation.maxWordsMsg.language: The selected or determined languagemaxWordsMsg.langCode: The selected or determined language codemaxWordsMsg.intent: The selected or determined Intent maxWordsMsg.categoryName: The selected or determined category nameminConfMsg.maxWordsMsg: The static response set in config  | This node is used only for creating a custom maximum words message for use in Seek. This node provides the following Seek variables:maxWordsMsg.originalQuery: The original user InputmaxWordsMsg.context: The previous message's context if in a mutli-turn conversation.maxWordsMsg.language: The selected or determined languagemaxWordsMsg.langCode: The selected or determined language codemaxWordsMsg.intent: The selected or determined Intent maxWordsMsg.categoryName: The selected or determined category nameminConfMsg.maxWordsMsg: The static response set in config  |
| `plan` |  | — | — |

---

### `minConfMsg`

This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:minConfMsg.originalQuery: The original user InputminConfMsg.context: The previous message's context if in a mutli-turn conversation.minConfMsg.kbContext: The knowledgebase documentation.minConfMsg.language: The selected or determined languageminConfMsg.langCode: The selected or determined language codeminConfMsg.intent: The selected or determined Intent minConfMsg.categoryName: The selected or determined category nameminConfMsg.categoryURL: The selected or determined category url 

**NTL Syntax:**

```ntl
{{ minConfMsg | about: "This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:minConfMsg.originalQuery: The original user InputminConfMsg.context: The previous message's context if in a mutli-turn conversation.minConfMsg.kbContext: The knowledgebase documentation.minConfMsg.language: The selected or determined languageminConfMsg.langCode: The selected or determined language codeminConfMsg.intent: The selected or determined Intent minConfMsg.categoryName: The selected or determined category nameminConfMsg.categoryURL: The selected or determined category url " | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:minConfMsg.originalQuery: The original user InputminConfMsg.context: The previous message's context if in a mutli-turn conversation.minConfMsg.kbContext: The knowledgebase documentation.minConfMsg.language: The selected or determined languageminConfMsg.langCode: The selected or determined language codeminConfMsg.intent: The selected or determined Intent minConfMsg.categoryName: The selected or determined category nameminConfMsg.categoryURL: The selected or determined category url  | This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:minConfMsg.originalQuery: The original user InputminConfMsg.context: The previous message's context if in a mutli-turn conversation.minConfMsg.kbContext: The knowledgebase documentation.minConfMsg.language: The selected or determined languageminConfMsg.langCode: The selected or determined language codeminConfMsg.intent: The selected or determined Intent minConfMsg.categoryName: The selected or determined category nameminConfMsg.categoryURL: The selected or determined category url  | This node is used only for creating a custom minimum confidence message for use in Seek. This node provides the following Seek variables:minConfMsg.originalQuery: The original user InputminConfMsg.context: The previous message's context if in a mutli-turn conversation.minConfMsg.kbContext: The knowledgebase documentation.minConfMsg.language: The selected or determined languageminConfMsg.langCode: The selected or determined language codeminConfMsg.intent: The selected or determined Intent minConfMsg.categoryName: The selected or determined category nameminConfMsg.categoryURL: The selected or determined category url  |
| `plan` |  | — | — |

---

### `minWordsMsg`

This node is used only for creating a custom minimum text message or Welcome message for use in Seek. This node provides the following Seek variables:minWordsMsg.originalQuery: The original user InputminWordsMsg.context: The previous message's context if in a mutli-turn conversation.minWordsMsg.language: The selected or determined languageminWordsMsg.langCode: The selected or determined language codeminWordsMsg.intent: The selected or determined Intent minWordsMsg.categoryName: The selected or determined category nameminWordsMsg.categoryURL: The selected or determined category url 

**NTL Syntax:**

```ntl
{{ minWordsMsg | about: "This node is used only for creating a custom minimum text message or Welcome message for use in Seek. This node provides the following Seek variables:minWordsMsg.originalQuery: The original user InputminWordsMsg.context: The previous message's context if in a mutli-turn conversation.minWordsMsg.language: The selected or determined languageminWordsMsg.langCode: The selected or determined language codeminWordsMsg.intent: The selected or determined Intent minWordsMsg.categoryName: The selected or determined category nameminWordsMsg.categoryURL: The selected or determined category url " | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for creating a custom minimum text message or Welcome message for use in Seek. This node provides the following Seek variables:minWordsMsg.originalQuery: The original user InputminWordsMsg.context: The previous message's context if in a mutli-turn conversation.minWordsMsg.language: The selected or determined languageminWordsMsg.langCode: The selected or determined language codeminWordsMsg.intent: The selected or determined Intent minWordsMsg.categoryName: The selected or determined category nameminWordsMsg.categoryURL: The selected or determined category url  | This node is used only for creating a custom minimum text message or Welcome message for use in Seek. This node provides the following Seek variables:minWordsMsg.originalQuery: The original user InputminWordsMsg.context: The previous message's context if in a mutli-turn conversation.minWordsMsg.language: The selected or determined languageminWordsMsg.langCode: The selected or determined language codeminWordsMsg.intent: The selected or determined Intent minWordsMsg.categoryName: The selected or determined category nameminWordsMsg.categoryURL: The selected or determined category url  | This node is used only for creating a custom minimum text message or Welcome message for use in Seek. This node provides the following Seek variables:minWordsMsg.originalQuery: The original user InputminWordsMsg.context: The previous message's context if in a mutli-turn conversation.minWordsMsg.language: The selected or determined languageminWordsMsg.langCode: The selected or determined language codeminWordsMsg.intent: The selected or determined Intent minWordsMsg.categoryName: The selected or determined category nameminWordsMsg.categoryURL: The selected or determined category url  |
| `plan` |  | — | — |

---

### `postKBAgentIn`

This node is used only for modifying a KB return arry for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:postKBAgentIn.user: The user IDpostKBAgentIn.originalQuery: The original user querypostKBAgentIn.sessionId: The session IDpostKBAgentIn.context: The KB context arraypostKBAgentIn.options: The full options object from the API call

**NTL Syntax:**

```ntl
{{ postKBAgentIn | about: "This node is used only for modifying a KB return arry for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:postKBAgentIn.user: The user IDpostKBAgentIn.originalQuery: The original user querypostKBAgentIn.sessionId: The session IDpostKBAgentIn.context: The KB context arraypostKBAgentIn.options: The full options object from the API call" | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for modifying a KB return arry for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:postKBAgentIn.user: The user IDpostKBAgentIn.originalQuery: The original user querypostKBAgentIn.sessionId: The session IDpostKBAgentIn.context: The KB context arraypostKBAgentIn.options: The full options object from the API call | This node is used only for modifying a KB return arry for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:postKBAgentIn.user: The user IDpostKBAgentIn.originalQuery: The original user querypostKBAgentIn.sessionId: The session IDpostKBAgentIn.context: The KB context arraypostKBAgentIn.options: The full options object from the API call | This node is used only for modifying a KB return arry for use in Seek. This node must be the first step in a mAIstro agent.This node provides the following Seek variables:postKBAgentIn.user: The user IDpostKBAgentIn.originalQuery: The original user querypostKBAgentIn.sessionId: The session IDpostKBAgentIn.context: The KB context arraypostKBAgentIn.options: The full options object from the API call |
| `plan` |  | — | — |

---

### `postKBAgentOut`

This node is used only for modifying a KB context for use in Seek. This node must be the last step in a mAIstro agent.

**NTL Syntax:**

```ntl
{{ postKBAgentOut }}
```

---

### `preCustomGovernanceIn`

This node is used only for passing variables from seek to mAIstro for use in pre-llm custom governance. This node must be the first step in a mAIstro custom governance flow.

**NTL Syntax:**

```ntl
{{ preCustomGovernanceIn | about: "This node is used only for passing variables from seek to mAIstro for use in pre-llm custom governance. This node must be the first step in a mAIstro custom governance flow." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for passing variables from seek to mAIstro for use in pre-llm custom governance. This node must be the first step in a mAIstro custom governance flow. | This node is used only for passing variables from seek to mAIstro for use in pre-llm custom governance. This node must be the first step in a mAIstro custom governance flow. | This node is used only for passing variables from seek to mAIstro for use in pre-llm custom governance. This node must be the first step in a mAIstro custom governance flow. |
| `plan` |  | — | — |

---

### `preCustomGovernanceOut`

This node is used only for returning a custom pre-llm govenance. This node must be the last step in a mAIstro agent.

**NTL Syntax:**

```ntl
{{ preCustomGovernanceOut | blockMessage: "..."
                             | originalQuery: "..."
                             | contextQuery: "..."
                             | aiQuery: "..."
                             | lastTurn: "..."
                             | language: "..."
                             | langCode: "..."
                             | intent: "..."
                             | categoryName: "..."
                             | stump: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `blockMessage` | text | — | The message to return if blocking |
| `originalQuery` | text | — | The original query |
| `contextQuery` | text | — | The context enhanced query |
| `aiQuery` | — | — | — |
| `lastTurn` | text | — | The last turn array |
| `language` | text | — | The language |
| `langCode` | text | — | The language code |
| `intent` | text | — | The intent |
| `categoryName` | text | — | The category name |
| `stump` | text | — | The stump context |

---

### `protect`

Protect from prompt injection. Add custom blocked prompt words via Platform Preferences on the Configure tab.

**NTL Syntax:**

```ntl
{{ protect }}
```

---

### `queryCache`

Query stored answers from the curate tab

**NTL Syntax:**

```ntl
{{ queryCache | question: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `question` | text | — | The text to search |

---

### `regexPII`

Find PII via the built-in NeuralSeek and custom added REGEX patterns

**Plan hint:** Identify PII

**NTL Syntax:**

```ntl
{{ regexPII | about: "Find PII via the built-in NeuralSeek and custom added REGEX patterns" | plan: "Identify PII" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Find PII via the built-in NeuralSeek and custom added REGEX patterns | Find PII via the built-in NeuralSeek and custom added REGEX patterns | — |
| `plan` | Identify PII | Identify PII | — |

---

### `seek`

Run a Seek

**Plan hint:** Answer with Seek

**NTL Syntax:**

```ntl
{{ seek | query: "..."
           | stump: "..."
           | filter: "..."
           | language: "..."
           | seekLLM: "..." }}
```

**Chaining example:**

```ntl
{{ seek | ... }}=>{{ variable | name: "result" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | text | — | The Question to Seek |
| `stump` | text | — | Information to add as priority in the Context |
| `filter` | text | — | A filter to pass to the KB |
| `language` | language | — | The response language, if different than the default |
| `seekLLM` | llm | — | Set a specific model card to use for this seek |

---

### `seekIn`

This node is used only for creating a Seek input. This node must be the first step in a mAIstro virtual KB.This node provides the following Seek variables:seekIn.originalQuery: The original user InputseekIn.contextQuery: The query enhanced with NeuralSeek context keeping.seekIn.lastTurn: The chat history as an array of objects.seekIn.language: The selected or determined languageseekIn.langCode: The selected or determined language codeseekIn.intent: The selected or determined Intent seekIn.categoryName: The selected or determined category name 

**NTL Syntax:**

```ntl
{{ seekIn | about: "This node is used only for creating a Seek input. This node must be the first step in a mAIstro virtual KB.This node provides the following Seek variables:seekIn.originalQuery: The original user InputseekIn.contextQuery: The query enhanced with NeuralSeek context keeping.seekIn.lastTurn: The chat history as an array of objects.seekIn.language: The selected or determined languageseekIn.langCode: The selected or determined language codeseekIn.intent: The selected or determined Intent seekIn.categoryName: The selected or determined category name " | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for creating a Seek input. This node must be the first step in a mAIstro virtual KB.This node provides the following Seek variables:seekIn.originalQuery: The original user InputseekIn.contextQuery: The query enhanced with NeuralSeek context keeping.seekIn.lastTurn: The chat history as an array of objects.seekIn.language: The selected or determined languageseekIn.langCode: The selected or determined language codeseekIn.intent: The selected or determined Intent seekIn.categoryName: The selected or determined category name  | This node is used only for creating a Seek input. This node must be the first step in a mAIstro virtual KB.This node provides the following Seek variables:seekIn.originalQuery: The original user InputseekIn.contextQuery: The query enhanced with NeuralSeek context keeping.seekIn.lastTurn: The chat history as an array of objects.seekIn.language: The selected or determined languageseekIn.langCode: The selected or determined language codeseekIn.intent: The selected or determined Intent seekIn.categoryName: The selected or determined category name  | This node is used only for creating a Seek input. This node must be the first step in a mAIstro virtual KB.This node provides the following Seek variables:seekIn.originalQuery: The original user InputseekIn.contextQuery: The query enhanced with NeuralSeek context keeping.seekIn.lastTurn: The chat history as an array of objects.seekIn.language: The selected or determined languageseekIn.langCode: The selected or determined language codeseekIn.intent: The selected or determined Intent seekIn.categoryName: The selected or determined category name  |
| `plan` |  | — | — |

---

### `seekOut`

This node is used only for returning a custom Seek. This node must be the last step in a mAIstro seek.

**NTL Syntax:**

```ntl
{{ seekOut | answer: "..." | url: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `answer` | text | — | The answer |
| `url` | text | — | The primary source URL (optional) |

---

### `seekUsersData`

Get details about seek users in this instance

**Plan hint:** Get Seek users data

**NTL Syntax:**

```ntl
{{ seekUsersData | about: "Get details about seek users in this instance" | plan: "Get Seek users data" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Get details about seek users in this instance | Get details about seek users in this instance | Get details about seek users in this instance |
| `plan` | Get Seek users data | Get Seek users data | Get Seek users data |

---

### `sessionHistory`

Grab session history for a sessionId and number of previous turns of the conversation

**NTL Syntax:**

```ntl
{{ sessionHistory | sessionId: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sessionId` | text | — | The session ID |

---

### `usersData`

Get details about user logins in this instance

**Plan hint:** Get users data

**NTL Syntax:**

```ntl
{{ usersData | about: "Get details about user logins in this instance" | plan: "Get users data" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | Get details about user logins in this instance | Get details about user logins in this instance | Get details about user logins in this instance |
| `plan` | Get users data | Get users data | Get users data |

---

### `virtualKbIn`

This node is used only for creating a virtual KB for use in Seek. This node must be the first step in a mAIstro virtual KB.This node provides the following Seek variables:virtualKbIn.originalQuery: The original user InputvirtualKbIn.contextQuery: The query enhanced with NeuralSeek context keeping.virtualKbIn.language: The selected or determined languagevirtualKbIn.langCode: The selected or determined language codevirtualKbIn.intent: The selected or determined Intent virtualKbIn.categoryName: The selected or determined category name virtualKbIn.filter: The filter string used virtualKbIn.prefs: (opt-in) The instance preferences (secrets redacted)

**NTL Syntax:**

```ntl
{{ virtualKbIn | passPrefs: "false" }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `passPrefs` | boolean | false | Include the instance preferences as virtualKbIn.prefs |

---

### `virtualKbOut`

This node is used only for creating a virtual KB for use in Seek. This node must be the last step in a mAIstro virtual KB.

**NTL Syntax:**

```ntl
{{ virtualKbOut | url: "..." | document: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text | — | The primary source URL (optional) |
| `document` | text | — | The primary source document name (optional) |

---

## Corporate Logging

### `corpLogIn`

This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogIn.log: The Log JSONcorpLogIn.id: The id of the log.corpLogIn.function: The function that generated the log (e.g. seek, seekPrompt, maistro).

**NTL Syntax:**

```ntl
{{ corpLogIn | about: "This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogIn.log: The Log JSONcorpLogIn.id: The id of the log.corpLogIn.function: The function that generated the log (e.g. seek, seekPrompt, maistro)." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogIn.log: The Log JSONcorpLogIn.id: The id of the log.corpLogIn.function: The function that generated the log (e.g. seek, seekPrompt, maistro). | This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogIn.log: The Log JSONcorpLogIn.id: The id of the log.corpLogIn.function: The function that generated the log (e.g. seek, seekPrompt, maistro). | This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogIn.log: The Log JSONcorpLogIn.id: The id of the log.corpLogIn.function: The function that generated the log (e.g. seek, seekPrompt, maistro). |
| `plan` |  | — | — |

---

### `corpLogReplay`

This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogReplay.id: The id of the log.corpLogReplay.function: The function that generated the log (e.g. seek, seekPrompt, maistro).

**NTL Syntax:**

```ntl
{{ corpLogReplay | about: "This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogReplay.id: The id of the log.corpLogReplay.function: The function that generated the log (e.g. seek, seekPrompt, maistro)." | plan: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `about` | This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogReplay.id: The id of the log.corpLogReplay.function: The function that generated the log (e.g. seek, seekPrompt, maistro). | This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogReplay.id: The id of the log.corpLogReplay.function: The function that generated the log (e.g. seek, seekPrompt, maistro). | This node is used only for Corporate logging. This node must be the first step in a mAIstro corporate logger.This node provides the following variables:corpLogReplay.id: The id of the log.corpLogReplay.function: The function that generated the log (e.g. seek, seekPrompt, maistro). |
| `plan` |  | — | — |

---

## WatsonX Governance

### `watsonXGovRaw`

Connect to watsonx.governance / OpenScale and send a JSON object

**Plan hint:** Send governance record

**NTL Syntax:**

```ntl
{{ watsonXGovRaw | url: "https://aiopenscale.cloud.ibm.com/openscale//v2/data_sets//records" | raw: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | text2 | https://aiopenscale.cloud.ibm.com/openscale//v2/data_sets//records | The URL uncluding path of your watsonx.governance / Openscale scoring payload (https://cloud.ibm.com/apidocs/ai-openscale#records-add) |
| `raw` | text5 | — | THe JSON object to send |
| `key` | password | — | The IAM api key |

---

### `watsonXGovSeek`

Connect to watsonx.governance and log a Seek. This node is designed for use with the Seek node. For custom RAG, use the watsonXGovRaw node instead.

**Plan hint:** Log to watsonx.governance

**NTL Syntax:**

```ntl
{{ watsonXGovSeek | instanceId: "..." | payloadDatasetURL: "..." | key: "..." }}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `instanceId` | text | — | The watsonx Evaluation datamart ID / Openscale Instance ID |
| `payloadDatasetURL` | text | — | Enter either the watsonx Subscription Id (xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) or The Payload Dataset URL (/v2/data_sets/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx) |
| `key` | password | — | The IAM api key |

---

