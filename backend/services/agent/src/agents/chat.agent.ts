import { getModel } from "../config/llmModels.js";
import { agentState } from "../graph/state.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const CHAT_SYSTEM_PROMPT = `
You are an intelligent, helpful, and friendly AI assistant.
Your goal is to provide accurate, concise, and well-structured answers to a wide variety of questions.

Guidelines:
- Be direct and to the point.
- Use formatting (markdown, lists, bold text) to make your answers easy to read.
- If you don't know the answer, politely admit it rather than making things up.
- Keep a professional and objective tone.
`;

export const chatAgent = async (state: typeof agentState.State) => {
    const llm = await getModel("chat");

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", CHAT_SYSTEM_PROMPT],
        ["user", "{query}"]
    ]);

    const chain = prompt.pipe(llm);

    const response = await chain.invoke({
        query: state.prompt
    });

    console.log("Chat Agent Response", response);

    return {
        ...state,
        aiResponse: response.content
    };
};