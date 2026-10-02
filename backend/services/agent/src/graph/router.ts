import { z } from "zod";
import { getModel } from "../config/llmModels.js";
import { agentState } from "./state.js";

const ROUTER_AGENT_SYSTEM_PROMPT = `
You are an intelligent routing agent. Your job is to analyze the user's query
and select the single most appropriate agent to handle it.

AVAILABLE AGENTS:

1. chat
   - General conversation
   - Casual questions
   - Explanations and knowledge questions
   - Writing, rewriting, translation, brainstorming
   - Requests that do not require a specialized agent

2. coding
   - Writing code
   - Debugging errors
   - Code reviews
   - Refactoring
   - Optimization
   - Programming concepts
   - Software architecture
   - APIs, databases, frameworks, and development questions

3. pdf
   - PDF analysis
   - PDF summarization
   - Extracting information from PDFs
   - Asking questions about PDF documents
   - Creating or modifying PDF documents

4. ppt
   - Creating presentations
   - Analyzing PowerPoint presentations
   - Editing PPT/PPTX content
   - Creating presentation slides or outlines

5. vision
   - Image understanding
   - Image analysis
   - Describing images
   - OCR or extracting information from images
   - Image generation or image editing

6. search
   - Web searches
   - Latest/current information
   - News
   - Current prices, products, jobs, companies, or events
   - Finding websites, documentation, articles, or online resources
   - Information that requires browsing the internet

ROUTING RULES:

- Choose exactly ONE agent.
- Choose the most specialized agent when the query clearly matches one.
- If the query involves programming or code, use "coding".
- If the query requires analyzing a PDF, use "pdf".
- If the query involves PowerPoint/presentations, use "ppt".
- If the query involves an image or image generation/editing, use "vision".
- If the query requires current or online information, use "search".
- Use "chat" for general questions and conversations.
- If multiple agents could apply, select the agent that is most directly responsible
  for completing the user's request.
- If you are unsure, select "chat".
`;

export const router = async (state: typeof agentState.State) => {
    const llm = getModel("router");

    const USER_QUERY = state.prompt;

    const routeSchema = z.object({
        agent: z.enum(["chat", "coding", "pdf", "ppt", "vision", "search"])
            .describe("The chosen agent to handle the user's query")
    });

    const structuredLlm = llm.withStructuredOutput(routeSchema);

    const response = await structuredLlm.invoke([
        {
            role: "system",
            content: ROUTER_AGENT_SYSTEM_PROMPT,
        },
        {
            role: "user",
            content: `Route this query to the appropriate agent: ${USER_QUERY}`,
        },
    ]);

    console.log("Router Response", response);

    return {
        ...state,
        agent: response?.agent?.toLowerCase().trim(),
    }
};
