---
type: research_need_aggregator
sub_agent: Conceptualizer
role: concept_pattern_log
purpose: [accumulate structured research needs and detect repeated prompt themes]
scope: [all non-trivial research prompts]
connects_to:
  - 03_logs/user_requests.md
  - 01_llm_realm/03_concept_indexes/
  - 00_system/sub_agents/conceptualizer/SOUL.md
created: 2026-05-26
updated: 2026-05-27
---

# Research Need Aggregator

## Purpose
This document aggregates all structured research needs chronologically. Conceptualizer reads this as a single corpus to detect emerging prompt and search patterns.

## Accumulated needs

| # | Date | Basic question | Type | Source question |
|---|---|---|---|---|

## Type classification
Each research need is classified into one or more of these types:
- *(add types as they emerge)*

## Repetition tracker
| Type | Count | First observed | Last observed | Tendency registered? |
|---|---|---|---|---|

*Conceptualizer updates this after each non-trivial request. When count reaches 3, register a tendency.*

## Update procedure
1. After translating a new question to a structured research need, append it to this table
2. Classify its type(s)
3. Increment the repetition counter for each type
4. If any type reaches 3, trigger tendency registration and consider a Navigator/Checker re-index pass.
