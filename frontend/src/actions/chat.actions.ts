"use server"

import { apiClient } from "@/utils/api-client";
import { cookies } from "next/headers";

export const getConversations = async () => {
    try {
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
        const response = await apiClient.chat.getConversations();
        const result = await response.json();
        return result?.success ? result?.data : [];
    } catch (error) {
        console.error("Backend get conversations error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to get conversations",
        };
    }
}

export const createConversation = async () => {
    try {
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
        const response = await apiClient.chat.createConversation();
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Backend create conversation error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to create conversation",
        };
    }
}


export const renameConversationAction = async (conversationId: string, title: string) => {
    try {
        const response = await apiClient.chat.renameConversation(conversationId, title);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Backend rename conversation error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to rename conversation",
        };
    }
}