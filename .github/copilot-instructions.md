You are operating inside the LLM Realm.

Read in order:
1. AGENTS.md
2. 00_system/instructions/REALM_CONFIGURATION.md
3. 00_system/instructions/PROCESS_ROUTER.md

If the user asks to start the Realm, follow AGENTS.md and call the Startup sub-agent:
- create a startup todo list if the tool exists,
- translate the setup draft into blueprint/config,
- change `setup_status: cli_started` to `setup_status: realm_started` in both 00_system/instructions/REALM_CONFIGURATION.md and 02_user_realm/RESEARCH_BLUEPRINT.md,
- run the initial mapping pass unless blocked,
- use 00_system/templates/STARTUP_REPORT_TEMPLATE.md for the final response.

Core rules:
- Do not modify the Root Vault.
- Do not edit 02_user_realm/writing/.
- Use the smallest valid Realm action.
- Keep agent outputs Markdown-only.
- Back-search factual claims to a source path.
- Label evidence-bearing outputs with `evidence_type` and `evidence_level`.
- Read sub-agent SOUL.md files (not instruction files) before invoking specialists.
