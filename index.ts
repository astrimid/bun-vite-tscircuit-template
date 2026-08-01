#!/usr/bin/env bun
import { $ } from "bun";
import { join } from "path";
import { existsSync } from "fs";
import { parseArgs } from "node:util";

const HELP_TEXT = `
create-vite-tscircuit — scaffold a tscircuit + Vite + React project

Usage:
  create-vite-tscircuit [app-name] [options]

Arguments:
  app-name                 Directory/name for the new project
                            (if omitted, you'll be prompted)

Options:
  -t, --tgz <path>         Install @tscircuit/runframe from a local .tgz artifact
                            instead of npm
  -h, --help                Show this help message
  -v, --version              Print version and exit
`;

let values: { help?: boolean; version?: boolean; tgz?: string };
let positionals: string[];

try {
  ({ values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      tgz: { type: "string", short: "t" },
    },
    allowPositionals: true,
    strict: true,
  }));
} catch (err) {
  console.error(`Error: ${(err as Error).message}`);
  console.log(HELP_TEXT);
  process.exit(1);
}

if (values.help) {
  console.log(HELP_TEXT);
  process.exit(0);
}

if (values.version) {
  console.log("create-vite-tscircuit 0.1.0");
  process.exit(0);
}

function isValidAppName(name: string): boolean {
  // reject empty, whitespace-only, flag-like, or path-separator-containing names
  return /^[a-zA-Z0-9._-]+$/.test(name);
}

let appName = positionals[0];

if (!appName) {
  // interactive prompt — Bun's global prompt() mirrors the browser API
  const input = prompt("Project name:", "test-app");

  if (input === null) {
    // user hit Ctrl+C / EOF
    console.error("\nAborted: no project name provided.");
    process.exit(1);
  }

  appName = input.trim();

  if (appName === "") {
    console.error("Error: project name cannot be empty.");
    process.exit(1);
  }
}

if (!isValidAppName(appName)) {
  console.error(
    `Error: "${appName}" is not a valid project name (use letters, numbers, "-", "_", ".").`,
  );
  process.exit(1);
}

const tgzArg = values.tgz;

if (existsSync(join(process.cwd(), appName))) {
  console.error(`Error: directory "${appName}" already exists.`);
  process.exit(1);
}

if (appName.startsWith("-")) {
  console.error(`Error: "${appName}" looks like a flag, not an app name.`);
  console.log(HELP_TEXT);
  process.exit(1);
}

const scriptDir = import.meta.dir;
const templatePath = join(scriptDir, "templates", "App.tsx");

try {
  console.log(`Scaffolding ${appName} via create-vite...`);
  await $`bun create vite ${appName} --template react-ts --no-install --no-interactive`;

  const targetDir = join(process.cwd(), appName);
  const targetAppTsx = join(targetDir, "src", "App.tsx");

  console.log("Replacing App.tsx with tscircuit template...");
  if (existsSync(templatePath)) {
    await $`cp ${templatePath} ${targetAppTsx}`;
  } else {
    console.error(`Error: Template not found at ${templatePath}`);
    process.exit(1);
  }

  console.log("Installing base dependencies...");
  const sh = $.cwd(targetDir);

  if (tgzArg) {
    console.log(`Installing local artifact: ${tgzArg}...`);
    await sh`bun install`;
    await sh`npm install ${tgzArg} --no-package-lock`;
    await sh`bun pm cache rm && bun install --offline`;
  } else {
    console.log("Installing @tscircuit/runframe...");
    await sh`bun install`;
    await sh`bun add @tscircuit/runframe`;
  }

  console.log(`\nDone! Run:\n  cd ${appName}\n  bun dev`);
} catch (error) {
  console.error("\nExecution failed:", error);
  process.exit(1);
}
