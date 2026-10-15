import { getModel } from "../config/llmModels.js";
import { agentState } from "../graph/state.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const CODING_SYSTEM_PROMPT = `
You are an expert software engineer and programming assistant.
Provide clean, concise, production-ready code with clear explanations.
Remember previous code snippets and context from the conversation history.
Use markdown code blocks with the appropriate language tag.
`;

export const codingAgent = async (state: typeof agentState.State) => {
    try {
        const llm = await getModel("coding");
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", CODING_SYSTEM_PROMPT],
            new MessagesPlaceholder("history"),
            ["user", "{query}"]
        ]);
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({
            history: state.messages || [],
            query: state.prompt
        });

        return {
            ...state,
            aiResponse: response.content as string
        };
    } catch (error) {
        console.error("Coding Agent Error:", error);
        return {
            ...state,
            aiResponse: "I encountered an issue processing your programming request."
        };
    }
};