# AGENTS.md — LLM Realm Operating Rules

## Purpose
LLM Realm is a research framework for LLM agents working with large, evolving source collections. The Root Vault is the protected source layer. The Realm is the writable map: source maps, metadata, evidence fragments, concept indexes, memos, logs, mailbox notes, and reports.

## Agent Tone
Be direct, operational, and to the point. Use practical judgment, avoid performative enthusiasm, and focus on the next useful action. When reasoning is needed, make it brief, concrete, and decision-oriented.

## First Read
1. `AGENTS.md`
2. `00_system/REALM_CONFIGURATION.md`
3. `00_system/PROCESS_ROUTER.md`
4. The relevant skill in `00_system/skills/`

If `preferred_llm_cli` is present in `00_system/REALM_CONFIGURATION.md`, adapt startup instructions to that CLI when useful. The framework behavior stays the same across CLIs.

## Startup Gate
Do not map, index, answer from sources, or ingest new material until `00_system/REALM_CONFIGURATION.md` and `02_user_realm/RESEARCH_BLUEPRINT.md` have been filled for the project.

`Read AGENTS.md and start the Realm` is an executable command, not a request for a plan. It authorizes the agent to complete startup and run the first mapping pass. Do not ask for a second confirmation before initial mapping.

If either file still contains required placeholders such as `[path]`, `[project name]`, or `[project description]`, or either file contains `setup_status: cli_started`, automatically start the Realm:
1. Read `00_system/ONBOARDING.md`.
2. Create and maintain a short startup todo list with the CLI's todo/task tool if available. This is mandatory when the tool exists, and it must happen before editing files or mapping sources.
3. Translate the existing setup draft into a usable research configuration before doing Cicero mapping. Do not skip this translation and do not merely read the draft.
4. Use the project description, artifact references, and Root Vault path to infer missing scope, source universe, vocabulary, methods, outputs, and initial mapping targets.
5. Use shell/file tools to verify local paths. Use web/MCP/browser tools for artifact URLs only when allowed by `external_sources_allowed`, and log external use when required.
6. Use the CLI's question/input tool only if a required field is absent, the Root Vault cannot be located, or a risky assumption would block immediate mapping.
7. Fill `02_user_realm/RESEARCH_BLUEPRINT.md` and `00_system/REALM_CONFIGURATION.md`; replace `setup_status: cli_started` with `setup_status: realm_started` when the setup draft has been translated.
8. Check that the draft has been fully translated: every useful project detail, artifact reference, path, policy, and inferred mapping target must either appear in the filled files or be explicitly marked as deferred with a reason.
9. Initialize `01_llm_realm/06_research_tendencies/RESEARCH_NEED_AGGREGATOR.md` from the template if missing.
10. Run the first mapping pass through `00_system/INITIAL_MAPPING_PROTOCOL.md`.
11. Update the startup todo list as each step completes. In the final response, report the completed checklist and a `Next Steps` section with 3 to 5 concrete actions the researcher can ask for next.

During startup, do not stop after a navigational source map unless the setup draft has already been translated, `setup_status` has been moved to `realm_started`, and the startup checklist is complete. Do not create a Markdown todo file unless the user asks for one.

Startup final responses must end with actionable next steps, such as extracting first evidence fragments, building the first concept index, asking a source-grounded research question, mapping a specific source batch more deeply, or running a Tacito contradiction/negative-case pass.

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
| `06_output_layer/` | Reserved output layer |

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
