// App.tsx
import { useEffect, useState } from "react";
import { createAgent } from "./api";
import type { Agent } from "./api";
import AgentChat from "./components/AgentChat";

function App() {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const initAgent = async () => {
      const newAgent = await createAgent();
      setAgent(newAgent);
    };
    initAgent();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-2xl font-bold p-4">MCP Bridge UI (ACT Mode Only)</h1>
      {agent ? <AgentChat agentId={agent.id} /> : <p>Loading agent...</p>}
    </div>
  );
}

export default App;
