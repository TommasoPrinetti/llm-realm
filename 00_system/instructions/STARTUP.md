---
type: startup_prompt
role: setup_protocol
purpose: [translate the protected Root Vault into a searchable, header-indexed source collection]
scope: [initial setup only]
connects_to:
  - 00_system/instructions/REALM_CONFIGURATION.md
  - 00_system/instructions/ONBOARDING.md
  - 01_llm_realm/00_realm_index.md
  - 01_llm_realm/00_dictionary.md
created: 2026-05-28
updated: 2026-05-28
---

# STARTUP.md — Root Vault To LLM Realm Conversion

This is the **protocol document** that defines what to do and how to do it. The **Startup sub-agent** reads this file and executes the steps.

Use this file when the user asks to **start the Realm** or when setup files still contain placeholders.

## Mission

Translate the protected Root Vault into the first usable **LLM Realm**: a searchable, header-indexed collection of source copies with a shared dictionary for consistent terminology.

The CLI onboarding script has already copied text-based files from the Root Vault into `01_llm_realm/sources/`. The agent's job is to:

1. **Build the master dictionary**
2. **Generate YAML headers** for every source copy
3. **Build concept indexes** from repeated themes
4. **Update the master index**
5. **Run the smoke test**

## Non-Negotiable

- **Never edit, rename, reorganize, or delete Root Vault files.**
- Do not copy binary files (PDFs, images, audio, video) into the Realm — note them in the realm index as **pointer-only**.
- Use the dictionary for consistent terminology across all headers.
- Put retrieval-critical terms in **YAML frontmatter** because fast grep starts there.
- Put interpretation and context in the body.

## Required Startup Inputs

Read:

1. `AGENTS.md`
2. `00_system/instructions/REALM_CONFIGURATION.md`
3. `00_system/instructions/SYSTEM_ARCHITECTURE_MAP.md`
4. `00_system/instructions/PROCESS_ROUTER.md`
5. `02_user_realm/RESEARCH_BLUEPRINT.md`
6. `01_llm_realm/01_metadata/HEADER_TEMPLATE.md`

## Step 1 — Verify Setup

Fill or verify:
- project title,
- project description,
- Root Vault path,
- external source policy,
- evidence standard,
- initial vocabulary,
- expected outputs.

If the Root Vault path is **missing or unreachable**, stop and ask for it.

## Step 2 — Survey Root Vault

List every directory in the Root Vault. For each directory:

1. List all files and subdirectories (skip `.DS_Store`, system files, empty dirs)
2. Note: file types present (`.pdf`, `.md`, `.docx`, `.mp4`, `.wav`, `.csv`, `.json`, etc.), count per type, approximate date range
3. Open and read enough files to characterize the folder's content accurately
4. Record: source types, modality, names, dates, topics, keywords, machine-readability, gaps

Separate text-based files (already copied to `sources/`) from binary files (still in Root Vault).

## Step 3 — Build Master Dictionary

Read every text-based source copy in `01_llm_realm/sources/`. Extract:

1. **Names** — people, roles, named entities. Merge variants into canonical forms (e.g., "Alice", "A. Tufano", "Alice Tufano" → canonical: "Alice Tufano"). Record the language of each term.
2. **Places** — geographic locations, sites, regions. Merge variants (e.g., "Pacific", "Pacific Islands", "Oceania" → canonical: "Pacific Islands"). Record the language.
3. **Organizations** — institutions, groups, agencies. Merge abbreviations (e.g., "WWF", "World Wildlife Fund" → canonical: "World Wildlife Fund"). Record the language.
4. **Concepts** — domain-specific ideas, theories, frameworks. Map to concept index entries. Record the language.
5. **Domain terms** — specialized vocabulary, acronyms, jargon. Define each. Record the language.

**Multilingual rule:** Keywords must appear in the language they were found in. If a source is in French, French keywords are recorded. If in English, English keywords. If a concept appears in multiple languages, list all language variants as aliases so grep finds any form.

Example:
```markdown
| Canonical form | Language | Aliases | Source files |
|---|---|---|---|
| adaptation | fr | adapção (pt), adaptation (en) | interview_01.md |
| coral reef | en | récif corallien (fr), recife de coral (pt) | fieldnote_03.md |
```

Write `01_llm_realm/00_dictionary.md` with canonical forms, languages, aliases, and source file references. Every term that appears in more than one source file **MUST** have an alias entry so grep finds any variant in any language.

## Step 4 — Generate Source Copy Headers

For every file in `01_llm_realm/sources/`, generate a YAML header using the dictionary. The header must contain:

```yaml
---
type: source_copy
source: "/absolute/path/to/root_vault/[relative-path]/[filename]"
source_type: interview | fieldnote | article | report | dataset | ...
text_type: md | txt | rtf | csv | json | ...
language: en | fr | pt | es | ...
date: "YYYY-MM-DD or YYYY-MM-DD"
people: ["canonical name from dictionary"]
places: ["canonical place from dictionary"]
organizations: ["canonical org from dictionary"]
topics: ["topic1", "topic2"]
keywords: ["keyword1", "keyword2", "keyword3"]
concepts: ["[[Concept Name]]"]
related_sources: ["other_file.md"]
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---
```

Rules:
- Use canonical forms from the dictionary — **never invent new variants**.
- `people`, `places`, `organizations` **MUST** use dictionary canonical names.
- `keywords` should include both canonical terms and common aliases (so grep finds any form).
- `concepts` link to concept index files in `03_concept_indexes/`.
- `related_sources` lists other source copies that share topics or concepts.
- Omit fields that have no value — do not write `people: []`.

Write the header at the top of each source copy file. The body (original content) stays **unchanged**.

## Step 4b — Embed Vault Structure in Navigator SOUL

After generating headers, capture the source tree structure and embed it into `00_system/sub_agents/navigator/SOUL.md` under the `## Vault Structure` heading.

Run:
```bash
find 01_llm_realm/sources/ -maxdepth 3 -type f | sort | sed 's|^|  |'
```

Replace the placeholder text in Navigator's SOUL.md with the actual output. This gives the Navigator immediate awareness of the source tree without grepping.

## Step 4c — Disambiguate With The User

This is the moment to **ask questions**. You have now read every source file and built the dictionary. You know what's ambiguous. Use the `question` tool to resolve ambiguities before finalizing headers and concept indexes.

Ask about:

1. **Name collisions** — If "Maria" appears in 3 sources, is it the same Maria? Ask the user to confirm which people are distinct and which are aliases.
2. **Place ambiguity** — If "the village" appears without a name, ask the user which village. If "the coast" could mean multiple locations, disambiguate.
3. **Unclear concepts** — If a domain term has no obvious definition in the sources, ask the user what it means.
4. **Missing metadata** — If a source has no date, no author, or unclear context, ask the user to fill the gap.
5. **Cross-language ambiguity** — If the same concept appears in multiple languages with slightly different meanings, ask which meaning is intended.
6. **Source relationships** — If two sources seem to contradict each other, ask the user whether this is a real disagreement or a misunderstanding.

**Do not guess. Do not assume.** The dictionary and headers are only as good as the disambiguation that feeds them. Ask concisely — group related questions together, keep each question short, and offer concrete options when possible.

If the user cannot answer (e.g., they don't know either), mark the term as `unresolved` in the dictionary and move on.

## Step 5 — Build Concept Indexes

Identify concepts that appear across multiple source copies. For each recurring concept:

1. Create a concept index in `01_llm_realm/03_concept_indexes/` using `CONCEPT_INDEX_TEMPLATE.md`
2. List all source copies that reference this concept
3. Note similar and contrasting concepts
4. Mark negative cases if present

Use `01_llm_realm/00_dictionary.md` to identify concepts that appear in **3+ source files**.

## Step 6 — Update Master Index

Update `01_llm_realm/00_realm_index.md` with:
- Root Vault path,
- Source copy coverage (how many files copied, by type),
- Dictionary status (canonical names, places, organizations, concepts),
- Concept indexes created,
- Non-text files noted as pointer-only,
- Known gaps.

## Step 7 — Smoke Test

Before reporting startup complete, run **one retrieval smoke test**:

1. Pick one keyword, concept, person, or place from the dictionary.
2. Grep `01_llm_realm/sources/` for it.
3. Confirm the result points to a source copy file.
4. Open that source copy and verify the YAML header is well-formed.
5. Verify the dictionary has a canonical entry for the matched term.

Startup is complete **only if** grep leads to a readable source copy with a valid header.

## Startup Output

Write one report in `05_agent_reports/` with:
- configuration status,
- Root Vault path verified,
- source copy coverage,
- dictionary size (names, places, organizations, concepts),
- files created,
- concept indexes created,
- smoke test result,
- remaining non-text files in Root Vault,
- recommended next actions.
