---
type: root_mirror_readme
role: root_mirror_directory_map
purpose: [explain how the Root Vault is mirrored into Realm indexes]
scope: [01_llm_realm/00_root_mirror]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/01_metadata/HEADER_TEMPLATE.md
  - 03_logs/source_intake_log.md
index_status: active
evidence_type: processed
evidence_level: L1
created: 2026-05-26
updated: 2026-05-27
---

# Root Mirror Index

This folder mirrors the Root Vault at folder level, not file level.

At clone start, this folder should be empty of project-specific mirrors. When a project adds sources, each meaningful Root Vault folder gets a matching Realm folder containing:

```txt
INDEX.md
```

The `INDEX.md` file is a compact retrieval surface. Its YAML frontmatter is optimized for fast grep. Its body explains what the folder contains and which Root Vault paths Checker can open for verification.

Do not copy Root Vault files here.
