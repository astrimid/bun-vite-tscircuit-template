# create-vite-tscircuit

Scaffold a React + TypeScript [tscircuit](https://github.com/tscircuit/tscircuit) application powered by [Vite](https://vitejs.dev/) and [Bun](https://bun.sh/) in seconds.

## Prerequisites

This generator uses [Bun Shell](https://bun.sh/docs/runtime/shell) under the hood for blazing-fast, cross-platform scaffolding. You must have **[Bun installed](https://bun.sh/docs/installation)** on your system:

```bash
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash

```

## Quickstart

Scaffold a new project interactively or by passing your project name:

```bash
# Using Bun (Recommended)
bun create vite-tscircuit my-circuit-app

# Using npm / pnpm / yarn
npm create vite-tscircuit@latest my-circuit-app
pnpm create vite-tscircuit my-circuit-app

```

Once generated, start the development server:

```bash
cd my-circuit-app
bun dev

```

## What's Included?

1. **Vite + React + TypeScript:** Configured using the official `react-ts` Vite template.
2. **`@tscircuit/runframe`:** Pre-installed and ready for interactive circuit rendering.
3. **Starter Circuit (`src/App.tsx`):** Comes with a live preview of a basic resistor circuit:

```tsx
import { RunFrame } from "@tscircuit/runframe/runner"
import { CircuitJsonPreview } from "@tscircuit/runframe/preview"

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <RunFrame "circuit.add(<resistor "main.tsx": fsMap="{{" resistance="1k"/>)" }}
        entrypoint="main.tsx"
      />
      <CircuitJsonPreview circuitJson="{[]}"/>
    </div>
  )
}

export default App

```


## Advanced Usage (CI & Local Builds)

If you are testing local builds or running inside a CI pipeline, you can pass a path to a local `.tgz` release artifact as the second argument. The CLI will install the local package offline instead of fetching from npm:

```bash
bun create vite-tscircuit test-app ./path/to/tscircuit-runframe-0.0.1.tgz

```


## License

MIT



### Setup Instructions for CI:

1. Generate an **Access Token (Automation)** from your [npm account settings](https://www.npmjs.com/settings/~/tokens).
2. Go to your repository on GitHub: **Settings > Secrets and variables > Actions > New repository secret**.
3. Name the secret **`NPM_TOKEN`** and paste your npm automation token as the value.
4. When you draft and publish a new GitHub Release (e.g., `v1.0.0`), GitHub Actions will automatically validate the TypeScript files and publish `create-vite-tscircuit` to npm with [npm provenance](https://docs.npmjs.com/generating-provenance-statements) enabled.