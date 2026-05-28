---
type: startup_report_template
role: startup_output_template
purpose: [guide the final setup report after the Realm is started]
scope: [startup completion only]
connects_to:
  - 00_system/instructions/STARTUP.md
  - 00_system/instructions/ONBOARDING.md
  - 05_agent_reports/
created: 2026-05-26
updated: 2026-05-28
---

# Startup Report Template

Use this structure for the final response after `Read AGENTS.md and start the Realm`.

## Outcome
[One or two sentences: setup translated, Root Vault verified, source copies created, dictionary built, headers generated.]

## Startup Checklist
- [done / blocked] Setup draft inspected
- [done / blocked] Root Vault verified
- [done / blocked] Blueprint/config translated
- [done / blocked] Translation audit completed
- [done / blocked] Source copies created in 01_llm_realm/sources/
- [done / blocked] Master dictionary built in 01_llm_realm/00_dictionary.md
- [done / blocked] YAML headers generated for all source copies
- [done / blocked] Concept indexes created from repeated themes
- [done / blocked] Realm index updated
- [done / blocked] Smoke test completed

## Changes
- [file changed or created]

## Validation
- [path checks, placeholder scans, source copy coverage, dictionary size, grep/Checker smoke test, external policy decision]

## Next Steps
Offer 3 to 5 concrete next actions. Prefer actions grounded in the mapped Root Vault:
- answer a source-grounded research question using [specific source copy],
- build a concept index for [recurring theme],
- deepen the dictionary with more detailed entity extraction,
- run a Checker verification pass on source copy headers,
- add more sources to the Root Vault and re-run intake.
