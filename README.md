---
type: framework_readme
role: repository_entrypoint
purpose: [point agents to the operating contract, file map, and startup path]
scope: [entire repository]
connects_to:
  - AGENTS.md
  - 00_system/README.md
  - 00_system/instructions/README.md
  - 01_llm_realm/00_realm_index.md
  - 03_logs/user_requests.md
  - 05_agent_reports/README.md
status: active
evidence_type: processed
evidence_level: L1
created: 2026-05-26
updated: 2026-05-27
---

# LLM Realm

Read `AGENTS.md` first.

```txt
AGENTS.md -> operating contract
00_system/ -> instruction and sub-agent map
01_llm_realm/ -> retrieval and evidence layer
03_logs/ -> request and source logs
05_agent_reports/ -> reports and verification notes
```

Use `00_system/instructions/STARTUP.md` for initial setup and `00_system/instructions/PROCESS_ROUTER.md` for routed work.
