---
type: source_intake_log
sub_agent: Navigator
role: source_registration_log
purpose: [track new Root Vault batches and retained external sources before mapping]
scope: [source intake only]
connects_to:
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/00_root_mirror/
  - 03_logs/external_queries.md
created: 2026-05-26
updated: 2026-05-27
---

# Source Intake Log

All new Root Vault batches and retained external sources are registered here before mapping.

| Date | Batch ID | Source type | Location | Origin | Intake status | Notes |
|---|---|---|---|---|---|---|

## Status Values
- `registered`
- `mapped`
- `metadata_complete`
- `fragments_extracted`
- `indexed`
- `needs_ocr`
- `needs_transcription`
- `blocked`
