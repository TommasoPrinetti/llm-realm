---
type: metadata_header_template
role: header_schema_guide
purpose: [define the canonical YAML header fields used across the framework]
scope: [all framework markdown files]
connects_to:
  - AGENTS.md
  - 00_system/instructions/README.md
  - 01_llm_realm/00_realm_index.md
status: active
created: 2026-05-26
updated: 2026-05-27
---

# Header Template

Use a small, stable header on every framework file. The goal is to let an agent identify the file, understand its role, and know which files it connects to without reading the whole body first.

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

## Required For Folder Index Files

Folder indexes are the core fast-grep layer. Use one `INDEX.md` per meaningful Root Vault folder under `01_llm_realm/00_root_mirror/`.

```yaml
---
type: folder_index
role: realm_folder_map
purpose: [map one Root Vault folder to a retrieval surface]
scope: [one Root Vault folder and its mirror]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 03_logs/source_intake_log.md
  - 05_agent_reports/README.md
index_status: draft | partial | mapped | verified
root_path: "[absolute or configured Root Vault path]"
root_rel_path: "[folder path relative to Root Vault]"
realm_mirror_path: "01_llm_realm/00_root_mirror/[root_rel_path]/INDEX.md"
mirror_level: root | top_level | subfolder | source_cluster
source_types: [interview, fieldnote, dataset]
modalities: [text, pdf, image, audio, video, dataset]
machine_readable: yes | no | partial
date_range: "[YYYY-YYYY or unknown]"
people: [name_or_role]
places: [place]
organizations: [organization]
topics: [topic]
keywords: [grep, friendly, terms]
concepts: ["[[Concept Name]]"]
codes: [descriptive_code]
evidence_type: processed
evidence_level: L1
checker_required: true
created: [date]
updated: [date]
---
```

## Add For Evidence-Bearing Files

```yaml
source: /root_vault/source_batch_NNN/[subfolder]/[file]
role: evidence_surface
purpose: [point to the source material this file summarizes]
scope: [single file or small batch]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 03_logs/source_intake_log.md
  - 05_agent_reports/README.md
source_types: [interview, fieldnote, dataset]
evidence_type: [primary | processed | interpretive | external]
evidence_level: [L1 | L2]
confidence: [high | medium | low]
tags: [tag1, tag2]
```

## Add For Coded Fragments Or Indexes

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
- include `root_rel_path` and `realm_mirror_path` when the file points back to Root Vault structure,
- omit fields that do not help retrieval.

## Common Source Types
Use short lowercase values in `source_types`.

```yaml
source_types: [interview, fieldnote, article, policy, report, news, web_capture, legal, dataset, image, scan, audio, video, correspondence, researcher_note, external]
```
