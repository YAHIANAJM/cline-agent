import { useEffect, useState } from "react";
import type { Agent, Message } from "./types";
import { createAgent, getAgents } from "./api";
import AgentChat from "./components/AgentChat";
import "./App.css";

interface ChatSession {
  agent: Agent;
  messages: Message[];
}

function App() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

 const loadAgents = async () => {
  const existingAgents = await getAgents(); // Agent[]
  const sessions = existingAgents.map((agent: Agent) => ({
    agent,
    messages: [],
  }));
  setChats(sessions);
  if (sessions.length && !activeChatId) setActiveChatId(sessions[0].agent.id);
};


  useEffect(() => {
    loadAgents();
  }, []);

  const handleNewChat = async () => {
    const agent = await createAgent();
    const session = { agent, messages: [] };
    setChats((prev) => [...prev, session]);
    setActiveChatId(agent.id);
  };

  const updateMessages = (agentId: string, messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.agent.id === agentId ? { ...chat, messages } : chat
      )
    );
  };

  const activeChat = chats.find((c) => c.agent.id === activeChatId);

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Agents</h2>
        <button onClick={handleNewChat}>+ New Chat</button>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.agent.id}
              className={chat.agent.id === activeChatId ? "active" : ""}
              onClick={() => setActiveChatId(chat.agent.id)}
            >
              Agent: {chat.agent.id}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-container">
        {activeChat ? (
          <AgentChat
            agentId={activeChat.agent.id}
            messages={activeChat.messages}
            setMessages={(msgs) =>
              updateMessages(activeChat.agent.id, msgs)
            }
          />
        ) : (
          <p>Select or create a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
}

export default App;
