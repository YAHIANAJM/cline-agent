// types.ts
export interface Message {
  role: "user" | "cline";
  content: string;
  sending?: boolean; // true when waiting for reply
}

export interface Agent {
  id: string;
}
