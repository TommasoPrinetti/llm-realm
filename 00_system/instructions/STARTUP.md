---
type: startup_prompt
role: setup_protocol
purpose: [translate the startup draft into an initial Realm configuration and index]
scope: [initial setup only]
connects_to:
  - 00_system/instructions/REALM_CONFIGURATION.md
  - 00_system/instructions/ONBOARDING.md
  - 01_llm_realm/00_realm_index.md
created: 2026-05-26
updated: 2026-05-27
---

# STARTUP.md - Root Vault To LLM Realm Conversion Prompt

Use this file when the user asks to start the Realm or when setup files still contain placeholders.

## Mission
Translate the protected Root Vault into the first usable LLM Realm index.

The goal is not file-to-file equality. The goal is folder-to-folder navigability:

```txt
Root Vault folder        -> LLM Realm folder index
Root Vault subfolder     -> LLM Realm subfolder index
Important source cluster -> deeper folder index, metadata, fragments, concept indexes when useful
```

The LLM Realm must let an agent find a promising topic quickly, then go back to the Root Vault path for fuller evidence.

This file subsumes the old initial-indexing protocol. Use it for startup, first mirror creation, and the first index pass.

## Non-Negotiable
- Never edit, rename, reorganize, or delete Root Vault files.
- Do not copy the Root Vault into the Realm.
- Do not create one Realm file per Root Vault file unless the file is analytically important.
- Prefer compact folder indexes over exhaustive summaries.
- Put retrieval-critical terms in YAML frontmatter because fast grep starts there.
- Put interpretation and context in the body.

## Required Startup Inputs
Read:

1. `AGENTS.md`
2. `00_system/instructions/REALM_CONFIGURATION.md`
3. `00_system/instructions/SYSTEM_ARCHITECTURE_MAP.md`
4. `00_system/instructions/PROCESS_ROUTER.md`
5. `02_user_realm/RESEARCH_BLUEPRINT.md`
6. `01_llm_realm/01_metadata/HEADER_TEMPLATE.md`
7. `01_llm_realm/00_root_mirror/FOLDER_INDEX_TEMPLATE.md`

## Step 1 - Verify Setup
Fill or verify:
- project title,
- project description,
- Root Vault path,
- external source policy,
- evidence standard,
- initial vocabulary,
- expected outputs.

If the Root Vault path is missing or unreachable, stop and ask for it.

## Step 2 - Survey Root Vault Folders
List every directory in the Root Vault, full tree. For each directory:

1. List all files and subdirectories (skip .DS_Store, system files, empty dirs)
2. Note: file types present (.pdf, .md, .docx, .mp4, .wav, .csv, .json, etc.), count per type, approximate date range from filenames or file metadata
3. Open and read enough files to characterize the folder's content accurately — examine different file types and topics within the folder rather than reading every file cover to cover
4. Record: source types, modality, names, dates, topics, keywords, machine-readability, gaps (OCR needed, untranscribed audio, etc.)

Every Root Vault folder must be surveyed. Skip only temp, system, cache, or truly empty directories.

## Step 3 - Create Folder-Mirrored Realm Indexes
For every Root Vault folder that contains retrievable material, create a matching INDEX.md:

```txt
01_llm_realm/00_root_mirror/[root-relative-folder]/INDEX.md
```

Procedure per folder:
1. Create the directory under `01_llm_realm/00_root_mirror/` if it does not already exist
2. Write `INDEX.md` using `01_llm_realm/00_root_mirror/FOLDER_INDEX_TEMPLATE.md`
3. Fill YAML frontmatter with the grep terms you collected during the survey (source_types, modalities, topics, keywords, people, places, date_range)
4. Write the body — exactly the 5 sections from Step 5
5. Set `index_status: draft` initially

Example mapping:

```txt
Root Vault path:          /RootVault/interviews/phase_1/
Realm mirror INDEX.md:    01_llm_realm/00_root_mirror/interviews/phase_1/INDEX.md
```

Rules:
- Index the whole Root Vault, not a subset. Every folder with retrievable material gets an INDEX.md.
- One INDEX.md per folder. Do not create one per file.
- Use the template exactly. Do not skip YAML fields that have values.
- Omit YAML fields that have no value — do not write `people: unknown`.

## Step 4 - Write Grep-Friendly YAML
The YAML header is the fast retrieval layer. Keep it compact, normalized, and grep-friendly.

Required folder-index fields:

```yaml
---
type: folder_index
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
```

Rules:
- Use lowercase snake_case for field names.
- Use short arrays for grep terms.
- Prefer stable nouns over prose in YAML.
- Do not put long summaries in YAML.
- Leave unknown fields as `unknown` only when the field is useful for retrieval.
- Omit fields that do not help retrieval.

## Step 5 - Write Token-Efficient Bodies
The body of each folder index should be short:

1. `Folder Purpose` - 2 to 5 bullets.
2. `What Is Here` - compact table of subfolders or source clusters.
3. `Retrieval Notes` - terms, aliases, language variants, likely concepts.
4. `Checker Pointers` - exact Root Vault folders or files to open for verification.
5. `Gaps` - OCR, transcription, missing dates, uncertain provenance.

Do not summarize every file. Summarize the folder as a search surface.

## Step 6 - Add Deeper Indexes Only When Useful
Create deeper folder indexes, metadata, evidence fragments, and concept indexes only when they improve retrieval or reuse.

Use:
- `01_llm_realm/00_root_mirror/` nested `INDEX.md` files for source batches needing deeper navigation.
- `01_llm_realm/04_evidence_fragments/` for reusable quotes or precise observations.
- `01_llm_realm/03_concept_indexes/` when several fragments share a concept.

## Step 7 - Update Master Index
Update `01_llm_realm/00_realm_index.md` with:
- Root Vault path,
- mirror index coverage,
- mapped top-level folders,
- folders not yet indexed,
- concept indexes created,
- known gaps.

## Step 8 - Smoke Test
Before reporting startup complete, run one retrieval smoke test:

1. Pick one concept, topic, person, place, or keyword from YAML.
2. Grep the LLM Realm for it.
3. Confirm the result points to a folder index.
4. Open the Root Vault path listed in that folder index.
5. Record whether Checker can verify the source path.

Startup is complete only if the LLM Realm can lead back to the Root Vault.

## Startup Output
Write one report in `05_agent_reports/` with:
- configuration status,
- Root Vault path verified,
- folder mirror coverage,
- files created,
- smoke test result,
- remaining unmapped folders,
- recommended next indexing actions.
