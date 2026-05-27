---
type: startup_report_template
role: startup_output_template
purpose: [guide the final setup report after the Realm is started]
scope: [startup completion only]
connects_to:
  - 00_system/instructions/STARTUP.md
  - 00_system/instructions/ONBOARDING.md
  - 05_agent_reports/README.md
created: 2026-05-26
updated: 2026-05-27
---

# Startup Report Template

Use this structure for the final response after `Read AGENTS.md and start the Realm`.

## Outcome
[One or two sentences: setup translated, Root Vault verified, first indexing status.]

## Startup Checklist
- [done / blocked] Setup draft inspected
- [done / blocked] Root Vault verified
- [done / blocked] Blueprint/config translated
- [done / blocked] Translation audit completed
- [done / blocked] Folder mirror indexes created in `01_llm_realm/00_root_mirror/`
- [done / blocked] Grep/Checker smoke test completed
- [done / blocked] Initial indexing pass completed

## Changes
- [file changed or created]

## Validation
- [path checks, placeholder scans, folder mirror coverage, grep/Checker smoke test, external policy decision]

## Next Steps
Offer 3 to 5 concrete next actions. Prefer actions grounded in the mapped Root Vault:
- extract first evidence fragments from [mapped source batch],
- build a concept index for [recurring theme],
- answer a source-grounded research question,
- deepen indexing for [specific folder or source type],
- run a Checker quote, citation, or missing-source verification pass.
