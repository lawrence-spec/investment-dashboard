# NeuralSeek NTL Reference

## Syntax basics

### Variables

```ntl
<< name: myVar, prompt: true, desc: "Description of the input" >>
{{ LLM | prompt: "..." }}=>{{ variable | name: "result" }}
<< name: result >>
{{ variable | name: "myVar" | value: "some value" }}
```

### Function call shape

```ntl
{{ functionName | param1: "value1" | param2: "value2" }}
```

### Chaining

```ntl
{{ websiteData | url: "https://example.com" }}=>{{ summarize | length: 500 }}=>{{ variable | name: "summary" }}
```

### Annotation

`nsdescription` can be added to nodes for UI labeling.

```ntl
{{ LLM | prompt: "Summarize the data" | nsdescription: "Step 1 summarize raw input" }}
```

## Core syntax quick reference

| Concept | Syntax | Notes |
| --- | --- | --- |
| Input param | `<< name: varName, prompt: true, desc: "description" >>` | Declare at top |
| Set variable | `{{ variable \| name: "x" \| value: "y" }}` | Create or overwrite |
| Use variable | `<< name: x >>` | Use `prompt: false` for internal refs |
| Chain output | `{{ function }}=>{{ variable \| name: "result" }}` | Capture output |
| Append mode | `{{ variable \| name: "x" \| mode: "append" }}` | Append instead of overwrite |
| Annotation | `nsdescription: "tooltip text"` | Add to any node |

## LLM full parameters

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

Recommended patterns:

- use `stream: "disable_streaming"` for non streaming intermediate steps
- use `temperatureMod: "-0.5"` for deterministic structured output
- use `maxTokens: "150"` when you want concise structured output

## POST full parameters

```ntl
{{ post | url: "https://api.example.com/endpoint"
       | headers: "{"Authorization":"Bearer TOKEN","Content-Type":"application/json"}"
       | body: "{"key":"value"}"
       | operation: "POST"
       | username: ""
       | password: ""
       | apikey: ""
       | jsonToVars: "true" }}
```

## See also

For the complete list of all 234 nodes with parameters, types, and descriptions, see `docs/ntl-dictionary.md`.
