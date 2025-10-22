export async function generateSubtasks(title: string, description: string) {
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

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables.");
    return [];
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Groq API error response:", errorBody);
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    const completion = await response.json();
    const content = completion.choices?.[0]?.message?.content;
    if (!content) return [];

    const cleaned = content.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (err) {
      console.log(
        "groq: failed to parse JSON from model response",
        err,
        "raw:",
        cleaned
      );
      return [];
    }
  } catch (err) {
    console.error("groq chat completion error:", err);
    return [];
  }
}
