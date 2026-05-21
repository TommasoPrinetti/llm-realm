#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// ── ANSI colors (zero-dependency) ────────────────────────────────────────────
const noColor = process.argv.includes("--no-color") || process.env.NO_COLOR;
const a = (code) => noColor ? "" : `\x1b[${code}m`;

const c = {
  reset:    a(0),
  bold:     a(1),
  dim:      a(2),
  italic:   a(3),
  underline:a(4),
  invert:   a(7),
  hidden:   a(8),
  // regular
  cyan:     a(36),
  green:    a(32),
  yellow:   a(33),
  red:      a(31),
  magenta:  a(35),
  blue:     a(34),
  white:    a(37),
  gray:     a(90),
  // bright
  bCyan:    a(96),
  bGreen:   a(92),
  bYellow:  a(93),
  bRed:     a(91),
  bMagenta: a(95),
  bBlue:    a(94),
  // bg
  bgCyan:   a(46),
  bgGreen:  a(42),
  bgYellow: a(43),
  bgRed:    a(41),
  bgMagenta:a(45),
  bgBlue:   a(44),
};

// ── helpers ──────────────────────────────────────────────────────────────────
const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const W = process.stdout.columns || 80;

const paths = {
  blueprint: resolve(root, "02_user_realm/RESEARCH_BLUEPRINT.md"),
  config:    resolve(root, "00_system/REALM_CONFIGURATION.md"),
  omen:      resolve(root, "01_llm_realm/06_research_tendencies/MASTER_OMEN.md"),
  omenTemplate: resolve(root, "01_llm_realm/06_research_tendencies/MASTER_OMEN_TEMPLATE.md"),
};

const cliLaunch = {
  "Claude Code": { command: "claude",   prompt: "Read AGENTS.md and continue onboarding." },
  Codex:         { command: "codex",    prompt: "Read AGENTS.md and continue onboarding." },
  OpenCode:      { command: "opencode", prompt: "Read AGENTS.md and continue onboarding." },
  Kilo:          { command: null, prompt: "Open this folder in Kilo, then ask: Read AGENTS.md and continue onboarding." },
  Other:         { command: null, prompt: "Open this folder with your LLM agent, then ask: Read AGENTS.md and continue onboarding." },
};

// ── display helpers ──────────────────────────────────────────────────────────
function fmt(template, ...args) { return noColor ? String.raw(template, ...args) : String.raw(template, ...args); }

function divider(char = "─") {
  output.write(c.dim + char.repeat(W - 1) + c.reset + "\n");
}

function step(num, total, title) {
  output.write("\n" + c.dim + "┌" + "─".repeat(W - 2) + "┐\n" + c.reset);
  output.write(c.dim + "│ " + c.reset + `${c.bold}${c.bCyan}Step ${num}/${total}${c.reset}` + c.dim + " · " + c.reset + `${c.bold}${title}${c.reset}` + "\n");
  output.write(c.dim + "└" + "─".repeat(W - 2) + "┘" + c.reset + "\n\n");
}

function label(text) {
  return `${c.bold}${text}${c.reset}`;
}

function hint(text) {
  return ` ${c.dim}${text}${c.reset}`;
}

function ok(text) {
  return `${c.green}${c.bold}✔${c.reset} ${text}`;
}

function info(text) {
  return `${c.bCyan}${c.bold}ℹ${c.reset} ${c.dim}${text}${c.reset}`;
}

function warn(text) {
  return `${c.yellow}${c.bold}⚠${c.reset} ${text}`;
}

// ── ensureParent ─────────────────────────────────────────────────────────────
function ensureParent(file) {
  mkdirSync(dirname(file), { recursive: true });
}

// ── splitList ─────────────────────────────────────────────────────────────────
function splitList(value) {
  return value.split(/[,;\n]/).map(i => i.trim()).filter(Boolean);
}

// ── yamlList ──────────────────────────────────────────────────────────────────
function yamlList(items, fallback = "[not specified]") {
  const list = items.length ? items : [fallback];
  return list.map(i => `- ${i}`).join("\n");
}

// ── hasFilledOnboarding ──────────────────────────────────────────────────────
function hasFilledOnboarding() {
  if (!existsSync(paths.blueprint) || !existsSync(paths.config)) return false;
  const b = readFileSync(paths.blueprint, "utf8");
  const cfg = readFileSync(paths.config, "utf8");
  const ph = ["[project name]", "[path]", "[question 1]", "to refine during LLM onboarding"];
  return !ph.some(p => b.includes(p) || cfg.includes(p));
}

// ── ask / choose ─────────────────────────────────────────────────────────────
async function ask(rl, text, fallback = "") {
  const prompt = label(text) + (fallback ? c.dim + ` (${fallback})` + c.reset : "") + c.dim + ": " + c.reset;
  const answer = (await rl.question(prompt)).trim();
  return answer || fallback;
}

async function choose(rl, text, choices, fallback) {
  output.write("\n" + label(text) + "\n");
  const defIdx = choices.indexOf(fallback);
  choices.forEach((choice, i) => {
    const prefix = i === defIdx ? c.bCyan + "●" : c.dim + "○";
    const num = c.dim + ` ${i + 1}. ` + c.reset;
    const name = i === defIdx ? c.bold + c.bCyan + choice + c.reset : choice;
    const tag = i === defIdx ? c.dim + " (default)" + c.reset : "";
    output.write(`  ${prefix}${num}${name}${tag}\n`);
  });
  const raw = await ask(rl, "Enter number", String(defIdx + 1));
  const idx = Number(raw) - 1;
  return choices[idx] || fallback;
}

// ── review screen ────────────────────────────────────────────────────────────
function review(data) {
  output.write("\n");
  divider("━");
  output.write(`\n  ${c.bold}${c.bMagenta}Review${c.reset}\n\n`);

  const rows = [
    ["Project",       data.projectTitle],
    ["Research object", data.researchObject],
    ["Scope",         data.scope],
    ["Questions",     data.questions.join(", ")],
    ["Root Vault",    data.rootVaultPath],
    ["Source types",  data.sourceTypes.join(", ")],
    ["Incoming",      data.incoming],
    ["External policy", data.externalPolicy],
    ["Preferred CLI", data.preferredCli],
    ["Outputs",       data.outputs.join(", ")],
    ["Preferences",   data.preferences],
  ];

  const pad = Math.max(...rows.map(r => r[0].length)) + 2;
  for (const [key, val] of rows) {
    const k = c.dim + key.padEnd(pad) + c.reset;
    const v = val && val !== "to refine during LLM onboarding"
      ? val
      : c.dim + val + c.reset;
    output.write(`  ${k}${v}\n`);
  }
  output.write("\n");
  divider("━");
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  // clear screen
  if (!noColor) output.write("\x1b[2J\x1b[H");

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    output.write(`\n  ${c.bold}llm-realm onboard${c.reset}\n\n`);
    output.write(`  ${c.dim}Usage:${c.reset} npm run llm-onboard [--force] [--no-color]\n`);
    output.write(`  ${c.dim}       ${c.reset} node bin/onboard.mjs [--force] [--no-color]\n\n`);
    output.write(`  ${c.dim}Flags:${c.reset}\n`);
    output.write(`    --force     Overwrite existing onboarding data\n`);
    output.write(`    --no-color  Disable colored output\n\n`);
    return;
  }

  // ── title ──────────────────────────────────────────────────────────────────
  const title = `
${c.bCyan}██╗  ██╗      ██╗     ██╗     ███╗   ███╗    ██████╗ ███████╗███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗
██║  ██║      ██║     ██║     ████╗ ████║    ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║
███████║█████╗██║     ██║     ██╔████╔██║    ██████╔╝█████╗  ███████╗█████╗  ███████║██████╔╝██║     ███████║
██╔══██║╚════╝██║     ██║     ██║╚██╔╝██║    ██╔══██╗██╔══╝  ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║
██║  ██║      ███████╗███████╗██║ ╚═╝ ██║    ██║  ██║███████╗███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║
╚═╝  ╚═╝      ╚══════╝╚══════╝╚═╝     ╚═╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝${c.reset}
  ${c.dim}LLM Researcher · Realm Onboarding${c.reset}
`;
  output.write(title);
  output.write(`\n  ${c.dim}A guided setup for your research project. The LLM will refine the results later.${c.reset}\n`);

  // ── readline ───────────────────────────────────────────────────────────────
  const rl = readline.createInterface({ input, output, terminal: !noColor });

  // ── overwrite check ───────────────────────────────────────────────────────
  if (hasFilledOnboarding() && !process.argv.includes("--force")) {
    output.write("\n" + warn("Existing onboarding data found.\n"));
    const overwrite = (await ask(rl, "Overwrite?", "no")).toLowerCase();
    if (!["y", "yes"].includes(overwrite)) {
      output.write("\n  " + info("No changes made. Use --force to overwrite.\n"));
      await rl.close();
      return;
    }
    output.write("\n");
  }

  // ── Step 1 ────────────────────────────────────────────────────────────────
  step(1, 5, "Project Identity");
  output.write(info("Defines what your research is about. Press Enter to accept defaults.\n\n"));

  const projectTitle    = await ask(rl, "Project name");
  const researchObject  = await ask(rl, "Research object");
  const scope           = await ask(rl, "Scope (period / place / cases)", "to refine during LLM onboarding");
  const questions       = splitList(await ask(rl, "Current questions (comma-separated)", "to refine during LLM onboarding"));

  // ── Step 2 ────────────────────────────────────────────────────────────────
  step(2, 5, "Sources");
  output.write(info("Where your research material lives and what types you work with.\n\n"));

  const rootVaultPath   = await ask(rl, "Root Vault path (absolute path to source files)");
  const sourceTypes     = splitList(await ask(rl, "Main source types (comma-separated)", "documents, notes"));
  const incoming        = await ask(rl, "Expected incoming sources", "to refine during LLM onboarding");

  // ── Step 3 ────────────────────────────────────────────────────────────────
  step(3, 5, "External Source Policy");
  output.write(info("Controls whether the LLM agent may fetch external (web) sources.\n\n"));

  const externalPolicy = await choose(
    rl,
    "External source policy",
    ["explicit_request_only", "closed", "logged_monitoring_allowed"],
    "explicit_request_only",
  );

  // ── Step 4 ────────────────────────────────────────────────────────────────
  step(4, 5, "LLM Tooling");
  output.write(info("Which CLI agent you use for research sessions.\n\n"));

  const preferredCli = await choose(
    rl,
    "Preferred LLM CLI",
    ["Claude Code", "Codex", "OpenCode", "Kilo", "Other"],
    "Codex",
  );

  // ── Step 5 ────────────────────────────────────────────────────────────────
  step(5, 5, "Outputs & Preferences");
  output.write(info("What you expect to produce and any style constraints.\n\n"));

  const outputs         = splitList(await ask(rl, "Expected outputs (comma-separated)", "evidence briefs, concept indexes, memos"));
  const preferences     = await ask(rl, "Researcher preferences / sensitivities", "to refine during LLM onboarding");

  // ── Review ─────────────────────────────────────────────────────────────────
  review({
    projectTitle, researchObject, scope, questions, rootVaultPath,
    sourceTypes, incoming, externalPolicy, preferredCli, outputs, preferences,
  });

  output.write("\n");
  const confirm = (await ask(rl, "Write these files?", "yes")).toLowerCase();
  if (!["y", "yes"].includes(confirm)) {
    output.write("\n  " + info("Cancelled. Nothing was written.\n\n"));
    await rl.close();
    return;
  }

  await rl.close();

  // ── write blueprint ───────────────────────────────────────────────────────
  const blueprint = `---
type: research_blueprint
agent: onboarding_cli
created: ${today}
updated: ${today}
onboarding_status: cli_started
---

# Research Blueprint

## Project
- Title: ${projectTitle || "[project name]"}
- Field: [to refine during LLM onboarding]
- Object: ${researchObject || "[what the project studies]"}
- Scope: ${scope}

## Questions
${yamlList(questions, "to refine during LLM onboarding")}

## Sources
- Root Vault path: ${rootVaultPath || "[path]"}
- Main source types: ${sourceTypes.join(", ") || "[source types]"}
- Expected incoming sources: ${incoming}

## Research Vocabulary
- Key actors / institutions / places: [to refine during LLM onboarding]
- Key concepts: [to refine during LLM onboarding]
- Sensitizing concepts, not evidence: [to refine during LLM onboarding]
- Theoretical frames, not forced labels: [to refine during LLM onboarding]

## Method And Evidence
- Methods: [to refine during LLM onboarding]
- Claims require source paths.
- L2 clues require back-search before reporting.
- External sources must stay labeled external unless moved into the Root Vault.
- External source policy: ${externalPolicy}

## Outputs
${yamlList(outputs, "to refine during LLM onboarding")}

## Blind Spots
- [to refine during LLM onboarding]

## Researcher Preferences
${preferences}

## Preferred LLM CLI
${preferredCli}
`;

  // ── write config ──────────────────────────────────────────────────────────
  const config = `---
type: realm_configuration
agent: onboarding_cli
created: ${today}
updated: ${today}
onboarding_status: cli_started
---

# Realm Configuration

Agents read this before major work.

\`\`\`yaml
realm_type: research_framework
research_mode: evolving_complex_corpus
root_vault_path: "${rootVaultPath || "[path]"}"
root_vault_mode: protected_append_only

source_policy: internal_first
external_sources_allowed: ${externalPolicy}
external_logs:
  - 03_logs/external_queries.md
  - 03_logs/source_intake_log.md

claim_standard: source_link_required
l2_policy: backsearch_required

protected_paths:
  - "${rootVaultPath || "[root_vault_path]"}"
  - 02_user_realm/writing/

archive_path: 01_llm_realm/archive/
stale_after_days: 30
archive_after_days: 60
preferred_llm_cli: "${preferredCli}"
\`\`\`

## Notes
- This file was initialized by the CLI onboarding.
- The LLM onboarding flow should refine any remaining placeholders.
- This file never grants permission to edit the Root Vault.
`;

  // ── write files ───────────────────────────────────────────────────────────
  ensureParent(paths.blueprint);
  ensureParent(paths.config);
  writeFileSync(paths.blueprint, blueprint);
  writeFileSync(paths.config, config);

  let omenCreated = false;
  if (!existsSync(paths.omen) && existsSync(paths.omenTemplate)) {
    const omen = readFileSync(paths.omenTemplate, "utf8")
      .replace("created: [date]", `created: ${today}`)
      .replace("updated: [date]", `updated: ${today}`);
    writeFileSync(paths.omen, omen);
    omenCreated = true;
  }

  // ── success output ────────────────────────────────────────────────────────
  output.write("\n");
  divider("━");
  output.write(`\n  ${c.bGreen}${c.bold}✦ Onboarding files written${c.reset}\n\n`);
  output.write(`  ${c.dim}─${c.reset} ${c.cyan}${paths.blueprint}${c.reset}\n`);
  output.write(`  ${c.dim}─${c.reset} ${c.cyan}${paths.config}${c.reset}\n`);
  if (omenCreated) {
    output.write(`  ${c.dim}─${c.reset} ${c.cyan}${paths.omen}${c.reset}\n`);
  }
  output.write("\n");

  const launch = cliLaunch[preferredCli] || cliLaunch.Other;
  output.write(`  ${c.bold}Next steps:${c.reset}\n\n`);
  if (launch.command) {
    output.write(`  1. ${c.bold}Run${c.reset} ${c.bGreen}\`${launch.command}\`${c.reset} from this folder.\n`);
    output.write(`  2. ${c.bold}Say:${c.reset} ${c.bGreen}${launch.prompt}${c.reset}\n`);
  } else {
    output.write(`  ${c.bGreen}${launch.prompt}${c.reset}\n`);
  }
  output.write("\n");
  divider("━");
  output.write("\n");
}

main().catch((error) => {
  output.write(c.red + c.bold + "\n  Error: " + c.reset + error.message + "\n");
  process.exitCode = 1;
});
