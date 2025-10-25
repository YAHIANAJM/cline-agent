import express from "express";
import bodyParser from "body-parser";
import { createAgent, sendMessage, getAgents } from "./agents.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Create a new agent
app.post("/api/agents", (req, res) => {
  const id = createAgent();
  res.json({ id });
});

// List all agents
app.get("/api/agents", (req, res) => {
  res.json({ agents: getAgents() });
});

// Send a message to a specific agent
app.post("/api/agents/:id/message", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const reply = await sendMessage(id, message);
    res.json({ reply });
  } catch (err) {
    console.error(`Error sending message to agent ${id}:`, err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MCP Bridge Server running on http://localhost:${PORT}`);
});
