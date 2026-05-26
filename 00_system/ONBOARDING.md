---
type: startup_protocol
agent: Varro
created: 2026-05-21
updated: 2026-05-21
---

# Realm Startup Protocol

Use once for a new research Realm.

The agent starts this protocol automatically when `AGENTS.md` is read and the configuration or blueprint still contains required placeholders. If the user already ran `npm run onboard`, treat those answers as enough to begin unless a required field is missing or a risky assumption blocks mapping.

## Steps
1. Inspect `02_user_realm/RESEARCH_BLUEPRINT.md` and `00_system/REALM_CONFIGURATION.md`.
2. Create a short todo list with the CLI's todo/task tool if available:
   - inspect setup draft,
   - verify Root Vault,
   - synthesize blueprint/config,
   - initialize aggregator,
   - ask whether to map.
3. Treat CLI-generated answers as a setup draft, not as questions to repeat.
4. Translate the draft into a usable research configuration:
   - preserve the project title and description,
   - register helpful artifact URLs or file paths,
   - infer a tentative source universe, vocabulary, methods, outputs, and mapping target from the description, artifacts, and Root Vault,
   - keep inferred fields explicitly marked as inferred when useful.
5. Use shell/file tools to confirm the Root Vault path exists and is treated as read-only.
6. If artifact URLs are present, use web/MCP/browser tools only when `external_sources_allowed` permits it. If the policy is `explicit_request_only`, ask before fetching URLs.
7. Fill `02_user_realm/RESEARCH_BLUEPRINT.md`.
8. Fill `00_system/REALM_CONFIGURATION.md`, especially `root_vault_path` and source policy.
9. Audit the translation before moving on:
   - every project detail from the CLI draft is preserved or intentionally summarized,
   - every artifact URL or file path is listed,
   - every source policy and protected path is reflected in configuration,
   - inferred scope, source universe, vocabulary, methods, outputs, and initial mapping target are present where useful,
   - anything not translated is listed as deferred with a reason.
10. If `01_llm_realm/06_research_tendencies/RESEARCH_NEED_AGGREGATOR.md` does not exist, create it from `01_llm_realm/06_research_tendencies/RESEARCH_NEED_AGGREGATOR_TEMPLATE.md`.
11. Ask the researcher whether to start the initial mapping.
12. If yes, run `00_system/INITIAL_MAPPING_PROTOCOL.md`.

Do not ask follow-up questions before step 11 unless a required field is absent, the Root Vault path cannot be located, external URL access needs permission, or a risky assumption blocks immediate mapping.

Use the CLI's todo/task tool if available to track startup. Keep the todo list in the tool UI, not in the Realm, unless the researcher asks for a written checklist.

Use the CLI's question/input tool for required questions. If no question tool exists, ask in chat. Keep questions short and grouped only when unavoidable.

## Minimum Research Blueprint
- Project title
- Project description
- Helpful artifact URLs or file paths, if any
- Root Vault path
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
Keep setup short. Ask for:
1. Project name.
2. One free-form project description.
3. Helpful artifact URLs or file paths.
4. Root Vault path.
5. External source policy.
6. Preferred LLM CLI.

Do not ask the researcher to separately define scope, research object, current questions, source types, methods, outputs, vocabulary, or blind spots during fast setup. Infer those later from the description, artifacts, and Root Vault unless the researcher offers them or the missing detail blocks the immediate task.

## Done When
- Root Vault is protected and locatable.
- Configuration points to the Root Vault.
- `RESEARCH_NEED_AGGREGATOR.md` exists.
- Initial source mapping has a clear target.

## Smoke Test
After startup, test with one small source batch:
1. Create one source map.
2. Extract one evidence fragment.
3. Link it to one concept index.
4. Back-search it.
5. Answer one small question with source path, evidence type, and evidence level.
