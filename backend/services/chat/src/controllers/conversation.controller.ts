import type { Request, Response } from "express";
import { Conversation } from "../models/conversation.model.js";
import { createConversationSchema, updateConversationSchema } from "../lib/schema/conversation.schema.js";
import { getUserId } from "../lib/helper-functions/index.js";
import { isValidObjectId } from "mongoose";

export const createConversation = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Login and try again",
            });
        }

        const parseResult = createConversationSchema.safeParse(req.body || {});
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parseResult.error.issues?.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                })),
            });
        }

        const { title } = parseResult.data;

        const conversation = await Conversation.create({
            userId,
            ...(title ? { title } : {}),
        });

        return res.status(201).json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Login and try again",
            });
        }

        const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateConversation = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Login and try again",
            });
        }

        const conversationId = req.params.id;

        if (typeof conversationId !== "string" || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const parseResult = updateConversationSchema.safeParse(req.body);

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

        const conversation = await Conversation.findOneAndUpdate(
            { _id: conversationId, userId },
            { $set: { title: parseResult.data.title } },
            { returnDocument: 'after', runValidators: true }
        ).lean();

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (error: any) {
        console.error("Error updating conversation:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Database Validation Error",
                errors: Object.values(error.errors || {}).map((err: any) => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};