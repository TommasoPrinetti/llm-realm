---
type: agent_report_index
role: report_surface_index
purpose: [list where reports, verification notes, and maintenance notes live]
scope: [05_agent_reports]
connects_to:
  - AGENTS.md
  - 00_system/sub_agents/packer/SOUL.md
  - 00_system/sub_agents/checker/SOUL.md
created: 2026-05-26
updated: 2026-05-27
---

# Agent Reports

This folder contains Packer reports, Checker verification notes, and maintenance reports.

## Purpose
- Packer writes coherent reports answering user requests from retrieved evidence
- Checker writes verification notes for quotes, claims, source paths, and index maintenance
- Navigator may write raw evidence packets here when retrieval is too large or important to pass inline
- All reports are timestamped for traceability

## Report log
| Date | Agent | Type | Summary |
|---|---|---|---|
