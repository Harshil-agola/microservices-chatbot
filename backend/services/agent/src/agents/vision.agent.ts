import { getModel } from "../config/llmModels.js";
import { agentState } from "../graph/state.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const VISION_SYSTEM_PROMPT = `
You are a creative Vision & Image Generation AI Agent.
When a user asks to generate, create, show, or draw an image:
1. Provide a concise, vivid description of what is created.
2. Embed the generated image directly using standard Markdown image syntax with pollinations:
   ![Descriptive Alt Text](https://image.pollinations.ai/prompt/<encoded_prompt>?width=1024&height=1024&nologo=true)
   Where <encoded_prompt> is the detailed visual prompt with URL encoded spaces (e.g. cute%20cat%20sitting%20in%20garden).
3. If the user asks general questions about visual design, photography, or image concepts, provide helpful, well-structured explanations.
`;

export const visionAgent = async (state: typeof agentState.State) => {
    try {
        const llm = await getModel("vision");
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", VISION_SYSTEM_PROMPT],
            new MessagesPlaceholder("history"),
            ["user", "{query}"]
        ]);
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({
            history: state.messages || [],
            query: state.prompt
        });
        return { ...state, aiResponse: response.content as string };
    } catch (error) {
        console.error("Vision Agent Error:", error);
        return { ...state, aiResponse: "I encountered an error generating the image." };
    }
};