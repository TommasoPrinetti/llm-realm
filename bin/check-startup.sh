#!/usr/bin/env bash
set -euo pipefail

# ── ANSI colors (zero dependencies) ──────────────────────────────────────────
if [[ "${NO_COLOR:-}" == "1" ]] || [[ ! -t 1 ]]; then
  R="" G="" Y="" BOLD="" RESET=""
else
  R=$'\033[31m' G=$'\033[32m' Y=$'\033[33m' BOLD=$'\033[1m' RESET=$'\033[0m'
fi

ROOT="$(pwd)"
failures=()
warnings=()

# ── helpers ──────────────────────────────────────────────────────────────────
read_file() {
  local path="$ROOT/$1"
  if [[ ! -f "$path" ]]; then
    failures+=("Missing $1")
    echo ""
    return
  fi
  cat "$path"
}

# ── read required files ─────────────────────────────────────────────────────
required_files=(
  "AGENTS.md"
  "00_system/instructions/REALM_CONFIGURATION.md"
  "00_system/instructions/ONBOARDING.md"
  "00_system/templates/STARTUP_REPORT_TEMPLATE.md"
  "02_user_realm/RESEARCH_BLUEPRINT.md"
  "03_logs/research_tendencies/RESEARCH_NEED_AGGREGATOR.md"
)

for file in "${required_files[@]}"; do
  read_file "$file" > /dev/null
done

config="$(read_file "00_system/instructions/REALM_CONFIGURATION.md")"
blueprint="$(read_file "02_user_realm/RESEARCH_BLUEPRINT.md")"
startup_text="${config}
${blueprint}"

# ── check for leftover placeholders ─────────────────────────────────────────
for marker in "[path]" "[project name]" "[project description]"; do
  if [[ "$startup_text" == *"$marker"* ]]; then
    failures+=("Required placeholder remains: $marker")
  fi
done

# ── check setup_status ──────────────────────────────────────────────────────
if [[ "$startup_text" == *"setup_status: cli_started"* ]]; then
  failures+=("setup_status is still cli_started; run the Realm startup agent.")
fi

if [[ "$startup_text" != *"setup_status: realm_started"* ]]; then
  warnings+=("setup_status: realm_started was not found.")
fi

# ── check for fast-setup markers ────────────────────────────────────────────
if echo "$startup_text" | grep -qE "To be discovered|Not specified during fast setup"; then
  warnings+=("Some fast-setup markers remain in blueprint/config.")
fi

# ── check root vault path ───────────────────────────────────────────────────
root_vault_path="$(echo "$config" | sed -n 's/.*root_vault_path: *["'\'']*\([^"'\'']*\)["'\'']*.*/\1/p' | head -1)"

if [[ -z "$root_vault_path" || "$root_vault_path" == "[path]" ]]; then
  failures+=("root_vault_path is missing or still a placeholder.")
else
  # check both relative and absolute
  if [[ ! -d "$root_vault_path" && ! -d "$ROOT/$root_vault_path" ]]; then
    failures+=("Root Vault path does not exist: $root_vault_path")
  else
    local_path="$root_vault_path"
    [[ ! -d "$local_path" ]] && local_path="$ROOT/$root_vault_path"
    if [[ ! -d "$local_path" ]]; then
      warnings+=("Root Vault path is not a directory: $root_vault_path")
    fi
  fi
fi

# ── check external policy ───────────────────────────────────────────────────
if ! echo "$config" | grep -qE "external_sources_allowed: *(yes|no)"; then
  failures+=("external_sources_allowed is missing or invalid.")
fi

# ── output ───────────────────────────────────────────────────────────────────
if [[ ${#failures[@]} -gt 0 ]]; then
  printf '%s\n' "${BOLD}${R}Startup check failed:${RESET}"
  for f in "${failures[@]}"; do
    printf '  %s %s\n' "${R}✗${RESET}" "$f"
  done
  if [[ ${#warnings[@]} -gt 0 ]]; then
    printf '\n%s\n' "${BOLD}${Y}Warnings:${RESET}"
    for w in "${warnings[@]}"; do
      printf '  %s %s\n' "${Y}⚠${RESET}" "$w"
    done
  fi
  exit 1
fi

printf '%s\n' "${G}${BOLD}Startup check passed.${RESET}"
if [[ ${#warnings[@]} -gt 0 ]]; then
  printf '\n%s\n' "${BOLD}${Y}Warnings:${RESET}"
  for w in "${warnings[@]}"; do
    printf '  %s %s\n' "${Y}⚠${RESET}" "$w"
  done
fi
