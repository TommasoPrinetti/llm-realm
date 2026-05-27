---
type: startup_protocol
role: setup_translation_protocol
purpose: [fill the configuration and research blueprint before initial indexing]
scope: [initial setup only]
connects_to:
  - 00_system/instructions/STARTUP.md
  - 00_system/instructions/REALM_CONFIGURATION.md
  - 02_user_realm/RESEARCH_BLUEPRINT.md
created: 2026-05-26
updated: 2026-05-27
---

# Realm Startup Protocol

Use once for a new research Realm.

The agent starts this protocol automatically when `AGENTS.md` is read and the user asks to start the Realm, the configuration or blueprint still contains required placeholders, or either file contains `setup_status: cli_started`.

If the user already ran `npm run llm-onboard`, the agent must treat those answers as the setup draft and complete startup without repeating questions unless a required field is missing or a risky assumption blocks indexing. Startup means translating the setup draft, marking setup complete, and running the first indexing pass.

## Steps
1. Inspect `02_user_realm/RESEARCH_BLUEPRINT.md` and `00_system/instructions/REALM_CONFIGURATION.md`.
2. Read `00_system/instructions/STARTUP.md`; it is the canonical Root Vault to LLM Realm conversion prompt.
3. Create a short todo list with the CLI's todo/task tool if available. This is mandatory when the tool exists. Minimum todo items:
   - inspect setup draft,
   - verify Root Vault,
   - synthesize blueprint/config,
   - create folder mirror indexes,
   - run retrieval smoke test.
4. Treat CLI-generated answers as a setup draft, not as questions to repeat.
5. Translate the draft into a usable research configuration before indexing:
   - preserve the project title and description,
   - register helpful artifact URLs or file paths,
   - infer a tentative source universe, vocabulary, methods, outputs, and indexing target from the description, artifacts, and Root Vault,
   - keep inferred fields explicitly marked as inferred when useful.
6. Use shell/file tools to confirm the Root Vault path exists and is treated as read-only.
7. If artifact URLs are present, use web/MCP/browser tools only when `external_sources_allowed` is set to `yes`. If the policy is `no`, record URLs but do not fetch them.
8. Fill `02_user_realm/RESEARCH_BLUEPRINT.md`.
9. Fill `00_system/instructions/REALM_CONFIGURATION.md`, especially `root_vault_path` and source policy. Replace `setup_status: cli_started` with `setup_status: realm_started` in both startup files when translation is complete.
10. Audit the translation before moving on:
   - every project detail from the CLI draft is preserved or intentionally summarized,
   - every artifact URL or file path is listed,
   - every source policy and protected path is reflected in configuration,
   - inferred scope, source universe, vocabulary, methods, outputs, and initial indexing target are present where useful,
   - anything not translated is listed as deferred with a reason.
11. Create folder-mirrored indexes under `01_llm_realm/00_root_mirror/` using `01_llm_realm/00_root_mirror/FOLDER_INDEX_TEMPLATE.md`.
12. If `03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR.md` does not exist, create it from `03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR_TEMPLATE.md`.
13. Run the first indexing pass described in `00_system/instructions/STARTUP.md`. Do this in the same turn as startup unless blocked by a missing required field, an unreachable Root Vault, or required external URL permission.
14. Run the retrieval smoke test in `00_system/instructions/STARTUP.md`.
15. Use `00_system/templates/STARTUP_REPORT_TEMPLATE.md` for the final response. Report the completed startup checklist, followed by a `Next Steps` section with 3 to 5 concrete actions the researcher can ask for next.

Do not ask follow-up questions before step 11 unless a required field is absent, the Root Vault path cannot be located, external URL access needs permission, or a risky assumption blocks immediate indexing. The user's `start the Realm` prompt is already permission to run initial indexing.

Use the CLI's todo/task tool if available to track startup; this is mandatory when the tool exists. Keep the todo list in the tool UI, not in the Realm, unless the researcher asks for a written checklist.

Use the CLI's question/input tool for required questions. If no question tool exists, ask in chat. Keep questions short and grouped only when unavoidable.

## Do Not Stop Early
- Do not stop after reading files.
- Do not stop after creating only a folder index.
- Do not ask whether to run initial indexing after the user has said `start the Realm`.
- Do not leave `setup_status: cli_started` in the blueprint or configuration after translation.
- Do not report startup complete unless the setup draft was translated, the translation audit passed, the aggregator exists, and initial indexing ran or is explicitly blocked.

## Final Response
Use `00_system/templates/STARTUP_REPORT_TEMPLATE.md`. End the startup response with a short `Next Steps` section. Suggestions should be operational and specific to the mapped Root Vault when possible. Use options like:
- extract first evidence fragments from a named source batch,
- build the first concept index from repeated themes,
- answer a source-grounded research question,
- deepen indexing for a specific folder or source type,
- run a Checker quote, citation, or missing-source verification pass.

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
- `setup_status` is `realm_started` if the files were created by CLI setup.
- `01_llm_realm/00_root_mirror/` contains folder-level indexes for meaningful Root Vault folders.
- `RESEARCH_NEED_AGGREGATOR.md` exists.
- Initial source indexing has a clear target and a Checker verification smoke test.

## Smoke Test
After startup, test with one small source batch:
1. Create one folder index.
2. Extract one evidence fragment.
3. Link it to one concept index.
4. Verify it with Checker.
5. Answer one small question with source path, evidence type, and evidence level.
