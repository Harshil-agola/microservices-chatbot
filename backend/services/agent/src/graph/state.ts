import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";

export const agentState = Annotation.Root({
    prompt: Annotation<string>(),
    aiResponse: Annotation<string>(),
    agent: Annotation<string>(),
    conversationId: Annotation<string>(),
    messages: Annotation<BaseMessage[]>({
        reducer: (curr, next) => next ?? curr,
        default: () => [],
    })
});