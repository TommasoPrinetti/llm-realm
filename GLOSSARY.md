# Glossary

**Agent** -- One of six active sub-agents that operate the Realm: Conceptualizer, Navigator, Packer, Checker, Cleaner, Startup. Each has a constrained domain and SOUL.md.

**Checker verification** -- Checker opens the Root Vault or source copy to verify a quote, claim, concept index, or header entry before it is treated as source-grounded.

**Blueprint** -- Short for 02_user_realm/RESEARCH_BLUEPRINT.md. Defines the research project scope, questions, corpus, evidence standards, and direction. Orients all agent activity.

**Concept index** -- A thematic collection of source copies grouped under one concept (e.g., "speed vs. quality"). Lives in 01_llm_realm/03_concept_indexes/.

**Dictionary** -- 01_llm_realm/00_dictionary.md. Shared vocabulary of canonical names, places, organizations, concepts, and domain terms. Supports multilingual keywords. Ensures consistent terminology across source copy headers.

**Internal-first source policy** -- The rule that agents must not search external sources (web, APIs, general knowledge) unless the researcher explicitly requests it or the Realm configuration allows logged external intake.

**L1 / L2** -- See *Evidence level*.

**Evidence level** -- L1 (direct, high confidence, explicitly answers the question) or L2 (adjacent and requires Checker verification before reporting).

**Evidence type** -- Whether a claim is: primary (direct source material), processed (summary/cluster), interpretive (hypothesis/pattern), or external (logged outside source).

**Research Need Aggregator** -- 03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR.md. Aggregation of research needs, used to detect recurring prompt and search patterns.

**`.now`** -- The convention that every file records `created: [date]` at creation and `updated: [date]` on every edit. Enables maintenance and stale-file checks.

**Realm** -- Short for LLM Realm. The writable, indexed, conceptually navigable map of the Root Vault.

**Realm Configuration** -- 00_system/instructions/REALM_CONFIGURATION.md. The operating profile for the project: source policy, Root Vault path, evidence standards, enabled workflows, and agent sequence.

**Re-index** -- A Navigator and Checker maintenance pass that reorganizes the Realm around a detected pattern or fixes stale source navigation.

**Root Vault** -- The protected source collection. Never modified by agents. All source copies link back to it.

**SOUL.md** -- A sub-agent contract file stored under 00_system/sub_agents/[agent]/SOUL.md. Defines one sub-agent's allowed inputs, actions, outputs, behavioral rules, and prohibitions. Sub-agents are executors — they do not ask questions.

**Source copy** -- A 1:1 copy of a text-based Root Vault file in 01_llm_realm/sources/, with a YAML header containing metadata for grep-based retrieval. The primary retrieval surface of the LLM Realm.

**Source intake log** -- 03_logs/source_intake_log.md. Register of new Root Vault batches and retained external sources.

**Structured research need** -- A translated version of the researcher's raw question, filed in 03_logs/structured_research_needs/ with evidence requirements and hypotheses.

**Tendency** -- A recurring research direction detected across request logs and structured needs. It can trigger a re-index or maintenance pass.

**Writing Space** -- 02_user_realm/writing/. The researcher's private drafts and arguments. Read-only for all agents.

**`.trash`** -- Directory for retired files. Moved here instead of deleted. Hidden but present in the repo. Never delete files — archive them to `.trash/`.
