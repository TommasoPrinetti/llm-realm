# Glossary

**Agent** — One of four AI roles that maintain the Realm: Cicero, Varro, Lucrezio, Tacito. Each has a constrained domain and skill file.

**Back-search** — Returning to the Root Vault or registered source to read the full context of a fragment before reporting it as evidence. Mandatory for L2 clues.

**Blueprint** — Short for `02_user_realm/RESEARCH_BLUEPRINT.md`. Defines the research project scope, questions, corpus, evidence standards, and direction. Orients all agent activity.

**Internal-first source policy** — The rule that agents must not search external sources (web, APIs, general knowledge) unless the researcher explicitly requests it or the Realm configuration allows logged external intake.

**Concept index** — A thematic collection of evidence fragments grouped under one concept (e.g., "speed vs. quality"). Lives in `01_llm_realm/03_concept_indexes/`.

**Evidence fragment** — A verbatim quote, source claim, observation, data point, or precise paraphrase from the Root Vault or registered source, stored with source path, context, tags, and confidence.

**Evidence level** — L1 (direct, high confidence, explicitly answers the question) or L2 (serendipitous, adjacent, needs back-search).

**Evidence type** — Whether a claim is: primary (direct source material), processed (summary/cluster), interpretive (hypothesis/pattern), or external (logged outside source).

**Guilty knowledge** (Hughes, 1984) — Forms of knowing and doing that appear unserious, embarrassing, unethical, or dangerous to outsiders. A key theoretical frame for understanding concealment of AI use.

**L1 / L2** — See *Evidence level*.

**Mailbox** — `04_mailbox/inbox.md`. Where Tacito writes leads, warnings, contradictions, and serendipitous clues for the researcher.

**Master Omen** — `01_llm_realm/06_research_tendencies/MASTER_OMEN.md`. Lucrezio's aggregation of all research needs, used to detect recurring patterns.

**Moral division of labour** (Hughes) — The process by which professions collectively manage guilty knowledge through occupational norms, specialised vocabularies, and tacit coordination.

**`.now`** — The convention that every file records `created: [date]` at creation and `updated: [date]` on every edit. Enables Varro's cleanup cycle.

**Realm** — Short for LLM Realm. The writable, indexed, conceptually navigable map of the Root Vault.

**Realm Configuration** — `00_system/REALM_CONFIGURATION.md`. The operating profile for the project: source policy, Root Vault path, evidence standards, enabled workflows, and agent sequence.

**Re-index** — A Cicero pass triggered by Lucrezio when a tendency reaches count ≥ 3. The Realm reorganises around the detected pattern.

**Root Vault** — The protected source collection. Never modified by agents. All fragments link back to it or to a registered source.

**Shadow AI** — The use of personal AI accounts for professional work, driven underground by organisational policies that forbid official AI use.

**Skill** — An agent skill file (e.g., `00_system/skills/CICERO_SKILL.md`) that constrains an agent's actions, tools, and workflows.

**Structured research need** — A translated version of the researcher's raw question, filed in `03_logs/structured_research_needs/` with evidence requirements and hypotheses.

**Source intake log** — `03_logs/source_intake_log.md`. Register of new Root Vault batches and retained external sources.

**Source map** — A Cicero-produced map of a Root Vault folder, source batch, or coherent source collection. Lives in `01_llm_realm/02_source_maps/`.

**Tendency** — A recurring research direction detected by Lucrezio when a question type appears ≥ 3 times. Triggers a re-index signal to Cicero.

**Writing Space** — `02_user_realm/writing/`. The researcher's private drafts and arguments. Read-only for all agents.
