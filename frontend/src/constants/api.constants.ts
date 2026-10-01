export const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${SERVER_URL}/api/auth/login`,
        LOGOUT: `${SERVER_URL}/api/auth/logout`,
        GET_ME: `${SERVER_URL}/api/auth/me`,
    },
} as const;
