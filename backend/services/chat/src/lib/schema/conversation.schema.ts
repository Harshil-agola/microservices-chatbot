import { z } from "zod";

export const createConversationSchema = z.object({
    title: z.string().trim().min(1, "Title cannot be empty").max(50, "Title is too long").optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;



export const updateConversationSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(50, "Title too long"),
});

export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;