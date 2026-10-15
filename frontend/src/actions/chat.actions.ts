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
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
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

export const getMessages = async (conversationId: string) => {
    try {
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
        const response = await apiClient.chat.getMessages(conversationId);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend get messages failed (${response.status}):`, errorText);
            return [];
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const nonJson = await response.text();
            console.error("Backend get messages returned non-JSON response:", nonJson.substring(0, 200));
            return [];
        }
        const result = await response.json();
        return result?.success ? result.data : [];
    } catch (error) {
        console.error("Backend get messages error:", error);
        return [];
    }
}

export const sendMessageAction = async (conversationId: string, content: string, role: "user" | "ai" = "user") => {
    try {
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
        const response = await apiClient.chat.sendMessage({ conversationId, content, role });
        if (!response.ok) {
            const errText = await response.text();
            return { success: false, message: errText || `Request failed with status ${response.status}` };
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { success: false, message: "Non-JSON response from server" };
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Backend send message error:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to send message",
        };
    }
}

export const askAiAction = async (conversationId: string, prompt: string) => {
    try {
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
        const response = await apiClient.ai.ask({ conversationId, prompt });
        if (!response.ok) {
            const errText = await response.text();
            return { error: errText || `AI request failed with status ${response.status}` };
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { error: "Non-JSON response from AI service" };
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Backend ask AI error:", error);
        return {
            error: error instanceof Error ? error.message : "Failed to ask AI",
        };
    }
};

export const searchChatsAction = async (query: string) => {
    try {
        const headers = (await cookies()).get("session")?.value
        if (!headers) {
            throw new Error("Please Login and try again")
        }
        if (!query.trim()) return [];
        const response = await apiClient.chat.searchChats(query.trim());
        if (!response.ok) return [];
        const result = await response.json();
        return result?.success ? result.data : [];
    } catch (error) {
        console.error("Backend search chats error:", error);
        return [];
    }
};