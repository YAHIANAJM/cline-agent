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

export async function sendMessage(agentId: string, message: string): Promise<string> {
  const res = await fetch(`http://localhost:3000/api/agents/${agentId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  // Extract only the ACT-mode reply
  // We assume your backend now returns only the ACT-mode part
  return data.reply;
}
