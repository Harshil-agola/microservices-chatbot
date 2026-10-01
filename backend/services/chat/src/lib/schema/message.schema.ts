import { z } from "zod";


export const saveMessageSchema = z.object({
    content: z.string().trim().min(3, "Content cannot be empty"),
    conversationId: z.string().trim().min(1, "Conversation ID cannot be empty"),
    role: z.enum(["user", "ai"]),
});

export type SaveMessageInput = z.infer<typeof saveMessageSchema>;    