# Evidence Fragment Template

Use for reusable evidence only.

```md
---
type: evidence_fragment
role: reusable_evidence_excerpt
purpose: [store one verified quote or precise observation for retrieval]
scope: [single source file or small source cluster]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 03_logs/source_intake_log.md
  - 05_agent_reports/
sub_agent: Navigator
created: [date]
updated: [date]
source: /root_vault/source_batch_NNN/[file]
root_path: /root_vault/source_batch_NNN/[file]
root_rel_path: source_batch_NNN/[file]
realm_mirror_path: 01_llm_realm/00_root_mirror/source_batch_NNN/INDEX.md
source_type: [source type]
evidence_type: primary | processed | interpretive | external
evidence_level: L1 | L2
confidence: high | medium | low
tags: [tag1, tag2]
keywords: [grep, friendly, terms]
codes:
  - [optional descriptive code]
concepts:
  - "[[Optional Concept]]"
category: "[[Optional Category]]"
---

## Fragment
[quote, claim, observation, data point, or precise paraphrase]

## Context
[minimal context needed to interpret the fragment]

## Coding
- Codes: [optional]
- Concept: [[optional]]
- Category: [[optional]]

## Comparison
- Similar: [[optional]]
- Contrasting: [[optional]]
- Note: [what this reinforces, weakens, or complicates]

## Checker Verification
[pending / partial / verified]
```

Omit optional fields when they do not help retrieval or analysis.
