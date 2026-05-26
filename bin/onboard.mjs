#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// ── ANSI colors (zero-dependency) ────────────────────────────────────────────
const noColor = process.argv.includes("--no-color") || process.env.NO_COLOR;
const a = (code) => noColor ? "" : `\x1b[${code}m`;

const c = {
  reset:    a(0),  bold:    a(1),  dim:   a(2),
  cyan:     a(36), green:   a(32), yellow:a(33), red: a(31), magenta: a(35),
  gray:     a(90),
  bCyan:    a(96), bGreen:  a(92), bYellow:a(93), bRed: a(91), bMagenta: a(95),
};

// ── helpers ──────────────────────────────────────────────────────────────────
const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const W = process.stdout.columns || 80;
const isForce = process.argv.includes("--force");

const paths = {
  blueprint: resolve(root, "02_user_realm/RESEARCH_BLUEPRINT.md"),
  config:    resolve(root, "00_system/REALM_CONFIGURATION.md"),
  aggregator:      resolve(root, "01_llm_realm/06_research_tendencies/RESEARCH_NEED_AGGREGATOR.md"),
  aggregatorTemplate: resolve(root, "01_llm_realm/06_research_tendencies/RESEARCH_NEED_AGGREGATOR_TEMPLATE.md"),
};

const cliLaunch = {
  "Claude Code": { command: "claude",   prompt: "Read AGENTS.md and start the Realm." },
  Codex:         { command: "codex",    prompt: "Read AGENTS.md and start the Realm." },
  OpenCode:      { command: "opencode", prompt: "Read AGENTS.md and start the Realm." },
  Kilo:          { command: null, prompt: "Open this folder in Kilo, then ask: Read AGENTS.md and start the Realm." },
  Other:         { command: null, prompt: "Open this folder with your LLM agent, then ask: Read AGENTS.md and start the Realm." },
};

function sanitizeYaml(s) { return s.replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/```/g, "`\\`\\`"); }
function ensureParent(file) { mkdirSync(dirname(file), { recursive: true }); }
function splitList(v) { return v.split(/[,;\n]/).map(i => i.trim()).filter(Boolean); }
function yamlList(items, fb = "[not specified]") { return (items.length ? items : [fb]).map(i => `- ${i}`).join("\n"); }
function markdownContinuation(s) { return s.split("\n").map(line => `  ${line}`).join("\n"); }
function oneLine(s) { return s.replace(/\s+/g, " ").trim(); }

// ── display ──────────────────────────────────────────────────────────────────
function divider(ch = "─") { output.write(c.dim + ch.repeat(W - 1) + c.reset + "\n"); }
function bold(s) { return c.bold + s + c.reset; }
function dim(s)  { return c.dim + s + c.reset; }

function step(n, total, title) {
  output.write("\n" + dim("┌" + "─".repeat(W - 2) + "┐\n"));
  output.write(dim("│ ") + `${bold(c.bCyan + `Step ${n}/${total}`)}` + dim(" · ") + bold(title) + "\n");
  output.write(dim("└" + "─".repeat(W - 2) + "┘\n\n"));
}

// ── readline helpers ─────────────────────────────────────────────────────────
function createRL() {
  return readline.createInterface({ input, output, terminal: !noColor });
}

async function ask(rl, text, fallback = "") {
  const fb = fallback ? dim(` (${fallback})`) : "";
  const a = (await rl.question(bold(text) + fb + dim(": "))).trim();
  return a || fallback;
}

async function askPastedText(rl, text, fallback = "") {
  if (!input.isTTY) return ask(rl, text, fallback);

  output.write(bold(text) + dim(": "));

  return new Promise((resolve) => {
    let value = "";
    let inPaste = false;

    const cleanup = () => {
      output.write("\x1b[?2004l");
      if (input.isRaw) input.setRawMode(false);
      input.removeListener("data", onData);
    };

    const finish = () => {
      output.write("\n");
      cleanup();
      resolve(value.trim() || fallback);
    };

    const append = (chunk) => {
      value += chunk;
      output.write(chunk);
    };

    const onData = (buf) => {
      let s = buf.toString("utf8");

      while (s.length) {
        if (s.startsWith("\x1b[200~")) {
          inPaste = true;
          s = s.slice(6);
          continue;
        }

        if (s.startsWith("\x1b[201~")) {
          inPaste = false;
          s = s.slice(6);
          continue;
        }

        const ch = s[0];
        s = s.slice(1);

        if (ch === "\x03") {
          cleanup();
          process.exit(0);
        }

        if ((ch === "\r" || ch === "\n") && !inPaste) {
          finish();
          return;
        }

        if (ch === "\x7f" || ch === "\b") {
          if (value.length) {
            value = value.slice(0, -1);
            output.write("\b \b");
          }
          continue;
        }

        append(ch === "\r" ? "\n" : ch);
      }
    };

    output.write("\x1b[?2004h");
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}

// ── arrow-key selection (raw stdin, zero-dependency) ─────────────────────────
function select(text, choices, fallback, note = "") {
  // fallback to numbered list when stdin is not a TTY (piped, redirected)
  if (!input.isTTY) return selectNumbered(text, choices, fallback, note);

  return new Promise((resolve) => {
    let idx = choices.indexOf(fallback);
    if (idx === -1) idx = 0;
    const total = choices.length + (note ? 1 : 0) + 1;

    const render = () => {
      for (let i = 0; i < total; i++) output.write(`\x1b[A\x1b[2K`);
      output.write("\r" + bold(text) + "\n");
      if (note) output.write(dim("  " + note) + "\n");
      choices.forEach((ch, i) => {
        if (i === idx) output.write(`  ${c.bCyan}${c.bold}❯ ${ch}${c.reset}\n`);
        else output.write(`  ${dim("  " + ch)}\n`);
      });
    };

    const cleanup = () => {
      if (input.isRaw) { input.setRawMode(false); input.pause(); }
      input.removeListener("data", onData);
    };

    const onData = (buf) => {
      const k = buf.toString();
      if (k === "\x1b[A")      { idx = Math.max(0, idx - 1); render(); }
      else if (k === "\x1b[B") { idx = Math.min(choices.length - 1, idx + 1); render(); }
      else if (k === "\r" || k === "\n") { output.write("\n"); cleanup(); resolve(choices[idx]); }
      else if (k === "\x03") { cleanup(); process.exit(0); }
    };

    render();
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}

async function selectNumbered(text, choices, fallback, note = "") {
  // fallback: numbered list with readline (non-TTY environments)
  const rl = createRL();
  output.write("\n" + bold(text) + "\n");
  if (note) output.write(dim("  " + note) + "\n");
  const defIdx = choices.indexOf(fallback);
  choices.forEach((ch, i) => {
    const prefix = i === defIdx ? c.bCyan + "●" : dim("○");
    const num = dim(` ${i + 1}. `);
    const name = i === defIdx ? bold(c.bCyan + ch) : ch;
    const tag = i === defIdx ? dim(" (default)") : "";
    output.write(`  ${prefix}${num}${name}${tag}\n`);
  });
  const raw = await ask(rl, "Enter number", String(defIdx + 1));
  const idx = Number(raw) - 1;
  rl.close();
  return choices[idx] || fallback;
}

// ── hasFilledSetup ───────────────────────────────────────────────────────────
function hasFilledSetup() {
  if (!existsSync(paths.blueprint) || !existsSync(paths.config)) return false;
  const b = readFileSync(paths.blueprint, "utf8");
  const cfg = readFileSync(paths.config, "utf8");
  const ph = ["[project name]", "[project description]", "[path]"];
  return !ph.some(p => b.includes(p) || cfg.includes(p));
}

// ── review ───────────────────────────────────────────────────────────────────
function review(data) {
  output.write("\n");
  divider("━");
  output.write(`\n  ${bold(c.bMagenta + "Review")}\n\n`);
  const rows = [
    ["Project",        data.projectTitle],
    ["Description",    oneLine(data.projectDescription)],
    ["Artifacts",      data.projectArtifacts.join(", ")],
    ["Root Vault",     data.rootVaultPath],
    ["External policy", data.externalPolicy],
    ["Preferred CLI",  data.preferredCli],
  ];
  const pad = Math.max(...rows.map(r => r[0].length)) + 2;
  for (const [k, v] of rows) {
    const dk = dim(k.padEnd(pad));
    const dv = v ? v : dim("—");
    output.write(`  ${dk}${dv}\n`);
  }
  output.write("\n");
  divider("━");
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!noColor) output.write("\x1b[2J\x1b[H");

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    output.write(`\n  ${bold("llm-realm onboard")}\n\n`);
    output.write(`  ${dim("Usage:")} npm run llm-onboard [--force] [--no-color]\n`);
    output.write(`  ${dim("       ")} node bin/onboard.mjs [--force] [--no-color]\n\n`);
    output.write(`  ${dim("Flags:")}\n`);
    output.write(`    --force     Overwrite existing setup data\n`);
    output.write(`    --no-color  Disable colored output\n\n`);
    return;
  }

  // ── title ──────────────────────────────────────────────────────────────────
  output.write(`
${c.bCyan}██╗  ██╗      ██╗     ██╗     ███╗   ███╗    ██████╗ ███████╗███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗
██║  ██║      ██║     ██║     ████╗ ████║    ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║
███████║█████╗██║     ██║     ██╔████╔██║    ██████╔╝█████╗  ███████╗█████╗  ███████║██████╔╝██║     ███████║
██╔══██║╚════╝██║     ██║     ██║╚██╔╝██║    ██╔══██╗██╔══╝  ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║
██║  ██║      ███████╗███████╗██║ ╚═╝ ██║    ██║  ██║███████╗███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║
╚═╝  ╚═╝      ╚══════╝╚══════╝╚═╝     ╚═╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝${c.reset}
  ${dim("LLM Researcher · Realm Setup")}
`);
  output.write(`\n  ${dim("Quick setup — describe the project once; your LLM agent will start the Realm from this draft.")}\n`);

  // ── overwrite check ───────────────────────────────────────────────────────
  let rl = createRL();
  if (hasFilledSetup() && !isForce) {
    output.write("\n" + c.yellow + c.bold + "⚠" + c.reset + " Existing setup data found.\n");
    const o = (await ask(rl, "Overwrite?", "no")).toLowerCase();
    if (!["y", "yes"].includes(o)) {
      output.write("\n  " + dim("No changes made. Use --force to overwrite.\n\n"));
      rl.close();
      return;
    }
    output.write("\n");
  }

  // ── Step 1: Project ───────────────────────────────────────────────────────
  step(1, 4, "Project Identity");
  const projectTitle   = await ask(rl, "Project name");
  const projectDescription = await askPastedText(rl, "Project description");
  const projectArtifacts = splitList(await ask(
    rl,
    "Helpful artifacts — URLs or file paths (comma-separated)",
    "none"
  )).filter(item => item.toLowerCase() !== "none");

  // ── Step 2: Root Vault ────────────────────────────────────────────────────
  step(2, 4, "Root Vault");
  output.write(dim("Absolute path to your source files. The LLM will discover types and structure.\n\n"));
  const rootVaultPath  = await ask(rl, "Root Vault path (absolute)");

  // ── Step 3: External policy (arrow keys) ───────────────────────────────────
  step(3, 4, "External Source Policy");
  rl.close();
  const externalPolicy = await select(
    "May the LLM fetch external sources from the web?",
    ["explicit_request_only", "closed", "logged_monitoring_allowed"],
    "explicit_request_only",
  );
  rl = createRL();

  // ── Step 4: CLI (arrow keys + note) ───────────────────────────────────────
  step(4, 4, "LLM CLI");
  rl.close();
  const preferredCli = await select(
    "Preferred LLM CLI",
    ["Claude Code", "Codex", "OpenCode", "Kilo", "Other"],
    "Codex",
    "This will be used to open the CLI tool after setup.",
  );
  rl = createRL();

  // ── Review ─────────────────────────────────────────────────────────────────
  review({ projectTitle, projectDescription, projectArtifacts, rootVaultPath, externalPolicy, preferredCli });

  // ── Confirm (Y/n style) ───────────────────────────────────────────────────
  if (!isForce) {
    const yn = (await ask(rl, "Write files?  " + dim("Y") + dim("/n"), "y")).toLowerCase();
    if (!["y", "yes"].includes(yn)) {
      output.write("\n  " + dim("Cancelled. Nothing was written.") + "\n\n");
      rl.close();
      return;
    }
  }
  rl.close();

  // ── write blueprint ───────────────────────────────────────────────────────
  const blueprint = `---
type: research_blueprint
agent: setup_cli
created: ${today}
updated: ${today}
setup_status: cli_started
---

# Research Blueprint

## Project
- Title: ${projectTitle || "[project name]"}
- Description:
${markdownContinuation(projectDescription || "[project description]")}

## Project Artifacts
${yamlList(projectArtifacts, "No additional URLs or file paths provided during fast setup.")}

## Sources
- Root Vault path: ${rootVaultPath || "[path]"}
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
- L2 clues require back-search before reporting.
- External sources must stay labeled external unless moved into the Root Vault.
- External source policy: ${externalPolicy}

## Outputs
- Start with source maps and evidence-grounded answers unless the researcher requests another output.

## Blind Spots
- To be discovered during mapping.

## Researcher Preferences
Use concise, source-grounded answers. Ask follow-up questions only when needed to avoid a risky assumption.

## Preferred LLM CLI
${preferredCli}
`;

  // ── write config ──────────────────────────────────────────────────────────
  const config = `---
type: realm_configuration
agent: setup_cli
created: ${today}
updated: ${today}
setup_status: cli_started
---

# Realm Configuration

Agents read this before major work.

\`\`\`yaml
realm_type: research_framework
research_mode: evolving_complex_corpus
root_vault_path: "${sanitizeYaml(rootVaultPath || "[path]")}"
root_vault_mode: protected_append_only

source_policy: internal_first
external_sources_allowed: ${externalPolicy}
external_logs:
  - 03_logs/external_queries.md
  - 03_logs/source_intake_log.md

claim_standard: source_link_required
l2_policy: backsearch_required

protected_paths:
  - "${sanitizeYaml(rootVaultPath || "[root_vault_path]")}"
  - 02_user_realm/writing/

archive_path: 01_llm_realm/archive/
stale_after_days: 30
archive_after_days: 60
preferred_llm_cli: "${preferredCli}"
\`\`\`

## Notes
- This file was initialized by the CLI setup.
- The Realm startup flow should avoid asking for scope, object, questions, methods, or outputs unless the researcher requests that detail or the missing answer blocks immediate mapping.
- This file never grants permission to edit the Root Vault.
`;

  // ── write files ───────────────────────────────────────────────────────────
  ensureParent(paths.blueprint);
  ensureParent(paths.config);
  writeFileSync(paths.blueprint, blueprint);
  writeFileSync(paths.config, config);

  let aggCreated = false;
  if (!existsSync(paths.aggregator) && existsSync(paths.aggregatorTemplate)) {
    const agg = readFileSync(paths.aggregatorTemplate, "utf8")
      .replace("created: [date]", `created: ${today}`)
      .replace("updated: [date]", `updated: ${today}`);
    writeFileSync(paths.aggregator, agg);
    aggCreated = true;
  }

  // ── success ───────────────────────────────────────────────────────────────
  output.write("\n");
  divider("━");
  output.write(`\n  ${c.bGreen}${c.bold}✦ Setup files written${c.reset}\n\n`);
  output.write(`  ${dim("─")} ${c.cyan}${paths.blueprint}${c.reset}\n`);
  output.write(`  ${dim("─")} ${c.cyan}${paths.config}${c.reset}\n`);
  if (aggCreated) output.write(`  ${dim("─")} ${c.cyan}${paths.aggregator}${c.reset}\n`);
  output.write("\n");

  const launch = cliLaunch[preferredCli] || cliLaunch.Other;
  output.write(`  ${bold("Next:")}\n\n`);
  if (launch.command) {
    output.write(`  1. ${bold("Run")} ${c.bGreen}\`${launch.command}\`${c.reset} from this folder.\n`);
    output.write(`  2. ${bold("Say:")} ${c.bGreen}${launch.prompt}${c.reset}\n`);
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
