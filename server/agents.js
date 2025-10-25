import { spawn } from "child_process";

const agents = {}; // store agents by ID

function generateId() {
  return Date.now().toString();
}

// Create a new agent
export function createAgent() {
  const id = generateId();
  agents[id] = { id };
  console.log(`[Agent ${id}] Created`);
  return id;
}

// Send message to Cline CLI for a specific agent
// Send message to Cline CLI for a specific agent
// Send message to Cline CLI for a specific agent
export async function sendMessage(id, message) {
  const agent = agents[id];
  if (!agent) throw new Error("Agent not found");

  return new Promise((resolve, reject) => {
    const cline = spawn("cline", ["--no-interactive"]);

    let output = "";
    let errorOutput = "";

    cline.stdout.on("data", (data) => {
      output += data.toString();
    });

    cline.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    cline.on("close", (code) => {
      if (code !== 0 || errorOutput) {
        console.error(`[Agent ${id}] Cline error:`, errorOutput);
        reject(new Error(errorOutput || `Cline exited with code ${code}`));
      } else {
        // Remove ANSI color codes
        const cleanOutput = output.replace(/\u001b\[[0-9;]*m/g, "");

        // Strictly extract "### Task completed" section
        const match = cleanOutput.match(/### Task completed\s*([\s\S]*?)(?=\n###|$)/);

        const finalReply = match ? match[1].trim() : "No 'Task completed' message found.";

        console.log(`[Agent ${id}] Message: ${message}`);
        console.log(`[Agent ${id}] Reply: ${finalReply}`);

        resolve(finalReply);
      }
    });

    // Send message to Cline
    cline.stdin.write(message + "\n");
    cline.stdin.end();
  });
}



// Get all agent IDs
export function getAgents() {
  return Object.keys(agents);
}
