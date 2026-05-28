---
type: process_router
role: routing_contract
purpose: [decide which path a user prompt should take]
scope: [home-session orchestration]
connects_to:
  - AGENTS.md
  - 00_system/instructions/SYSTEM_ARCHITECTURE_MAP.md
  - 00_system/sub_agents/conceptualizer/SOUL.md
  - 00_system/sub_agents/navigator/SOUL.md
  - 00_system/sub_agents/packer/SOUL.md
  - 00_system/sub_agents/checker/SOUL.md
  - 00_system/sub_agents/cleaner/SOUL.md
  - 00_system/sub_agents/startup/SOUL.md
  - 03_logs/user_requests.md
created: 2026-05-26
updated: 2026-05-28
---

# Process Router

Use this file to choose the operational route for a user prompt. The home session is the orchestrator and uses the relevant sub-agent `SOUL.md` for execution details.

## Non-Negotiable
- **Root Vault is read-only.** Never modify, reorganize, rename, or delete source files.
- **`02_user_realm/writing/` is read-only.** It is the researcher's protected writing space.
- Search the **LLM Realm** before opening the Root Vault unless the user explicitly asks for original files or verification.
- Every non-trivial source claim must be checked against a **Root Vault or registered source path** before it is presented as established.

## Universal First Step
The home session logs every request in `03_logs/user_requests.md`.

Use one short row:

| Date | Request summary | Route | Status | Output |
|---|---|---|---|---|

Do not over-log. The log is for **routing memory**, not full transcripts.

## Fast Path
Use the fast path only when **all** are true:
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
| Clarify what needs searching | **Conceptualizer** | Search brief or structured research need |
| Find material in the indexed Realm | **Conceptualizer → Navigator** | Raw evidence packet or source pointer |
| Answer from evidence | **Conceptualizer → Navigator → Packer → Checker** | Verified report and final answer |
| Synthesize several evidence packets | **Packer → Checker** | Verified report |
| Verify quotes or citations | **Checker** | Verification note |
| Check whether an index matches the Root Vault | **Checker** | Index maintenance note |
| Repair stale source paths or broken evidence links | **Checker** | Updated index/report |
| Deepen a source copy header or concept index | **Conceptualizer → Navigator → Checker** | Updated LLM Realm index |
| Verify repo cleanliness | **Cleaner** | Cleaner report with issues, moved files, manual items |
| Startup / initial vault setup | **Startup** | Completed configuration, blueprint, source copies, dictionary, and initial Realm index |
| Disambiguation during startup | **Startup → Orchestrator → Startup** | Disambiguation Brief → user answers → updated dictionary/headers |

## Source Intake
Source intake is part of the **Startup sub-agent workflow**, not a separate route. When the user specifies a Root Vault, the Startup sub-agent handles:

1. Copying text-based files to `01_llm_realm/sources/`
2. Building the master dictionary
3. Generating YAML headers for all source copies
4. Creating concept indexes
5. Updating the master index

After initial startup, if the user adds new sources to the Root Vault, re-run the Startup sub-agent with the updated path. It will detect new files and process them.

## Home Session Orchestration
The home session owns sequencing. It may answer directly **only** on the fast path. Otherwise it selects the **smallest useful route**, passes outputs forward, and stops when the user request has been satisfied.

The home session must not:
- do Navigator work when source search is needed,
- do Packer work when a durable report is required,
- do Checker work without opening the original source or registered source path,
- run the full pipeline when a narrower route is enough.

## Execution Controls
Use execution controls for routed work that can **branch**, **fail transiently**, or produce **partial but useful results**. Do not add ceremony to simple linear routes.

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
| `startup` | Use checkpoints after configuration, structure survey, and initial index creation |

### Failure Handling
- A **failed dependency** blocks downstream tasks unless the downstream task can honestly produce a partial result.
- **Partial results** must name completed branches, failed branches, unresolved gaps, and any claims withheld from final presentation.
- Checker may return `partial` when verified claims remain usable but unresolved branches prevent a full pass.
- Record any retry, timeout, checkpoint, or partial final state in `03_logs/execution_runs.md`.

## Sub-Agent Contracts
| Sub-agent | Reads | Writes | Must not do |
|---|---|---|---|
| **Conceptualizer** | User prompt, configuration, blueprint, existing request logs | `03_logs/structured_research_needs/`, `03_logs/user_requests.md` | Search sources, quote evidence, write final reports |
| **Navigator** | Conceptualizer brief, LLM Realm, Root Vault if needed | `01_llm_realm/` when indexing is needed, raw evidence packet in `05_agent_reports/` when useful | Interpret beyond retrieval, write final answers |
| **Packer** | Original request, Conceptualizer brief, Navigator packet | `05_agent_reports/` | Verify quotes, alter source evidence, maintain indexes |
| **Checker** | Packer report, Navigator packet, LLM Realm, Root Vault, registered external sources | `01_llm_realm/`, `03_logs/`, `05_agent_reports/` | Create unsupported interpretations, silently pass unverified claims |
| **Cleaner** | Realm index, source copies, Root Vault path, concept indexes, dictionary | `.trash/` (moves outdated files), `00_realm_index.md`, `05_agent_reports/` | Delete files, edit content, reorganize outside archival |
| **Startup** | Startup files, configuration, blueprint, source copies, dictionary, concept index template | `00_dictionary.md`, source copy headers, `00_realm_index.md`, concept indexes, Navigator SOUL.md, `05_agent_reports/` | Ask questions, skip steps, report without smoke test |

## Sequence Rules
- **Conceptualizer** does not search. It defines what should be searched.
- **Navigator** searches and retrieves. It does not decide the final interpretation.
- **Packer** answers the user's original request in report form. It does not certify evidence.
- **Checker** verifies quotes and claims. It can be called alone more often than the others.
- **Cleaner** audits hygiene and moves outdated files to `.trash/`. It does not delete or reorganize.
- **Startup** executes the startup workflow. It does not ask questions — it produces disambiguation briefs.
- The **home session** decides the sequence, passes outputs, and enforces stop conditions.
- If Checker finds a quote mismatch, stale index entry, or broken path, fix the Realm index when the correction is local and clear.
- If the Root Vault cannot be accessed, **stop** source-grounded claims and report the blocker.

## Output Boundaries
| Output | Use when |
|---|---|
| Request log row | Every prompt |
| Search brief | The request needs conceptual decomposition |
| Raw evidence packet | Navigator has found source material that must be passed forward |
| Agent report | Packer has synthesized evidence into an answer |
| Verification note | Checker has accepted, corrected, or rejected evidence claims |
| Source copy header / concept index / dictionary | The LLM Realm needs durable navigation improvements |
| Execution log row | A routed run used retries, timeouts, checkpoints, branching, or partial-result handling |
