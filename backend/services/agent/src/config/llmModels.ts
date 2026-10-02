import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";

import { ENV_CONFIG } from "./env.js";

const groqModel = new ChatGroq({
    apiKey: ENV_CONFIG.GROQ_API_KEY,
    model: "openai/gpt-oss-120b"
});

const geminiModel = new ChatGoogle({
    apiKey: ENV_CONFIG.GOOGLE_API_KEY,
    model: "gemini-2.5-flash"
});

export const getModel = (modelName: "router" | "chat" | "search" | "pdf" | "ppt" | "coding" | "vision") => {
    switch (modelName) {
        case "chat":
            return groqModel;
        case "search":
            return groqModel;
        case "pdf":
            return geminiModel;
        case "ppt":
            return geminiModel;
        case "coding":
            return groqModel;
        case "vision":
            return geminiModel;
        case "router":
            return geminiModel;
        default:
            return groqModel;
    }
}