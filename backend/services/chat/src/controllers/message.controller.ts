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

        const conversationId = req.params["conversation-id"];

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
        }).sort({ updatedAt: -1 })


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