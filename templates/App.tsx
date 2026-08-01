import { RunFrame } from "@tscircuit/runframe/runner"
import { CircuitJsonPreview } from "@tscircuit/runframe/preview"

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <RunFrame
        fsMap={{ "main.tsx": "circuit.add(<resistor resistance='1k' />)" }}
        entrypoint="main.tsx"
      />
      <CircuitJsonPreview circuitJson={[]} />
    </div>
  )
}

export default App