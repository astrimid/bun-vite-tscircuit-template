#!/usr/bin/env bun
import { $ } from "bun";
import { join } from "path";
import { existsSync } from "fs";

// 1. Get command line arguments ($1 and $2)
const appName = Bun.argv[2] || "test-app";
const tgzArg = Bun.argv[3];

// 2. Get the absolute path of this script's directory
const scriptDir = import.meta.dir;
const templatePath = join(scriptDir, "templates", "App.tsx");

try {
  // 3. Scaffold the Vite project
  console.log(`Scaffolding ${appName} via create-vite...`);
  await $`bun create vite ${appName} --template react-ts --no-install --no-interactive`;

  const targetDir = join(process.cwd(), appName);
  const targetAppTsx = join(targetDir, "src", "App.tsx");

  // 4. Replace App.tsx with the tscircuit template
  console.log("Replacing App.tsx with tscircuit template...");
  if (existsSync(templatePath)) {
    await $`cp ${templatePath} ${targetAppTsx}`;
  } else {
    console.error(`Error: Template not found at ${templatePath}`);
    process.exit(1);
  }

  // 5. Install dependencies inside the target directory using $.cwd()
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

  // 6. Success output
  console.log(`\nDone! Run:\n  cd ${appName}\n  bun dev`);

} catch (error) {
  // Acts like 'set -e', catching any non-zero exit code from the $ commands
  console.error("\nExecution failed:", error);
  process.exit(1);
}