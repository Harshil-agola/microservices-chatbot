export const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    AUTH: {
        BASE: `${SERVER_URL}/api/auth`,
        LOGIN: `${SERVER_URL}/api/auth/login`,
    },
} as const;
