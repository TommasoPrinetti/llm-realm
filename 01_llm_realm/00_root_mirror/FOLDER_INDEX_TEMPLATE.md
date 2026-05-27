---
type: folder_index_template
role: folder_index_template
purpose: [provide the canonical header and body structure for folder indexes]
scope: [all folder mirror index files]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/01_metadata/HEADER_TEMPLATE.md
  - 03_logs/source_intake_log.md
index_status: template
evidence_type: processed
evidence_level: L1
created: 2026-05-26
updated: 2026-05-27
---

# Folder Index Template

Use one `INDEX.md` per meaningful Root Vault folder.

```md
---
type: folder_index
role: realm_folder_map
purpose: [map one Root Vault folder to a fast retrieval surface]
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
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Folder Index: [root_rel_path]

## Folder Purpose
- [2 to 5 bullets explaining what this folder is for]

## What Is Here
| Child folder / source cluster | Type | Retrieval value | Checker target |
|---|---|---|---|
| `[name]` | [source_type] | [short reason to open it] | `[Root Vault path]` |

## Retrieval Notes
- Keywords and aliases:
- Likely concepts:
- Names / places / organizations:
- Date or phase notes:

## Checker Pointers
- Root folder: `[Root Vault path]`
- High-value files or subfolders:

## Gaps
- [OCR / transcription / missing dates / uncertain provenance / unmapped child]
```

## Rule
The YAML header is for fast grep. The body is for compact navigation. The Root Vault is where evidence is confirmed.
