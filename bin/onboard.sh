#!/usr/bin/env bash
set -euo pipefail

# ── ANSI colors (zero dependencies) ──────────────────────────────────────────
if [[ "${NO_COLOR:-}" == "1" ]] || [[ ! -t 1 ]]; then
  R="" G="" B="" Y="" C="" M="" DIM="" BOLD="" RESET=""
else
  R=$'\033[31m' G=$'\033[32m' B=$'\033[34m' Y=$'\033[33m'
  C=$'\033[36m' M=$'\033[35m' DIM=$'\033[2m' BOLD=$'\033[1m' RESET=$'\033[0m'
fi

# ── helpers ──────────────────────────────────────────────────────────────────
ROOT="$(pwd)"
TODAY="$(date +%Y-%m-%d)"
FORCE="0"

Blueprint="$ROOT/02_user_realm/RESEARCH_BLUEPRINT.md"
Config="$ROOT/00_system/instructions/REALM_CONFIGURATION.md"
Agents="$ROOT/AGENTS.md"
Claude="$ROOT/CLAUDE.md"
Aggregator="$ROOT/03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR.md"
AggregatorTemplate="$ROOT/03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR_TEMPLATE.md"
SourcesDir="$ROOT/01_llm_realm/sources"

# text-based extensions to copy from Root Vault
TEXT_EXTENSIONS="md|txt|rtf|csv|json|yaml|yml|toml|xml|html|css|js|ts|py|rb|sh|log|ini|cfg|conf|tex|bib|org|adoc|rst|wiki|mediawiki|asciidoc|textile|dokuwiki|pmwiki|tiddlywiki|opml|outliner|workflowy|dynalist|logseq|roam|obsidian"

divider() { printf '%s\n' "${DIM}$(printf '%.0s─' 1 {1..78})${RESET}"; }
header() { printf '\n%s\n\n' "${BOLD}${C}$1${RESET}"; }
info()   { printf '  %s %s\n' "${DIM}→${RESET}" "$1"; }
ok()     { printf '  %s %s\n' "${G}✦${RESET}" "$1"; }
warn()   { printf '  %s %s\n' "${Y}⚠${RESET}" "$1"; }

ask() {
  local prompt="$1" default="${2:-}" hint="${3:-}"
  local fb=""
  [[ -n "$default" ]] && fb=" ${DIM}(${default})${RESET}"
  [[ -n "$hint" ]] && printf '  %s %s\n' "${DIM}↳${RESET}" "$hint" >&2
  printf '%s' "${BOLD}${prompt}${RESET}${fb}${DIM}: ${RESET}" >&2
  local reply
  IFS= read -r reply || true
  reply="${reply:-$default}"
  echo "$reply"
}

ask_multiline() {
  local prompt="$1" hint="${2:-}"
  printf '%s\n' "${BOLD}${prompt}${RESET}" >&2
  [[ -n "$hint" ]] && printf '  %s %s\n' "${DIM}↳${RESET}" "${hint}" >&2
  printf '  %s\n' "${DIM}↳ Type your answer. Press Enter on an empty line when done.${RESET}" >&2
  local lines="" line=""
  while true; do
    IFS= read -r line || break
    [[ -z "$line" ]] && break
    [[ -n "$lines" ]] && lines="${lines}
${line}" || lines="$line"
  done
  echo "$lines"
}

select_menu() {
  local prompt="$1"
  shift
  local options=("$@")

  printf '%s\n' "${BOLD}${prompt}${RESET}" >&2
  for i in "${!options[@]}"; do
    printf '  %s %s\n' "${DIM}$((i+1)).${RESET}" "${options[$i]}" >&2
  done

  local choice
  while true; do
    printf '%s' "${DIM}  Enter number [1-${#options[@]}]: ${RESET}" >&2
    IFS= read -r choice || choice="1"
    if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#options[@]} )); then
      echo "${options[$((choice-1))]}"
      return
    fi
    printf '  %s\n' "${R}Invalid choice. Try again.${RESET}" >&2
  done
}

confirm() {
  local prompt="$1" default="${2:-y}"
  local hint="Y/n"
  [[ "$default" == "n" ]] && hint="y/N"
  printf '%s' "${BOLD}${prompt}${RESET} ${DIM}${hint}${RESET}: " >&2
  local reply
  IFS= read -r reply || reply="$default"
  reply="${reply:-$default}"
  case "$reply" in y|Y|yes|Yes|YES) return 0;; *) return 1;; esac
}

copy_to_clipboard() {
  local text="$1"
  if command -v pbcopy &>/dev/null; then
    printf '%s' "$text" | pbcopy
    return 0
  elif command -v xclip &>/dev/null; then
    printf '%s' "$text" | xclip -selection clipboard
    return 0
  elif command -v xsel &>/dev/null; then
    printf '%s' "$text" | xsel --clipboard --input
    return 0
  elif command -v clip.exe &>/dev/null; then
    printf '%s' "$text" | clip.exe
    return 0
  fi
  return 1
}

sanitize_yaml() { echo "$1" | tr '"' "'" | tr '\n' ' '; }

# ── ASCII loader ────────────────────────────────────────────────────────────
loader_pid=""

loader_start() {
  local msg="$1"
  local frames=("⠁" "⠈" "⠐" "⠠" "⢀" "⡀" "⠄" "⠐")
  (
    while true; do
      for f in "${frames[@]}"; do
        printf "\r  %s %s" "$f" "$msg" >&2
        sleep 0.1
      done
    done
  ) &
  loader_pid=$!
}

loader_stop() {
  [[ -n "$loader_pid" ]] && kill "$loader_pid" 2>/dev/null
  wait "$loader_pid" 2>/dev/null || true
  loader_pid=""
  printf "\r\033[2K" >&2
}

# ── copy root vault text files ──────────────────────────────────────────────
copy_root_vault() {
  local vault_path="$1"
  local dest_dir="$2"

  # count text files first
  local file_count=0
  while IFS= read -r -d '' f; do
    file_count=$((file_count + 1))
  done < <(find "$vault_path" -type f -regextype posix-extended -iregex ".*\.(${TEXT_EXTENSIONS})" -not -name '.DS_Store' -not -path '*/node_modules/*' -not -path '*/.git/*' -print0 2>/dev/null)

  if [[ "$file_count" -eq 0 ]]; then
    warn "No text-based files found in Root Vault."
    return 1
  fi

  loader_start "Cloning $file_count text files from Root Vault..."

  local copied=0 skipped=0

  while IFS= read -r -d '' src_file; do
    # compute relative path from vault
    local rel_path="${src_file#"$vault_path"/}"
    local dest_file="$dest_dir/$rel_path"
    local dest_parent
    dest_parent="$(dirname "$dest_file")"

    mkdir -p "$dest_parent"

    if [[ -f "$dest_file" ]]; then
      skipped=$((skipped + 1))
      continue
    fi

    cp "$src_file" "$dest_file"
    copied=$((copied + 1))
  done < <(find "$vault_path" -type f -regextype posix-extended -iregex ".*\.(${TEXT_EXTENSIONS})" -not -name '.DS_Store' -not -path '*/node_modules/*' -not -path '*/.git/*' -print0 2>/dev/null | sort -z)

  loader_stop

  # count non-text files for the summary
  local binary_count=0
  while IFS= read -r -d '' f; do
    binary_count=$((binary_count + 1))
  done < <(find "$vault_path" -type f -not -regextype posix-extended -iregex ".*\.(${TEXT_EXTENSIONS})" -not -name '.DS_Store' -not -name '.gitkeep' -not -path '*/node_modules/*' -not -path '*/.git/*' -print0 2>/dev/null)

  printf '  %s %s\n' "${G}✦${RESET}" "${BOLD}Root vault cloned to${RESET} ${C}${dest_dir}${RESET}"
  printf '  %s %s\n' "${DIM}→${RESET}" "${copied} text files copied"
  [[ "$skipped" -gt 0 ]] && printf '  %s %s\n' "${DIM}→${RESET}" "${skipped} files skipped (already exist)"
  [[ "$binary_count" -gt 0 ]] && printf '  %s %s\n' "${DIM}→${RESET}" "${binary_count} non-text files (PDFs, images, etc.) left in original vault"
}

# ── overwrite check ─────────────────────────────────────────────────────────
has_filled_setup() {
  [[ -f "$Blueprint" && -f "$Config" ]] || return 1
  local b c
  b=$(<"$Blueprint")
  c=$(<"$Config")
  for ph in "[project name]" "[project description]" "[path]"; do
    [[ "$b" == *"$ph"* || "$c" == *"$ph"* ]] && return 1
  done
  return 0
}

# ── main ─────────────────────────────────────────────────────────────────────
main() {
  # parse flags
  for arg in "$@"; do
    case "$arg" in
      --force) FORCE="1" ;;
      --no-color) R="" G="" B="" Y="" C="" M="" DIM="" BOLD="" RESET="" ;;
      --help|-h)
        printf '\n  %s\n\n' "${BOLD}LLM Realm Setup${RESET}"
        printf '  %s\n\n' "${DIM}Usage:${RESET} bash bin/onboard.sh [--force] [--no-color]"
        printf '  %s\n\n' "${DIM}Flags:${RESET}"
        printf '    %-14s %s\n' "--force" "Overwrite existing setup data"
        printf '    %-14s %s\n' "--no-color" "Disable colored output"
        return 0
        ;;
    esac
  done

  # title
  printf '\n'
  divider
  printf '\n  %s  %s\n' "${BOLD}${C}LLM Realm${RESET}" "${DIM}Realm Setup${RESET}"
  printf '\n  %s\n' "${DIM}Quick setup — describe the project once; your LLM agent will start the Realm from this draft.${RESET}"
  divider

  if has_filled_setup && [[ "$FORCE" != "1" ]]; then
    printf '\n  %s Existing setup data found.\n' "${Y}${BOLD}⚠${RESET}"
    if ! confirm "  Overwrite?" "n"; then
      printf '\n  %s\n\n' "${DIM}No changes made. Use --force to overwrite.${RESET}"
      return 0
    fi
  fi

  # ── Step 1: Project Identity ───────────────────────────────────────────────
  header "Step 1/4 · Project Identity"
  project_title=""
  while [[ -z "$project_title" ]]; do
    project_title="$(ask "Project name" "" "e.g. My Research Project")"
    [[ -z "$project_title" ]] && printf '  %s\n' "${R}Project name is required.${RESET}" >&2
  done
  project_description=""
  while [[ -z "$project_description" ]]; do
    project_description="$(ask_multiline "Project description" "paste or type, empty line to finish")"
    [[ -z "$project_description" ]] && printf '  %s\n' "${R}Project description is required.${RESET}" >&2
  done
  project_artifacts_raw="$(ask "Helpful artifacts — URLs or file paths (comma-separated)" "none" "e.g. https://mysite.com, /Users/name/data.csv")"
  project_artifacts="$project_artifacts_raw"
  case "$project_artifacts" in none|None|NONE|"") project_artifacts="";; esac

  # ── Step 2: Root Vault ────────────────────────────────────────────────────
  header "Step 2/4 · Root Vault"
  info "Absolute path to your source files. The LLM will discover types and structure."
  root_vault_path=""
  while [[ -z "$root_vault_path" ]]; do
    root_vault_path="$(ask "Root Vault path (absolute)" "" "e.g. /Users/name/Documents/my-sources")"
    [[ -z "$root_vault_path" ]] && printf '  %s\n' "${R}Root Vault path is required.${RESET}" >&2
  done

  # validate root vault exists
  if [[ ! -d "$root_vault_path" ]]; then
    printf '\n  %s Root Vault path does not exist: %s\n\n' "${R}✗${RESET}" "$root_vault_path" >&2
    return 1
  fi

  # copy text-based files from root vault into repo
  printf '\n'
  copy_root_vault "$root_vault_path" "$SourcesDir"
  printf '\n'

  # ── Step 3: External policy ───────────────────────────────────────────────
  header "Step 3/4 · External Source Policy"
  external_policy="$(select_menu "May the LLM fetch external sources from the web?" "no" "yes")"

  if [[ "$external_policy" == "no" && -n "$project_artifacts" ]]; then
    printf '\n  %s Note: You listed URLs, but external access is disabled.\n' "${Y}⚠${RESET}"
    info "Agents will record those URLs but must not fetch them."
  fi

  # ── Step 4: CLI preference ────────────────────────────────────────────────
  header "Step 4/4 · LLM CLI"
  preferred_cli="$(select_menu "Preferred LLM CLI" "Claude Code" "Codex" "OpenCode" "Kilo" "Other")"

  # ── Review ─────────────────────────────────────────────────────────────────
  header "Review"
  printf '  %-18s %s\n' "${DIM}Project${RESET}" "$project_title"
  printf '  %-18s %s\n' "${DIM}Description${RESET}" "$(echo "$project_description" | head -1)"
  printf '  %-18s %s\n' "${DIM}Artifacts${RESET}" "${project_artifacts:-—}"
  printf '  %-18s %s\n' "${DIM}Root Vault${RESET}" "$root_vault_path"
  printf '  %-18s %s\n' "${DIM}Source copies${RESET}" "${C}${SourcesDir}${RESET}"
  printf '  %-18s %s\n' "${DIM}External policy${RESET}" "$external_policy"
  printf '  %-18s %s\n' "${DIM}Preferred CLI${RESET}" "$preferred_cli"
  divider

  if [[ "$FORCE" != "1" ]]; then
    if ! confirm "Write files?"; then
      printf '\n  %s\n\n' "${DIM}Cancelled. Nothing was written.${RESET}"
      return 0
    fi
  fi

  # ── ensure directories exist ──────────────────────────────────────────────
  mkdir -p "$(dirname "$Blueprint")"
  mkdir -p "$(dirname "$Config")"

  # ── write blueprint ───────────────────────────────────────────────────────
  cat > "$Blueprint" << BLUEPRINT_EOF
---
type: research_blueprint
agent: setup_cli
created: $TODAY
updated: $TODAY
setup_status: cli_started
connects_to:
  - AGENTS.md
  - 00_system/instructions/REALM_CONFIGURATION.md
  - 00_system/instructions/ONBOARDING.md
  - 03_logs/user_requests.md
---

# Research Blueprint

## Project
- Title: ${project_title:-[project name]}
- Description:
  $(echo "$project_description" | sed 's/^/  /')

## Project Artifacts
- ${project_artifacts:-No additional URLs or file paths provided during fast setup.}

## Sources
- Root Vault path: ${root_vault_path:-[path]}
- Main source types: To be discovered from the Root Vault.
- Expected incoming sources: Not specified during fast setup.

## Research Vocabulary
- Key actors / institutions / places: To be inferred from the project description, artifacts, and Root Vault.
- Key concepts: To be inferred from the project description, artifacts, and Root Vault.
- Sensitizing concepts, not evidence: None specified during fast setup.
- Theoretical frames, not forced labels: None specified during fast setup.

## Method And Evidence
- Methods: To be inferred from the project description and source collection.
- Claims require source paths.
- L2 clues require Checker verification before reporting.
- External sources must stay labeled external unless moved into the Root Vault.
- External source policy: $external_policy

## Outputs
- Start with source copies and evidence-grounded answers unless the researcher requests another output.

## Blind Spots
- To be discovered during mapping.

## Researcher Preferences
Use concise, source-grounded answers. Ask follow-up questions only when needed to avoid a risky assumption.

## Preferred LLM CLI
$preferred_cli
BLUEPRINT_EOF

  # ── write config ──────────────────────────────────────────────────────────
  local safe_vault
  safe_vault="$(sanitize_yaml "$root_vault_path")"

  cat > "$Config" << CONFIG_EOF
---
type: realm_configuration
agent: setup_cli
created: $TODAY
updated: $TODAY
setup_status: cli_started
---

# Realm Configuration

Agents read this before major work.

\`\`\`yaml
realm_type: research_framework
research_mode: evolving_complex_corpus
root_vault_path: "$safe_vault"
root_vault_mode: protected_append_only

source_policy: internal_first
external_sources_allowed: $external_policy
external_logs:
  - 03_logs/external_queries.md
  - 03_logs/source_intake_log.md

claim_standard: source_link_required
l2_policy: checker_required

protected_paths:
  - "$safe_vault"
  - 02_user_realm/writing/

archive_path: 01_llm_realm/archive/
stale_after_days: 30
archive_after_days: 60
preferred_llm_cli: "$preferred_cli"
\`\`\`

## Notes
- This file was initialized by the CLI setup.
- When an agent sees setup_status: cli_started, it should start the Realm from the setup draft, mark translated setup as setup_status: realm_started, and run initial indexing unless blocked.
- The startup agent must translate the setup draft, build the master dictionary, generate source copy headers, build concept indexes, and complete the full startup checklist.
- Source copies are created by the CLI during onboarding. The agent's job is to add YAML headers using the dictionary for consistent terminology.
- This file never grants permission to edit the Root Vault.
CONFIG_EOF

  # ── create aggregator if missing ──────────────────────────────────────────
  local agg_created="no"
  if [[ ! -f "$Aggregator" && -f "$AggregatorTemplate" ]]; then
    sed "s/created: \[date\]/created: $TODAY/; s/updated: \[date\]/updated: $TODAY/" \
      "$AggregatorTemplate" > "$Aggregator"
    agg_created="yes"
  fi

  # ── create CLAUDE.md if preferred CLI is Claude Code ──────────────────────
  local claude_created="no"
  if [[ "$preferred_cli" == "Claude Code" && -f "$Agents" ]]; then
    cp "$Agents" "$Claude"
    claude_created="yes"
  fi

  # ── success ───────────────────────────────────────────────────────────────
  printf '\n'
  divider
  printf '\n  %s\n\n' "${G}${BOLD}✦ Setup files written${RESET}"
  printf '  %s %s\n' "${DIM}─${RESET}" "${C}${Blueprint}${RESET}"
  printf '  %s %s\n' "${DIM}─${RESET}" "${C}${Config}${RESET}"
  [[ "$agg_created" == "yes" ]] && printf '  %s %s\n' "${DIM}─${RESET}" "${C}${Aggregator}${RESET}"
  [[ "$claude_created" == "yes" ]] && printf '  %s %s\n' "${DIM}─${RESET}" "${C}${Claude}${RESET}"

  printf '\n  %s\n\n' "${BOLD}Next:${RESET}"

  local startup_prompt="Execute 00_system/instructions/STARTUP.md then 00_system/instructions/ONBOARDING.md — the source copies are already in 01_llm_realm/sources/. Now: build the master dictionary by reading all copied files and extracting canonical names, places, organizations, and domain terms into 01_llm_realm/00_dictionary.md. Then generate YAML headers for every source copy using the dictionary for consistent terminology. Build concept indexes from repeated themes. Update 01_llm_realm/00_realm_index.md. Run the smoke test. Set setup_status to realm_started. Write the startup report at 05_agent_reports/ using the template at 00_system/templates/STARTUP_REPORT_TEMPLATE.md. Do not stop after reading files. Do not stop after one index. Do not re-ask questions the CLI draft already answered."

  if copy_to_clipboard "$startup_prompt"; then
    info "Prompt copied to clipboard."
  else
    info "Select and copy the prompt below."
  fi
  info "Open your LLM CLI on this folder and paste it:"
  printf '\n    %s%s%s\n\n' "${G}${BOLD}" "$startup_prompt" "${RESET}"
  divider
  printf '\n'
}

main "$@"
