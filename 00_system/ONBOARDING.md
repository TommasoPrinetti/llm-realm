---
type: onboarding_protocol
agent: Varro
created: 2026-05-21
updated: 2026-05-21
---

# Onboarding Protocol

Use once for a new research Realm.

The agent starts this protocol automatically when `AGENTS.md` is read and the configuration or blueprint still contains placeholders. If the user already ran `npm run onboard`, treat those answers as a first draft and ask only precise follow-up questions.

## Steps
1. Inspect `02_user_realm/RESEARCH_BLUEPRINT.md` and `00_system/REALM_CONFIGURATION.md`.
2. If available, use the CLI's question/input tool to ask the researcher only for missing or underspecified required fields.
3. Fill `02_user_realm/RESEARCH_BLUEPRINT.md`.
4. Fill `00_system/REALM_CONFIGURATION.md`, especially `root_vault_path` and source policy.
5. If `01_llm_realm/06_research_tendencies/MASTER_OMEN.md` does not exist, create it from `01_llm_realm/06_research_tendencies/MASTER_OMEN_TEMPLATE.md`.
6. Confirm the Root Vault exists and is protected.
7. Ask the researcher whether to start the initial translation.
8. If yes, run `00_system/INITIAL_TRANSLATION_PROTOCOL.md`.

Use the CLI's todo/task tool if available to track onboarding. Keep the todo list in the tool UI, not in the Realm, unless the researcher asks for a written checklist.

## Minimum Research Blueprint
- Project title
- Research object
- Current questions
- Source universe
- Evidence standards
- External source policy

## Minimum Configuration
- `root_vault_path`
- `root_vault_mode`
- `source_policy`
- `external_sources_allowed`
- `preferred_llm_cli`
- `claim_standard`
- `l2_policy`

## Suggested Question Groups
Ask in small groups rather than one long interview:
1. Project: title, object, scope, current questions.
2. Sources: Root Vault path, source types, expected incoming material.
3. Tooling: preferred LLM CLI.
4. Rules: external source policy, evidence standards, sensitivity constraints.
5. Outputs: briefs, indexes, memos, articles, diagrams, or other expected products.

## Done When
- Root Vault is protected and locatable.
- Configuration points to the Root Vault.
- `MASTER_OMEN.md` exists.
- Initial source mapping has a clear target.

## Smoke Test
After onboarding, test with one small source batch:
1. Create one source map.
2. Extract one evidence fragment.
3. Link it to one concept index.
4. Back-search it.
5. Answer one small question with source path, evidence type, and evidence level.
