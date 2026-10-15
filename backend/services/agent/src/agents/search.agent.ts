import { getModel } from "../config/llmModels.js";
import { agentState } from "../graph/state.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const searchAgent = async (state: typeof agentState.State) => {
    try {
        const llm = await getModel("search");
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an assistant with access to web information. Provide comprehensive and accurate answers."],
            ["user", "{query}"]
        ]);
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({ query: state.prompt });
        return { ...state, aiResponse: response.content as string };
    } catch (error) {
        console.error("Search Agent Error:", error);
        return { ...state, aiResponse: "I encountered an error searching for that information." };
    }
};