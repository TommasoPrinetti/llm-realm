# Concept Index Template

Use when several source copies share a concept.

```md
---
type: concept_index
role: concept_retrieval_layer
purpose: [group source copies that share one recurring idea]
scope: [one concept family]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/sources/
  - 05_agent_reports/
sub_agent: Navigator
created: [date]
updated: [date]
evidence_type: processed
evidence_level: L1
tags: [tag1, tag2]
negative_case_status: none_found | partial | present | needs_search
---

# [[Concept Name]]

## Definition
[short working definition]

## Codes
- [code]

## Category
[[Category]]

## Evidence
| Source copy | Why it matters | Confidence |
|---|---|---|
| `/sources/[path]/[file]` | [short note] | high / medium / low |

## Negative Cases
| Source copy | Counter-pattern | Checker status |
|---|---|---|
| `/sources/[path]/[file]` | [what it weakens] | pending / partial / verified |

## Comparison
- Similar: [[concept]]
- Contrasting: [[concept]]
- Code changes: [reinforced / weakened / renamed / split / merged]

## Checker Verification
[what to verify before using this concept in an answer or draft]
```

Omit empty sections only when they do not apply. Do not leave `Negative Cases` blank; use `negative_case_status`.
