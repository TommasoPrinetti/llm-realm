---
type: system_architecture_map
role: framework_map
purpose: [show how the home session, logs, sub-agents, and evidence layers connect]
scope: [repo-wide architecture]
connects_to:
  - AGENTS.md
  - 00_system/instructions/PROCESS_ROUTER.md
  - 00_system/sub_agents/conceptualizer/SOUL.md
  - 00_system/sub_agents/navigator/SOUL.md
  - 00_system/sub_agents/packer/SOUL.md
  - 00_system/sub_agents/checker/SOUL.md
  - 01_llm_realm/00_realm_index.md
  - 03_logs/user_requests.md
created: 2026-05-26
updated: 2026-05-27
---

# LLM Realm System Architecture Map

## Core Architecture
LLM Realm is a two-layer research system.

```txt
Root Vault
  read-only original sources
  canonical evidence layer
        |
        | initial setup translates, indexes, and compresses navigation
        v
LLM Realm
  writable organic index
  folder indexes, fragments, concept indexes, logs, reports
        |
        | prompt pipeline searches here first for token economy
        v
User-facing answers
  checked against Root Vault before factual claims are finalized
```

## Prompt Lifecycle
```txt
User prompt
  |
  v
Home session orchestrator
  |
  v
Request log
  |
  v
Fast-path check
  |-- simple prompt --> immediate answer
  |
  v
Route sub-agents as needed
  |
  |-- Execution controls when needed
  |     task metadata, dependencies, retries, timeouts,
  |     output budgets, checkpoints, partial-result handling
  |
  |-- Conceptualizer --> search brief
  |-- Navigator ------> raw evidence packet
  |-- Packer ---------> coherent report
  |-- Checker --------> quote/claim verification + index maintenance
  |
  v
Final answer to user
```

The home session is the orchestrator. It is governed by `AGENTS.md` and controls routing, handoffs, stop conditions, and final response assembly.

## Sub-Agent Pipeline
| Stage | Owner | Function | Input | Output |
|---|---|---|---|---|
| 0 | Home session | Log request, choose route, add execution controls when needed, pass outputs, enforce stop conditions | User prompt, router, configuration | Fast-path answer or routed sequence |
| 1 | Conceptualizer | Understand the research need and translate it into searchable concepts | User prompt, blueprint, configuration | Search brief, keywords, route recommendation, optional task decomposition |
| 2 | Navigator | Search the LLM Realm first and Root Vault only when needed | Search brief, folder indexes, concept indexes, Root Vault paths | Raw evidence packet with source paths |
| 3 | Packer | Build a coherent report answering the original request | Original prompt, search brief, evidence packet | Report in `05_agent_reports/`, with completed/partial/unresolved sections when needed |
| 4 | Checker | Verify quotes and claims, then maintain indexes if needed | Report, evidence packet, Root Vault, registered sources | Verification note, corrected report/index if needed, including partial status when applicable |

The Checker can run alone when the user asks for verification, source-path repair, quote checking, or index maintenance.

## Execution Control Layer
The control layer is owned by the home session, not by a new sub-agent. It is activated only when a route branches, risks stalling, needs retries, needs a checkpoint, or can return a useful partial result.

| Control | Purpose | Durable surface |
|---|---|---|
| Task metadata | Make owners, dependencies, status, and output budgets explicit | Inline route plan or `03_logs/execution_runs.md` |
| Dependency graph | Run independent branches without losing required order | Conceptualizer brief and home-session execution plan |
| Retry / timeout | Recover from transient failures and stop stuck tasks | `03_logs/execution_runs.md` when used |
| Output budget | Keep specialist outputs proportional to task depth | Execution plan |
| Partial handling | Preserve usable completed work while marking gaps | Packer report and Checker verification |
| Checkpoint | Preserve resumable state for long or branched routes | `05_agent_reports/` checkpoint file |
| Monitoring | Track route health over time | `03_logs/execution_runs.md` |

## Setup Lifecycle
Initial setup creates the translation layer between Root Vault and LLM Realm.

```txt
Setup draft / user startup prompt
  |
  v
Fill configuration and research blueprint
  |
  v
Verify Root Vault path and protection rules
  |
  v
Survey Root Vault structure
  |
  v
Create initial LLM Realm index
  |
  |-- folder mirror indexes
  |-- nested folder indexes where useful
  |-- reusable evidence fragments
  |-- concept indexes where repeated patterns exist
  |
  v
Mark setup_status: realm_started
```

The setup output is not a final interpretation of the research corpus. It is the first navigable, token-efficient map that later agents can search.

## Search Order
1. `01_llm_realm/00_realm_index.md`
2. Relevant folder indexes in `01_llm_realm/00_root_mirror/`
3. Relevant concept indexes in `01_llm_realm/03_concept_indexes/`
4. Relevant evidence fragments in `01_llm_realm/04_evidence_fragments/`
5. Root Vault source files for verification, missing context, or unmapped material
6. External sources only when allowed by configuration or explicitly requested

## Evidence Hierarchy
| Layer | Role |
|---|---|
| Root Vault source | Canonical source of truth |
| Registered external source | Allowed only under external source policy |
| Evidence fragment | Reusable, indexed quote or source excerpt |
| Folder index | Navigation layer |
| Concept index | Retrieval and pattern layer |
| Packer report | User-facing synthesis, not evidence by itself |
| Checker note | Verification state for quotes and claims |

## Active Files
| File | Role |
|---|---|
| `AGENTS.md` | Top-level operating rules |
| `00_system/instructions/PROCESS_ROUTER.md` | Prompt routing rules for the home-session orchestrator |
| `00_system/instructions/STARTUP.md` | Canonical Root Vault to LLM Realm conversion prompt |
| `00_system/sub_agents/*/SOUL.md` | Specialized sub-agent contracts |
| `01_llm_realm/00_root_mirror/` | Folder-level Root Vault mirror indexes |
| `03_logs/user_requests.md` | Request log |
| `03_logs/execution_runs.md` | Execution-control log for retries, timeouts, checkpoints, branching, and partial results |
| `05_agent_reports/` | Reports, checkpoints, evidence packets, and Checker verification notes |

## Retired Model
The previous agent names are historical. Active routing now uses Conceptualizer, Navigator, Packer, and Checker. Archived files may mention retired names, but archived material is not active instruction.
