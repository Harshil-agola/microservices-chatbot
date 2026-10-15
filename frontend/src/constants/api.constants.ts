export const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${SERVER_URL}/api/auth/login`,
        LOGOUT: `${SERVER_URL}/api/auth/logout`,
        GET_ME: `${SERVER_URL}/api/auth/me`,
    },
    CHAT: {
        GET_CONVERSATIONS: `${SERVER_URL}/api/chat`,
        CREATE_CONVERSATION: `${SERVER_URL}/api/chat`,
        RENAME_CONVERSATION: (conversationId: string) => `${SERVER_URL}/api/chat/${conversationId}`,
        GET_MESSAGES: (conversationId: string) => `${SERVER_URL}/api/chat/message/${conversationId}`,
        SEND_MESSAGE: `${SERVER_URL}/api/chat/message`,
        SEARCH: (query: string) => `${SERVER_URL}/api/chat/search?q=${encodeURIComponent(query)}`,
    },
    AI: {
        ASK: `${SERVER_URL}/api/ai/ask`,
    }
} as const;
