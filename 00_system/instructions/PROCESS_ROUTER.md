---
type: process_router
role: routing_contract
purpose: [decide which path a user prompt should take]
scope: [home-session orchestration]
connects_to:
  - AGENTS.md
  - 00_system/instructions/SYSTEM_ARCHITECTURE_MAP.md
  - 00_system/sub_agents/README.md
  - 03_logs/user_requests.md
created: 2026-05-26
updated: 2026-05-27
---

# Process Router

Use this file to choose the operational route for a user prompt. The home session is the orchestrator and uses the relevant sub-agent SOUL file for execution details.

## Non-Negotiable
- Root Vault is read-only. Never modify, reorganize, rename, or delete source files.
- `02_user_realm/writing/` is read-only. It is the researcher's protected writing space.
- Search the LLM Realm before opening the Root Vault unless the user explicitly asks for original files or verification.
- Every non-trivial source claim must be checked against a Root Vault or registered source path before it is presented as established.

## Universal First Step
The home session logs every request in `03_logs/user_requests.md`.

Use one short row:

| Date | Request summary | Route | Status | Output |
|---|---|---|---|---|

Do not over-log. The log is for routing memory, not full transcripts.

## Fast Path
Use the fast path only when all are true:
- the prompt is short,
- the answer is operational or obvious from the current context,
- no source search is needed,
- no factual claim from the Root Vault is being introduced.

Route:

```txt
log -> answer
```

## Sub-Agent Routes
| Trigger | Route | Output |
|---|---|---|
| Clarify what needs searching | Conceptualizer | Search brief or structured research need |
| Find material in the indexed Realm | Conceptualizer -> Navigator | Raw evidence packet or source pointer |
| Answer from evidence | Conceptualizer -> Navigator -> Packer -> Checker | Verified report and final answer |
| Synthesize several evidence packets | Packer -> Checker | Verified report |
| Verify quotes or citations | Checker | Verification note |
| Check whether an index matches the Root Vault | Checker | Index maintenance note |
| Repair stale source paths or broken evidence links | Checker | Updated index/report |
| Deepen a folder index or concept index | Conceptualizer -> Navigator -> Checker | Updated LLM Realm index |
| Startup / initial vault setup | `00_system/instructions/STARTUP.md` | Completed configuration, blueprint, folder mirror, and initial Realm index |

## Source Intake
Use `source_intake` for new Root Vault material or approved external sources that need registration or mapping.

The intake route does the following:
1. Register the source batch in `03_logs/source_intake_log.md`.
2. If the source is external, also log it in `03_logs/external_queries.md`.
3. Create or update the relevant folder mirror index under `01_llm_realm/00_root_mirror/`.
4. Extract only reusable evidence fragments.
5. Create or update concept indexes when the batch introduces repeated concepts.
6. Update `01_llm_realm/00_realm_index.md`.
7. Write a short intake report only when the files or indexes changed in a meaningful way.

The startup route already covers the first indexing pass. After startup, use `source_intake` for new material instead of a separate intake protocol.

## Home Session Orchestration
The home session owns sequencing. It may answer directly only on the fast path. Otherwise it selects the smallest useful route, passes outputs forward, and stops when the user request has been satisfied.

The home session must not:
- do Navigator work when source search is needed,
- do Packer work when a durable report is required,
- do Checker work without opening the original source or registered source path,
- run the full pipeline when a narrower route is enough.

## Execution Controls
Use execution controls for routed work that can branch, fail transiently, or produce partial but useful results. Do not add ceremony to simple linear routes.

### Task Metadata
When controls are needed, track each task with:

| Field | Meaning |
|---|---|
| `task_id` | Stable local ID for the task within the route |
| `owner` | `Conceptualizer`, `Navigator`, `Packer`, `Checker`, or `home_session` |
| `depends_on` | Task IDs that must finish before this task runs |
| `status` | `pending`, `ready`, `running`, `completed`, `partial`, `failed`, `blocked`, or `skipped` |
| `retry_policy` | `none`, `safe_retry_2`, or a stricter route-specific policy |
| `timeout` | `brief`, `standard`, or `extended`; use runtime timeouts when available |
| `output_budget` | `brief`, `standard`, or `deep`; prefer this over fake numeric token claims |
| `checkpoint_required` | `yes` when interruption or branching would otherwise lose useful work |

### Default Control Policy
| Route | Controls |
|---|---|
| `fast_path` | No execution plan beyond request log |
| `clarify_search` | Linear task, no retry unless tool failure occurs |
| `find_material` | Add timeout and retry around Navigator when source search is tool-heavy |
| `evidence_answer` | Use dependency metadata when Conceptualizer splits the search into branches; allow partial results only when gaps are labeled |
| `synthesis_report` | Use checkpoints when merging more than three evidence packets or when prior packets are incomplete |
| `verification` | No retries for unsupported claims; retry only path/tool failures |
| `index_maintenance` | Use checkpoints before broad index edits; do not parallelize edits to the same index file |
| `source_intake` | No partial registration of retained sources; blocked if required metadata is missing |
| `startup` | Use checkpoints after configuration, structure survey, and initial index creation |

### Failure Handling
- A failed dependency blocks downstream tasks unless the downstream task can honestly produce a partial result.
- Partial results must name completed branches, failed branches, unresolved gaps, and any claims withheld from final presentation.
- Checker may return `partial` when verified claims remain usable but unresolved branches prevent a full pass.
- Record any retry, timeout, checkpoint, or partial final state in `03_logs/execution_runs.md`.

## Sub-Agent Contracts
| Sub-agent | Reads | Writes | Must not do |
|---|---|---|---|
| Conceptualizer | User prompt, configuration, blueprint, existing request logs | `03_logs/structured_research_needs/`, `03_logs/user_requests.md` | Search sources, quote evidence, write final reports |
| Navigator | Conceptualizer brief, LLM Realm, Root Vault if needed | `01_llm_realm/` when indexing is needed, raw evidence packet in `05_agent_reports/` when useful | Interpret beyond retrieval, write final answers |
| Packer | Original request, Conceptualizer brief, Navigator packet | `05_agent_reports/` | Verify quotes, alter source evidence, maintain indexes |
| Checker | Packer report, Navigator packet, LLM Realm, Root Vault, registered external sources | `01_llm_realm/`, `03_logs/`, `05_agent_reports/` | Create unsupported interpretations, silently pass unverified claims |

## Sequence Rules
- Conceptualizer does not search. It defines what should be searched.
- Navigator searches and retrieves. It does not decide the final interpretation.
- Packer answers the user's original request in report form. It does not certify evidence.
- Checker verifies quotes and claims. It can be called alone more often than the others.
- The home session decides the sequence, passes outputs, and enforces stop conditions.
- If Checker finds a quote mismatch, stale index entry, or broken path, fix the Realm index when the correction is local and clear.
- If the Root Vault cannot be accessed, stop source-grounded claims and report the blocker.

## Output Boundaries
| Output | Use when |
|---|---|
| Request log row | Every prompt |
| Search brief | The request needs conceptual decomposition |
| Raw evidence packet | Navigator has found source material that must be passed forward |
| Agent report | Packer has synthesized evidence into an answer |
| Verification note | Checker has accepted, corrected, or rejected evidence claims |
| Folder index / concept index / fragment | The LLM Realm needs durable navigation improvements |
| Execution log row | A routed run used retries, timeouts, checkpoints, branching, or partial-result handling |
