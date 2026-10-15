import type { Request, Response } from "express";
import { z } from "zod";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ENV_CONFIG } from "../config/env.js";
import { graph } from "../graph/graph.js";

const agentRequestSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    conversationId: z.string().min(1, "Conversation ID is required")
});

export const agentController = async (req: Request, res: Response) => {
    try {
        const parseResult = agentRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: "Invalid request data",
                details: parseResult.error.issues.map(issue => issue.message)
            });
        }

        const { prompt, conversationId } = parseResult.data;

        const gatewayHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            ...(req.headers.authorization ? { "Authorization": req.headers.authorization as string } : {}),
            ...(req.headers.cookie ? { "Cookie": req.headers.cookie as string } : {}),
            ...(req.headers["x-user-id"] ? { "x-user-id": req.headers["x-user-id"] as string } : {}),
        };


        const userMessageRes = await fetch(`${ENV_CONFIG.GATEWAY_URL}/api/chat/message`, {
            method: "POST",
            headers: gatewayHeaders,
            body: JSON.stringify({ conversationId, role: "user", content: prompt })
        });

        if (!userMessageRes.ok) {
            console.error("Failed to save user message:", await userMessageRes.text());
        }

        // Retrieve existing conversation history for memory
        let historyMessages: any[] = [];
        try {
            const historyRes = await fetch(`${ENV_CONFIG.GATEWAY_URL}/api/chat/message/${conversationId}`, {
                method: "GET",
                headers: gatewayHeaders,
            });

            if (historyRes.ok) {
                const historyData = await historyRes.json();
                const rawMessages = historyData?.data || [];
                // Map to LangChain messages (exclude the latest user message which is state.prompt)
                historyMessages = rawMessages
                    .slice(0, -1) // exclude the just-saved user message
                    .slice(-10) // keep last 10 messages for context
                    .map((msg: any) =>
                        msg.role === "user"
                            ? new HumanMessage(msg.content)
                            : new AIMessage(msg.content)
                    );
            }
        } catch (memErr) {
            console.error("Failed to load conversation history for memory:", memErr);
        }

        const result = await graph.invoke({
            prompt,
            conversationId,
            messages: historyMessages
        });
        const aiResponse = result.aiResponse;

        const aiMessageRes = await fetch(`${ENV_CONFIG.GATEWAY_URL}/api/chat/message`, {
            method: "POST",
            headers: gatewayHeaders,
            body: JSON.stringify({
                conversationId,
                role: "ai",
                content: aiResponse
            })
        });

        if (!aiMessageRes.ok) {
            console.error("Failed to save AI message:", await aiMessageRes.text());
        }

        return res.status(200).json({
            response: aiResponse,
            agent: result.agent
        });

    } catch (error) {
        console.error("Agent Controller Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};