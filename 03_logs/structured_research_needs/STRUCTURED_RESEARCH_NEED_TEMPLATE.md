---
type: structured_research_need_template
role: search_decomposition_template
purpose: [show the shape of a reusable search plan entry]
scope: [conceptualizer output]
connects_to:
  - 03_logs/user_requests.md
  - 03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR.md
  - 00_system/sub_agents/conceptualizer/SOUL.md
created: 2026-05-26
updated: 2026-05-27
---

# Structured Research Need Template

*Conceptualizer fills one entry when a user request needs reusable search decomposition.*

```yaml
original_question: [as asked by the researcher]
basic_question: [stripped to core]
research_need: [what evidence is needed]
necessary_evidence:
  - verbatim quotes
  - relevant source batches
  - source links
optional_evidence:
  - contradictions
  - adjacent metaphors
  - handwritten notes
  - researcher annotations
  - new incoming sources
related_hypothesis: [what this may support]
action_for_agents:
  - search Realm indexes for [concept]
  - inspect Root Vault or registered source files linked by those indexes
  - update [concept] thematic index with new fragments
  - check source_intake_log.md for recent relevant batches
```

