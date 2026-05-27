---
type: realm_configuration
agent: onboarding_cli
role: framework_configuration
purpose: [store project-level setup, source policy, and protected paths]
scope: [entire framework]
connects_to:
  - AGENTS.md
  - 00_system/instructions/STARTUP.md
  - 00_system/instructions/PROCESS_ROUTER.md
created: 2026-05-26
updated: 2026-05-27
setup_status: cli_started
---

# Realm Configuration

Agents read this before major work.

```yaml
realm_type: research_framework
research_mode: evolving_complex_corpus
root_vault_path: "[path]"
root_vault_mode: protected_append_only

source_policy: internal_first
external_sources_allowed: no
external_logs:
  - 03_logs/external_queries.md
  - 03_logs/source_intake_log.md

claim_standard: source_link_required
l2_policy: checker_required

protected_paths:
  - "[root_vault_path]"
  - 02_user_realm/writing/

archive_path: 01_llm_realm/archive/
stale_after_days: 30
archive_after_days: 60
preferred_llm_cli: "[cli]"
```
