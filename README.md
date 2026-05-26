# LLM Realm

LLM Realm is a lightweight research framework for using CLI-based LLM agents over large, evolving source collections.

```txt
Root Vault = protected source collection
LLM Realm  = writable research map
```

The Root Vault holds your research material. Agents may read it, but never edit it. The Realm holds source maps, metadata, evidence fragments, concept indexes, logs, memos, mailbox notes, and reports.

The point is governed assistance: source paths, evidence labels, back-search, adversarial checks, and researcher control.

## Install

```bash
git clone https://github.com/TommasoPrinetti/llm-realm.git my-llm-realm
cd my-llm-realm
```

Open the folder with Codex, Claude Code, Opencode, or another CLI agent that can read and write Markdown.

## Start

Optional fast start:

```bash
npm run llm-onboard
```

This opens a short terminal questionnaire and writes a first draft of:

```txt
02_user_realm/RESEARCH_BLUEPRINT.md
00_system/REALM_CONFIGURATION.md
```

Then open the repo with your LLM agent.

Tell the agent:

```txt
Read AGENTS.md and start the Realm.
```

The agent will:

1. create a short todo list when its CLI supports task tracking,
2. translate the CLI draft into a usable research configuration,
3. infer scope, source universe, vocabulary, methods, outputs, and mapping targets from the project description, artifact references, and Root Vault,
4. check that all useful draft details and artifact references were translated or explicitly deferred,
5. verify local paths with file/shell tools,
6. use web, browser, or MCP tools for artifact URLs only when your source policy allows it,
7. ask a follow-up question only if required information is missing, external URL access needs permission, or the Root Vault cannot be located,
8. fill `02_user_realm/RESEARCH_BLUEPRINT.md`,
9. fill `00_system/REALM_CONFIGURATION.md`,
10. initialize `RESEARCH_NEED_AGGREGATOR.md` if missing,
11. run the first mapping pass.

If the CLI has a todo/task tool, the agent should use it to track startup progress without creating extra files.

The prompt `Read AGENTS.md and start the Realm.` is permission to complete startup and run the first mapping pass. The agent should ask a question only if required setup information is missing, the Root Vault cannot be located, or external URL access needs permission.

The agent should not stop after only creating a source map. Startup is complete only after the setup draft has been translated into the blueprint/config, `setup_status` is marked `realm_started`, the startup checklist is complete, and the first mapping pass has run or is explicitly blocked.

The startup report should end with concrete next steps, such as extracting first evidence fragments, creating the first concept index, asking a source-grounded research question, deepening a specific source map, or running a contradiction/negative-case pass.

## Daily Use

| Task | Path |
|---|---|
| New source batch | `00_system/INCOMING_SOURCE_PROTOCOL.md` |
| Research question | `03_logs/user_questions.md` |
| Evidence answer | indexes → back-search → L1/L2 answer |
| Contradiction or lead | mailbox note or internal memo |
| Cleanup | archive/report |

## Internal Roles

The framework uses internal roles to route work. You do not need to call them directly.

| Role | Job |
|---|---|
| Cicero | map sources, extract reusable fragments, build indexes |
| Lucrezio | log questions, detect repeated research needs |
| Tacito | find contradictions, negative cases, missing sources, weak signals |
| Varro | keep the Realm clean, archived, and navigable |

## Rules

- Do not edit the Root Vault.
- Do not edit `02_user_realm/writing/`.
- Do the smallest valid Realm action.
- Every factual claim needs a source path.
- L2/serendipitous material requires back-search before reporting.
- External sources must be logged.
- Archived files are historical, not active instructions.

## License

MIT.
