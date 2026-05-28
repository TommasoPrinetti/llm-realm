---
type: metadata_header_template
role: header_schema_guide
purpose: [define the canonical YAML header fields used across the framework]
scope: [all framework markdown files]
connects_to:
  - AGENTS.md
  - 00_system/instructions/PROCESS_ROUTER.md
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/00_dictionary.md
status: active
created: 2026-05-26
updated: 2026-05-28
---

# Header Template

Use a small, stable header on every framework file. The goal is to let an agent identify the file, understand its role, and know which files it connects to without reading the body first.

## Base Header

```yaml
---
type: [file_type]
role: [what this file does in the framework]
purpose: [one-line function of the file]
scope: [where this file applies]
connects_to:
  - [path]
  - [path]
status: active | draft | template | archived
evidence_type: primary | processed | interpretive | external
evidence_level: L1 | L2
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Use the fields needed for the file. Do not add empty analytic fields.

## Source Copy Header

Required for every file in `01_llm_realm/sources/`. The dictionary is the source of truth for canonical terms.

```yaml
---
type: source_copy
source: "/absolute/path/to/root_vault/[relative-path]/[filename]"
source_type: interview | fieldnote | article | report | dataset | correspondence | researcher_note
text_type: md | txt | rtf | csv | json | yaml | ...
language: en | fr | pt | es | ...
date: "YYYY-MM-DD or YYYY-MM-DD"
people: ["canonical name from dictionary"]
places: ["canonical place from dictionary"]
organizations: ["canonical org from dictionary"]
topics: ["topic1", "topic2"]
keywords: ["keyword1", "keyword2", "keyword3"]
concepts: ["[[Concept Name]]"]
related_sources: ["other_file.md"]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Rules:
- `language` is the ISO 639-1 code of the source file's primary language (en, fr, pt, es, etc.).
- `people`, `places`, `organizations` MUST use canonical forms from `01_llm_realm/00_dictionary.md`.
- `keywords` include both canonical terms and aliases in the source's language (so grep finds any variant).
- `concepts` link to concept index files in `03_concept_indexes/`.
- `related_sources` lists other source copies with shared topics or concepts.
- Omit fields that have no value — do not write `people: []`.

## Header For Concept Indexes

```yaml
---
type: concept_index
role: concept_retrieval_layer
purpose: [group fragments that share one recurring idea]
scope: [one concept family]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/sources/
  - 05_agent_reports/
sub_agent: Navigator
created: YYYY-MM-DD
updated: YYYY-MM-DD
evidence_type: processed
evidence_level: L1
tags: [tag1, tag2]
negative_case_status: none_found | partial | present | needs_search
---
```

## Header For Evidence-Bearing Files

```yaml
source: /root_vault/source_batch_NNN/[subfolder]/[file]
role: evidence_surface
purpose: [point to the source material this file summarizes]
scope: [single file or small source cluster]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 03_logs/source_intake_log.md
  - 05_agent_reports/
source_types: [interview, fieldnote, dataset]
evidence_type: [primary | processed | interpretive | external]
evidence_level: [L1 | L2]
confidence: [high | medium | low]
tags: [tag1, tag2]
```

## Header For Coded Fragments Or Indexes

```yaml
codes:
  - [descriptive code]
concepts:
  - "[[Concept Name]]"
role: coded_retrieval_surface
purpose: [cluster recurring ideas for fast retrieval]
scope: [one concept family]
category: "[[Category Name]]"
coding_status: uncoded | open_coded | focused_coded | categorized
```

## Add Only When Relevant

```yaml
negative_case_status: none_found | partial | present | needs_search
constant_comparison:
  similar_fragments:
    - "[[Fragment]]"
  contrasting_fragments:
    - "[[Fragment]]"
  comparison_status: not_compared | partial | compared
sensitizing_concepts:
  - [attention guide, not evidence]
theoretical_frames:
  - [frame to consider later]
relation_to_query: direct | adjacent | oppositional | speculative
checker_required: true | false
```

## Rule
Frontmatter is for routing and retrieval. The body is for interpretation, comparison, and context.

For fast grep:
- use lowercase snake_case field names,
- keep retrieval arrays short,
- prefer stable nouns over prose,
- include `source` and `root_rel_path` when the file points back to Root Vault structure,
- omit fields that do not help retrieval.

## Common Source Types
Use short lowercase values in `source_type`.

```yaml
source_types: [interview, fieldnote, article, policy, report, news, web_capture, legal, dataset, image, scan, audio, video, correspondence, researcher_note, external]
```
