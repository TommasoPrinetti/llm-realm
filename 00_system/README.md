---
type: system_index
role: system_directory_map
purpose: [explain the instruction, sub-agent, and template layout]
scope: [00_system and its child files]
connects_to:
  - AGENTS.md
  - 00_system/instructions/README.md
  - 00_system/sub_agents/README.md
  - 00_system/templates/STARTUP_REPORT_TEMPLATE.md
created: 2026-05-26
updated: 2026-05-27
---

# System Folder

This folder contains instructions and contracts used by the agent harness.

## Structure

```txt
00_system/
  instructions/   Operational instructions the active session reads.
  sub_agents/     SOUL files for specialist sub-agents.
  templates/      Response and report templates.
  archive/        Retired system files.
```

## Read Order
1. `AGENTS.md`
2. `00_system/instructions/REALM_CONFIGURATION.md`
3. `00_system/instructions/SYSTEM_ARCHITECTURE_MAP.md`
4. `00_system/instructions/PROCESS_ROUTER.md`

Startup uses `00_system/instructions/STARTUP.md`.
