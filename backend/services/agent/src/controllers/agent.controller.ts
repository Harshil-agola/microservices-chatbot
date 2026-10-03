import type { Request, Response } from "express";
import { z } from "zod";
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

        const gatewayHeaders = {
            "Content-Type": "application/json",
            ...(req.headers.authorization ? { "Authorization": req.headers.authorization } : {}),
            ...(req.headers.cookie ? { "Cookie": req.headers.cookie } : {})
        };


        const userMessageRes = await fetch(`${ENV_CONFIG.GATEWAY_URL}/api/chat/message`, {
            method: "POST",
            headers: gatewayHeaders,
            body: JSON.stringify({ conversationId, role: "user", content: prompt })
        });

        if (!userMessageRes.ok) {
            console.error("Failed to save user message:", await userMessageRes.text());
        }

        const result = await graph.invoke({ prompt, conversationId });
        const aiResponse = result.aiResponse;

        const aiMessageRes = await fetch(`${ENV_CONFIG.GATEWAY_URL}/api/chat/message`, {
            method: "POST",
            headers: gatewayHeaders,
            body: JSON.stringify({
                conversationId,
                role: "assistant",
                prompt: aiResponse
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