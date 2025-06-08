import { GoogleGenerativeAI } from '@google/generative-ai';



const genAI=new GoogleGenerativeAI(process.env.GenerativeAi_ApiKey!)


export async function generateSubtasks(title:string,description:string){
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an intelligent task breakdown assistant. Given a task and description, analyze its complexity, estimated time requirement, and difficulty. Then, break it down into logical subtasks to ensure an efficient workflow.

Rules:
- If the task is simple and quick, generate **only 1–2** subtasks (or keep it as a single task if division is unnecessary).
- If the task is a **moderate challenge**, create **a few** key subtasks that structure the workflow efficiently.
- If the task is **large or complex**, divide it into **small actionable steps** to make execution easier.
- Each subtask must be meaningful, helping the user work towards completing the full task.

Task: ${title}

Description: ${description}

Return the result in **JSON format**, following this structure:
[
  { "title": "...", "priority": "high", "estimated_time": "..." },
  { "title": "...", "priority": "medium", "estimated_time": "..." }
]
`;


    const reasult=await model.generateContent(prompt)
    const text=reasult.response.text()

    try{
        const Subtasks=JSON.parse(text)
        return Subtasks
    }catch(error){
        console.log('error parsing json', error)
        throw new Error('Failed to get the gemini response')
    }
}