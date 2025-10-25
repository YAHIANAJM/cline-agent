import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { sendMessage } from "../api";

interface Props {
  agentId: string;
}

interface Message {
  role: "user" | "cline";
  content: string;
}

export default function AgentChat({ agentId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newUserMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newUserMessage]);

    // Send to backend
    const reply = await sendMessage(agentId, input);

    // Add Cline reply
    const clineMessage: Message = { role: "cline", content: reply };
    setMessages((prev) => [...prev, clineMessage]);

    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col border p-4 overflow-y-auto">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p className={msg.role === "user" ? "bg-blue-200 inline-block p-2 rounded" : "bg-gray-200 inline-block p-2 rounded"}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
