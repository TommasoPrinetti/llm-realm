# TODO — LLM Human Ecology System

## 1. Knowledge / Context System

* [x] Create a glossary + dictionaries system → `GLOSSARY.md`, `01_llm_realm/00_dictionary.md`
* [x] Detect languages automatically → dictionary records language per term, source copy headers include `language` field
* [x] Structure project-specific files and contexts → full directory tree
* [x] Build an internal copy/index of the root vault → `bin/onboard.sh` copies, `STARTUP.md` indexes
* [x] Index YAML instructions/configurations → YAML headers are the core retrieval mechanism
* [x] Copy only text-based files into the indexed environment → `onboard.sh` copies md, txt, rtf, csv, json, yaml, etc.
* [x] Preserve/connect headers and links during indexing → `[[wikilinks]]` in headers, `OBSIDIAN_CONSTRAINTS.md` defines rules
* [ ] Improve token and context management strategy
* [x] Move more functionality into Obsidian-compatible structures → `OBSIDIAN_CONSTRAINTS.md` created, wikilinks supported
* [x] Support Obsidian-style paths and clickable links inside reports → verbatim quote format, wikilinks in Packer output

## 2. Startup / Initialization Workflow

* [x] Define startup bootstrap sequence → `STARTUP.md` (7 steps) + `ONBOARDING.md` (16 steps)
* [x] On startup: copy and process headers → Step 4 of `STARTUP.md`
* [x] On startup: load glossary + dictionaries → Step 3 of `STARTUP.md` (multilingual dictionary)
* [x] On startup: generate onboarding questions → `bin/onboard.sh`
* [x] Delete or archive `startup.md` after activation → `.trash/` directory created for archiving
* [x] Move initialization files into archive/generated folder → `.trash/` for retired files
* [x] Install/setup required services automatically during onboarding → pure bash, zero deps
* [x] Avoid requiring global NPM usage → pure bash, zero deps

## 3. Agent Behavior & Orchestration

### Main Agent Behavior

* [x] Agent should behave like an orchestrator → AGENTS.md §0 Behavioral Design
* [x] Agent must remain naturally curious → AGENTS.md §0 Curiosity
* [x] Agent should not get blocked by a single POV → AGENTS.md §0 Multi-perspective
* [x] Agent should constantly ask questions → AGENTS.md §0 Questioning (uses `question` tool)
* [x] Agent should guide the search process actively → AGENTS.md §0 Exploration mode
* [x] Agent should provide counter-perspectives → AGENTS.md §0 Counter-perspectives
* [x] Agent should avoid blocking/assertive modes → AGENTS.md §0 Augmentation over replacement
* [x] Agent should augment user thinking rather than replace it → AGENTS.md §0 Augmentation over replacement
* [ ] Agent should reason more broadly than the immediate process
* [x] Agent should maintain question-driven exploration → AGENTS.md §0 Exploration mode

### Sub-Agent System

* [x] Improve sub-agent calling structure → 4 sub-agents with SOUL.md contracts
* [x] Make sub-agents easier to invoke with precise profiles → SOUL.md files with Behavioral Rules
* [x] Define dedicated sub-agent profiles → SOUL.md (renamed from subagent_*_instructions.md)
* [ ] Verify whether sub-agents were already called
* [ ] Allow agents to call many sub-agents dynamically
* [x] Ensure sub-agents ask many exploratory questions → sub-agents are executors, only orchestrator asks questions

### Search / Research Behavior

* [ ] In "genuine thinking" mode: find large relevant text passages
* [ ] Extract contextual meaning instead of snippets only
* [x] Provide more project context when researchers are involved → RESEARCH_BLUEPRINT.md
* [ ] Make search behavior more exploratory and contextual

## 4. Reporting & Output

### Report Structure

* [x] Improve report structure overall → clean Packer output format (Answer, Evidence, Analysis, Limitations)
* [ ] Enable direct extraction from markdown into reports
* [x] Keep reports cleaner and less process-heavy → Checker verification is internal, not shown
* [x] Delete intermediate process noise when appropriate → only final report is presented
* [x] Keep primarily the final report/output → ONE clean markdown file
* [x] Improve navigation inside reports with Obsidian paths → wikilinks, verbatim quote format
* [x] Ensure reports contain richer contextual references → verbatim format with author, source, date, bold key passage

### Input / Output Routing

* [x] Define clear log/input/routing task delegation → `PROCESS_ROUTER.md`
* [x] Separate orchestration logic from execution logic → orchestrator (AGENTS.md) vs specialists (SOUL.md)

## 5. UX / Interaction Design

### User Interaction

* [x] Build onboarding question flows → `bin/onboard.sh`
* [ ] Prepare dynamic contextual question series
* [ ] Make questioning adaptive to user/project state
* [ ] Create different "attitudes"/interaction modes for orchestration

### Knowledge Navigation

* [x] Make Obsidian-style references clickable → `[[wikilinks]]` in headers and reports
* [x] Create hidden `.md` guides to connect systems → `OBSIDIAN_CONSTRAINTS.md`
* [ ] Improve contextual navigation across notes/files

## 6. Infrastructure / Technical Decisions

### Internal Vault Strategy

* [x] Create an internal mirrored vault → `01_llm_realm/sources/`
* [x] Synchronize root vault into internal indexed structure → `onboard.sh` copies, `STARTUP.md` indexes
* [ ] Explore scalable indexing architecture

### Dependency Management

* [x] Package dependencies locally in vault → pure bash, zero deps
* [x] Reduce reliance on globally installed packages → zero external packages
* [x] Design standalone environment setup → `bin/onboard.sh` + `bin/check-startup.sh`

## 7. Documentation & Communication

### Presentation / Portfolio

* [ ] Finish presentation for the LLM system
* [ ] Finish portfolio section including system components/workflows
* [x] Document structure and orchestration logic clearly → `AGENTS.md`, `SYSTEM_ARCHITECTURE_MAP.md`

### Structural Documentation

* [x] Define workflows formally → `PROCESS_ROUTER.md`
* [x] Document startup lifecycle → `STARTUP.md`, `ONBOARDING.md`
* [x] Document agent orchestration architecture → `SYSTEM_ARCHITECTURE_MAP.md`
* [x] Document indexing + vault synchronization process → `STARTUP.md`
