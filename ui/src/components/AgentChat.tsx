import { useState } from "react";
// Correct way for TypeScript with verbatimModuleSyntax
import type { FormEvent } from "react";
import type { Message } from "../types";
import { sendMessage } from "../api";
import "./AgentChat.css";


interface Props {
  agentId: string;
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
}

export default function AgentChat({ agentId, messages, setMessages }: Props) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg: Message = { role: "user", content: input, sending: true };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const reply = await sendMessage(agentId, input);
      // mark user message as sent
      const updated = newMessages.map((msg, idx) =>
        idx === newMessages.length - 1 ? { ...msg, sending: false } : msg
      );
      setMessages([...updated, { role: "cline", content: reply }]);
    } catch (err) {
      console.error(err);
      // mark message as failed
      const updated = newMessages.map((msg, idx) =>
        idx === newMessages.length - 1 ? { ...msg, sending: false } : msg
      );
      setMessages(updated);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="agent-chat">
      <div className="chat-header">Agent: {agentId}</div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              msg.role === "user" ? "user" : "cline"
            }`}
          >
            <span className="message-content">
              {msg.sending ? "..." : msg.content}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={sending}>
          Send
        </button>
      </form>
    </div>
  );
}
