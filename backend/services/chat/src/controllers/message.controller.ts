import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Message } from "../models/message.model.js";
import { saveMessageSchema } from "../lib/schema/message.schema.js";
import { Conversation } from "../models/conversation.model.js";
import { getUserId } from "../lib/helper-functions/index.js";

export const saveMessage = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Login and try again",
            });
        }

        const parseResult = saveMessageSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: parseResult.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const { content, conversationId, role } = parseResult.data;

        if (!isValidObjectId(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const conversation = await Conversation.exists({
            _id: conversationId,
            userId,
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const message = await Message.create({
            content,
            conversationId,
            role,
        });

        return res.status(201).json({
            success: true,
            data: message,
        });
    } catch (error) {
        console.error("Error Saving Message:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Login and try again",
            });
        }

        const conversationId = req.params["conversationId"] || req.params["conversation-id"];

        if (typeof conversationId !== "string" || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const conversation = await Conversation.exists({
            _id: conversationId,
            userId,
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const messages = await Message.find({
            conversationId
        }).sort({ createdAt: 1 })


        return res.status(200).json({
            success: true,
            data: messages ?? []
        });
    } catch (error) {
        console.error("Error Fetching Messages:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const searchMessagesAndConversations = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Login and try again",
            });
        }

        const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
        if (!query) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        // 1. Find conversations belonging to this user
        const userConversations = await Conversation.find({ userId }).select("_id title updatedAt").lean();
        const convMap = new Map(userConversations.map(c => [c._id.toString(), c]));
        const convIds = Array.from(convMap.keys());

        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedQuery, "i");

        // 2. Find messages matching content in these conversations
        const matchingMessages = await Message.find({
            conversationId: { $in: convIds },
            content: { $regex: regex },
        }).sort({ createdAt: -1 }).limit(30).lean();

        // 3. Find conversations matching title
        const matchingTitles = userConversations.filter(c => regex.test(c.title));

        const resultsMap = new Map<string, { conversationId: string; title: string; matchSnippet: string; role?: string }>();

        // Add matching title conversations
        for (const conv of matchingTitles) {
            resultsMap.set(conv._id.toString(), {
                conversationId: conv._id.toString(),
                title: conv.title,
                matchSnippet: `Chat title matches: "${conv.title}"`,
            });
        }

        // Add matching message conversations
        for (const msg of matchingMessages) {
            const cid = msg.conversationId.toString();
            const conv = convMap.get(cid);
            if (conv && !resultsMap.has(cid)) {
                resultsMap.set(cid, {
                    conversationId: cid,
                    title: conv.title,
                    matchSnippet: msg.content.length > 90 ? msg.content.substring(0, 90) + "..." : msg.content,
                    role: msg.role,
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: Array.from(resultsMap.values()),
        });
    } catch (error) {
        console.error("Error searching chats:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};