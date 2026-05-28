# LLM Realm

LLM Realm is a Markdown framework for turning a large source collection into a searchable, source-grounded research workspace for LLM agents.

It keeps original material in a protected **Root Vault** and builds a lightweight **LLM Realm** beside it: 1:1 source copies with YAML headers, a shared dictionary, concept indexes, logs, and reports that help agents find and verify material without losing the original sources.

## Requirements

| Tool | Version |
|---|---|
| bash | `>=3.2` (ships with macOS and most Linux distros) |
| LLM agent CLI | Optional, but recommended: Codex, Claude Code, OpenCode, Kilo, or equivalent |

## Quick Start

```bash
git clone https://github.com/<owner>/llm-realm.git
cd llm-realm
bash bin/onboard.sh
```

The onboarding command asks for the project name, Root Vault path, source policy, and preferred agent CLI. It writes the setup draft into:

| File | Purpose |
|---|---|
| [`02_user_realm/RESEARCH_BLUEPRINT.md`](./02_user_realm/RESEARCH_BLUEPRINT.md) | Project description and research direction |
| [`00_system/instructions/REALM_CONFIGURATION.md`](./00_system/instructions/REALM_CONFIGURATION.md) | Root Vault path, source policy, protected paths, and evidence rules |

After onboarding, start your agent in this repository and ask it to start the Realm. The agent will follow [`AGENTS.md`](./AGENTS.md), [`STARTUP.md`](./00_system/instructions/STARTUP.md), and [`ONBOARDING.md`](./00_system/instructions/ONBOARDING.md) to build the dictionary, generate source copy headers, and run a retrieval smoke test.

## Verify Setup

After the startup agent finishes, run:

```bash
bash bin/check-startup.sh
```

The check passes only when required placeholders are gone, `setup_status` is set to `realm_started`, the Root Vault path exists, and the startup aggregator has been created.

## Repository Layout

| Path | Role |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Main operating contract for autonomous agents |
| [`GLOSSARY.md`](./GLOSSARY.md) | Shared vocabulary for the framework |
| [`00_system/instructions/`](./00_system/instructions/) | Startup, routing, architecture, and configuration rules |
| [`00_system/sub_agents/`](./00_system/sub_agents/) | Sub-agent SOUL.md files for Conceptualizer, Navigator, Packer, and Checker |
| [`00_system/templates/`](./00_system/templates/) | Report templates used during startup and agent work |
| [`01_llm_realm/`](./01_llm_realm/) | Empty retrieval scaffold populated during startup |
| [`02_user_realm/`](./02_user_realm/) | Project blueprint and protected writing area |
| [`03_logs/`](./03_logs/) | Request, source intake, external query, and execution logs |
| [`05_agent_reports/`](./05_agent_reports/) | Generated reports, checkpoints, evidence packets, and verification notes |

## Core Workflow

```text
Root Vault
  read-only source corpus
        |
        v
Startup
  survey folders, create mirror indexes, run smoke test
        |
        v
LLM Realm
  searchable indexes, fragments, concepts, logs, reports
        |
        v
Agent work
  route request, retrieve evidence, synthesize, verify
```

Agents search `01_llm_realm/` first and open the Root Vault only when they need original context, unmapped material, or Checker verification.

## Agent Pipeline

| Stage | Agent | Responsibility |
|---|---|---|
| 1 | Conceptualizer | Turns a request into search concepts and a route |
| 2 | Navigator | Finds material in the Realm and Root Vault |
| 3 | Packer | Turns retrieved material into a report or structured answer |
| 4 | Checker | Verifies quotes, claims, paths, and index integrity |

The home session orchestrates the sequence through [`PROCESS_ROUTER.md`](./00_system/instructions/PROCESS_ROUTER.md).

## Rules To Preserve

- Keep the Root Vault read-only.
- Do not copy the source corpus into `01_llm_realm/`.
- Keep `02_user_realm/writing/` protected from agent edits.
- Require source paths for factual claims.
- Run Checker before presenting source-grounded claims as established.
- Keep a fresh clone bare: no project-specific logs, reports, or mirror indexes should ship in the repository.

## Useful Commands

| Command | Purpose |
|---|---|
| `bash bin/onboard.sh` | Collect setup answers and write the startup draft |
| `bash bin/check-startup.sh` | Validate that startup completed cleanly |

## Fresh Clone State

A fresh clone is intentionally sparse:

- `01_llm_realm/sources/` has no project-specific source copies yet.
- `05_agent_reports/` is empty.
- `03_logs/` contains empty log scaffolds.
- `03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR.md` is generated during onboarding from its template.
- `REALM_CONFIGURATION.md` and `RESEARCH_BLUEPRINT.md` start with setup placeholders.
- `.trash/` is empty (retired files are archived here instead of deleted).

That is expected. The first real content appears only after onboarding and startup run against a real Root Vault.
