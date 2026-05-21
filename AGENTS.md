# AGENTS.md — LLM Realm Operating Rules

## Purpose
LLM Realm is a research framework for LLM agents working with large, evolving source collections. The Root Vault is the protected source layer. The Realm is the writable map: source maps, metadata, evidence fragments, concept indexes, memos, logs, mailbox notes, and reports.

## First Read
1. `AGENTS.md`
2. `00_system/REALM_CONFIGURATION.md`
3. `00_system/PROCESS.md`
4. The relevant skill in `00_system/skills/`

If `preferred_llm_cli` is present in `00_system/REALM_CONFIGURATION.md`, adapt onboarding instructions to that CLI when useful. The framework behavior stays the same across CLIs.

## Onboarding Gate
Do not map, index, answer from sources, or ingest new material until `00_system/REALM_CONFIGURATION.md` and `02_user_realm/RESEARCH_BLUEPRINT.md` have been filled for the project.

If either file still contains placeholders such as `[path]`, `[project name]`, `[question 1]`, or `to refine during LLM onboarding`, automatically enter onboarding mode:
1. Read `00_system/ONBOARDING.md`.
2. Use the CLI's question/input tool if available to ask the researcher only for missing or underspecified onboarding information.
3. Fill `02_user_realm/RESEARCH_BLUEPRINT.md` and `00_system/REALM_CONFIGURATION.md`.
4. Initialize `01_llm_realm/06_research_tendencies/MASTER_OMEN.md` from the template if missing.
5. Ask the researcher whether to start the initial translation.
6. If yes, run the first mapping pass through `00_system/INITIAL_TRANSLATION_PROTOCOL.md`.

During onboarding, use the CLI's todo/task tool if available to track progress. Do not create a Markdown todo file unless the user asks for one.

## Smallest Valid Action
Do the smallest Realm action that satisfies the task. Do not create a fragment, memo, mailbox note, concept index, report, or archive entry unless it has a distinct purpose.

## Active Paths
| Path | Job |
|---|---|
| `00_system/` | Configuration, router, protocols, skills |
| `01_llm_realm/` | Source maps, metadata, fragments, indexes, back-search protocols, archive |
| `02_user_realm/` | Research Blueprint, tendencies, protected writing space |
| `03_logs/` | Questions, structured research needs, source intake, external queries |
| `04_mailbox/` | Outward-facing notes to the researcher |
| `05_agent_reports/` | Reports and internal analytic memos |
| `06_mirror/` | Reserved output layer |

Files in `01_llm_realm/archive/` are historical. Do not use archived files as active instructions.

## Write Permissions
| Agent | Writes |
|---|---|
| Cicero | `01_llm_realm/`, `05_agent_reports/`, `03_logs/source_intake_log.md`, `03_logs/external_queries.md` |
| Lucrezio | `03_logs/`, `02_user_realm/RESEARCH_TENDENCIES.md`, `01_llm_realm/06_research_tendencies/`, `05_agent_reports/` |
| Tacito | `04_mailbox/`, `05_agent_reports/` |
| Varro | `00_system/`, `01_llm_realm/`, `05_agent_reports/` |

All agents may read the Realm and Root Vault. No agent may edit the Root Vault or `02_user_realm/writing/`.

## Non-Negotiable Rules
- Protect the Root Vault: never modify, reorganize, or delete source files.
- Protect writing: never edit `02_user_realm/writing/`.
- Keep research material Markdown-first. Framework tooling may live in `bin/` and package metadata, but agents must not leave temporary code artifacts in the Realm.
- Label factual/evidentiary outputs with `evidence_type` and `evidence_level`.
- Back-search factual claims to a Root Vault or registered source path before finalizing.
- L2/serendipitous material requires back-search before reporting.
- External sources are internal-first: use only if explicitly requested or allowed by `REALM_CONFIGURATION.md`; log them in `03_logs/external_queries.md` and, if retained, `03_logs/source_intake_log.md`.
- Archive instead of deleting: outdated Realm material goes to `01_llm_realm/archive/` with a dated path.
- Agents suggest and structure; the researcher interprets.

## Evidence Labels
| Field | Values |
|---|---|
| `evidence_type` | `primary`, `processed`, `interpretive`, `external` |
| `evidence_level` | `L1` direct, `L2` adjacent/serendipitous |

## Analytic Boundaries
- `tags`: loose retrieval keywords.
- `codes`: descriptive labels grounded in fragments.
- `concepts`: repeated patterns, linked with Obsidian links.
- `category`: higher-level grouping.
- `sensitizing_concepts` and `theoretical_frames`: attention guides only, not evidence.
- `04_mailbox/`: outward-facing notes.
- `05_agent_reports/memos/`: internal analytic memory.
