import { getModel } from "../config/llmModels.js";
import { agentState } from "../graph/state.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const pdfAgent = async (state: typeof agentState.State) => {
    try {
        const llm = await getModel("pdf");
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an AI assistant specialized in analyzing and extracting knowledge from documents and PDFs."],
            ["user", "{query}"]
        ]);
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({ query: state.prompt });
        return { ...state, aiResponse: response.content as string };
    } catch (error) {
        console.error("PDF Agent Error:", error);
        return { ...state, aiResponse: "I encountered an error handling your document request." };
    }
};