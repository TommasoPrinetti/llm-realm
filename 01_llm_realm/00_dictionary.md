---
type: dictionary
role: shared_vocabulary
purpose: [ensure coherent terminology across source copy headers]
scope: [all source copies in 01_llm_realm/sources/]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Master Dictionary

The dictionary is built during startup by reading all text-based source files. It ensures that every source copy header uses the same canonical terms. The orchestrator agent consults this file when generating or updating YAML headers.

**Multilingual rule:** Keywords appear in the language they were found in. If a source is in French, French keywords are recorded. If a concept appears in multiple languages, list all language variants as aliases so grep finds any form.

## Canonical Names

Standard form for people, roles, or named entities. Aliases map to one canonical name.

| Canonical form | Language | Aliases | Source files |
|---|---|---|---|
| — | — | — | — |

## Canonical Places

Standard form for geographic locations, sites, or regions.

| Canonical form | Language | Aliases | Source files |
|---|---|---|---|
| — | — | — | — |

## Canonical Organizations

Standard form for institutions, groups, or agencies.

| Canonical form | Language | Aliases | Source files |
|---|---|---|---|
| — | — | — | — |

## Canonical Concepts

Standard form for domain-specific concepts, theories, or frameworks. These map to concept index entries.

| Canonical form | Language | Aliases | Source files |
|---|---|---|---|
| — | — | — | — |

## Domain Terms

Specialized vocabulary, acronyms, or jargon used in the sources.

| Term | Language | Definition | Source files |
|---|---|---|---|
| — | — | — | — |

## Update Procedure

1. During startup, read every text-based source file
2. Extract names, places, organizations, concepts, and domain terms
3. Record the language of each term
4. Deduplicate: merge variants into canonical forms
5. Add aliases in all detected languages so that grep finds any variant
6. Record which source files use each term
7. When new sources are added, update the dictionary before generating headers
