---
type: execution_run_log
role: execution_control_log
purpose: [record routed runs that use retries, timeouts, checkpoints, or partial handling]
scope: [non-linear or failure-prone routed work]
connects_to:
  - AGENTS.md
  - 00_system/instructions/PROCESS_ROUTER.md
  - 05_agent_reports/README.md
created: 2026-05-27
updated: 2026-05-27
---

# Execution Runs

Record routed runs only when execution controls were used: branching, retries, timeouts, checkpoints, output budgets, or partial-result handling.

Do not duplicate ordinary request logging here. Simple linear routes belong only in `03_logs/user_requests.md`.

| Date | Request summary | Route | Controls used | Final status | Checkpoint/report | Notes |
|---|---|---|---|---|---|---|

## Status Values
- `completed`
- `partial`
- `failed`
- `blocked`

## Control Values
- `dependency_graph`
- `retry`
- `timeout`
- `output_budget`
- `concurrency_cap`
- `checkpoint`
- `partial_result`
