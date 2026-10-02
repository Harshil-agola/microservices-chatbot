import { StateGraph, START, END } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent, codingAgent, pdfAgent, pptAgent, searchAgent, visionAgent } from "../agents/index.js";

const workflow = new StateGraph(agentState)
    .addNode("router", router)
    .addNode("chat", chatAgent)
    .addNode("search", searchAgent)
    .addNode("coding", codingAgent)
    .addNode("pdf", pdfAgent)
    .addNode("ppt", pptAgent)
    .addNode("vision", visionAgent)
    .addEdge(START, "router")
    .addConditionalEdges("router", (state) => {
        switch (state.agent) {
            case "chat":
                return "chat";
            case "search":
                return "search";
            case "coding":
                return "coding";
            case "pdf":
                return "pdf";
            case "ppt":
                return "ppt";
            case "vision":
                return "vision";
            default:
                return "chat";
        }
    }, {
        chat: "chat",
        search: "search",
        coding: "coding",
        pdf: "pdf",
        ppt: "ppt",
        vision: "vision"
    })
    .addEdge("search", "chat")
    .addEdge("chat", END)
    .addEdge("coding", END)
    .addEdge("pdf", END)
    .addEdge("ppt", END)
    .addEdge("vision", END)

export const graph = workflow.compile()