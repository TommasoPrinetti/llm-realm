---
type: constraints
role: markdown_formatting_rules
purpose: [define Obsidian-compatible markdown rules for all agent-written reports]
scope: [05_agent_reports/, 01_llm_realm/]
connects_to:
  - AGENTS.md
  - 00_system/sub_agents/packer/SOUL.md
created: 2026-05-28
updated: 2026-05-28
---

# Obsidian Markdown Constraints

All reports and agent-written files in `05_agent_reports/` and `01_llm_realm/` must use **Obsidian-compatible markdown**. This ensures the LLM Realm can be opened and navigated as an Obsidian vault.

## Allowed Features

### Structure
- **YAML frontmatter** (required for all files)
- Headings (`#`, `##`, `###`)
- Tables (GFM syntax)
- Horizontal rules (`---`)

### Text Formatting
- **Bold** (`**text**`)
- *Italic* (`*text*`)
- ~~Strikethrough~~ (`~~text~~`)
- ==Highlights== (`==text==`)
- `Inline code` (`` `code` ``)
- Code blocks (triple backticks with language)

### Links
- **Wikilinks** to other notes: `[[Note Name]]`
- Wikilinks with display text: `[[Note Name|display text]]`
- Standard markdown links for external URLs: `[text](url)`

### Lists
- Bullet lists (`- item`)
- Numbered lists (`1. item`)
- Task lists (`- [ ]` unchecked, `- [x]` checked)

### Blockquotes
- Standard blockquotes (`> text`)
- Multi-paragraph blockquotes

### Embeds
- Note embeds: `![[Note Name]]`
- Section embeds: `![[Note Name#Heading]]`

## Disallowed Features

| Feature | Syntax | Why |
|---|---|---|
| Binary embeds | `![[image.png]]` | Breaks portability, large files |
| Block references | `^block-id` | Fragile, tool-dependent |
| Custom CSS classes | `cssclasses` | Not portable |
| Obsidian-only callout types | `> [!bug]`, `> [!success]` | Use only GitHub-compatible types |
| HTML elements | `<div>`, `<span>` | Obsidian does not render markdown inside HTML |

## Allowed Callout Types

Use only callout types that render on **both Obsidian and GitHub**:

```markdown
> [!note] Title
> Content

> [!tip] Title
> Content

> [!warning] Title
> Content

> [!info] Title
> Content

> [!quote] Title
> Content

> [!example] Title
> Content
```

Foldable callouts (Obsidian-only, but harmless on GitHub):
```markdown
> [!note]- Folded title
> Content hidden by default
```

## Verbatim Quote Format

When featuring direct quotes from sources, **always** use:

```markdown
> **Author Name**, *Source Title* (Date, Place)
>
> "Text with **the important part in bold** and enough context to understand the quote without opening the source."
```

## Frontmatter Schema

Every agent-written file must start with **YAML frontmatter**:

```yaml
---
type: [report | source_copy | concept_index | dictionary | ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: [draft | verified | partial]
---
```

Additional fields as needed by file type (see `HEADER_TEMPLATE.md`).

## Linking Conventions

- Link to source copies using **wikilinks**: `[[source_copy_name]]`
- Link to concept indexes: `[[Concept Name]]`
- Link to dictionary entries: `[[00_dictionary]]`
- External URLs use standard markdown links
- **Never** use relative paths for internal links
