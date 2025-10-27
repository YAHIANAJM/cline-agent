// api.tsx
export interface Agent {
  id: string;
}

export async function createAgent(): Promise<Agent> {
  const res = await fetch("http://localhost:3000/api/agents", {
    method: "POST",
  });
  const data = await res.json();
  return { id: data.id };
}

// NEW: get all agents
export async function getAgents(): Promise<Agent[]> {
  const res = await fetch("http://localhost:3000/api/agents");
  const data = await res.json();
  return data.agents.map((id: string) => ({ id }));
}

export interface Message {
  role: "user" | "cline";
  content: string;
}

export async function sendMessage(agentId: string, message: string): Promise<string> {
  const res = await fetch(`http://localhost:3000/api/agents/${agentId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.reply;
}
