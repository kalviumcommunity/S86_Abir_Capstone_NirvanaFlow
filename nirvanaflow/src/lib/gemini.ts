import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GenerativeAi_ApiKey!);

export async function generateSubtasks(title: string, description: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a helpful and intelligent task breakdown assistant.

Given a **task title** and a **detailed description**, your job is to:
- Understand the scope and complexity.
- Estimate required effort and time.
- Break the task down into clear, actionable subtasks.
- Assign a **priority** ("high", "medium", or "low") to each subtask based on its importance to overall task completion.
- Estimate the **expected time** for each subtask in a human-readable format (e.g., "15 mins", "2 hours", "1–2 days").

### Rules:
- If the task is **very simple**, create only 1–2 subtasks (or keep it as one task if further division isn't meaningful).
- If the task is **moderately complex**, generate 3–5 essential subtasks to guide the workflow.
- If the task is **large or multi-step**, break it down into **bite-sized, sequential subtasks** for smoother execution.
- Do **not repeat** the original title or description in the output.
- All subtasks should be relevant, useful, and avoid redundancy.

### Output format:
Return your answer in **strict JSON format**, no markdown or explanation, following this array structure:
[
  {
    "title": "Subtask title",
    "priority": "high | medium | low",
    "estimated_time": "short description of time needed"
  },
  ...
]

### Example:
[
  {
    "title": "Research top UI frameworks",
    "priority": "high",
    "estimated_time": "1 hour"
  },
  {
    "title": "Set up project boilerplate with selected framework",
    "priority": "medium",
    "estimated_time": "2–3 hours"
  }
]

### Task to process:
Task: ${title}
Description: ${description}
`;


  const reasult = await model.generateContent(prompt);
  const text = reasult.response.text();

  try {
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const Subtasks = JSON.parse(cleanedText);
    return Subtasks;
  } catch (error) {
    console.log("error parsing json", error);
    throw new Error("Failed to get the gemini response");
  }
}
