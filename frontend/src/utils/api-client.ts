import { cookies } from "next/headers";
import { API_ENDPOINTS, SERVER_URL } from "@/constants/api.constants";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = SERVER_URL) {
        this.baseUrl = baseUrl;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const cookieStore = await cookies();
        const url = endpoint.startsWith("http")
            ? endpoint
            : `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

        return fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
                ...options.headers,
            },
        });
    }

    // Generic HTTP Methods
    async get(endpoint: string, options?: RequestInit) {
        return this.request(endpoint, { ...options, method: "GET" });
    }

    async post(endpoint: string, body?: unknown, options?: RequestInit) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    async put(endpoint: string, body?: unknown, options?: RequestInit) {
        return this.request(endpoint, {
            ...options,
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    async patch(endpoint: string, body?: unknown, options?: RequestInit) {
        return this.request(endpoint, {
            ...options,
            method: "PATCH",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    async delete(endpoint: string, options?: RequestInit) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }

    readonly auth = {
        login: (token: string, options?: RequestInit) =>
            this.post(API_ENDPOINTS.AUTH.LOGIN, { token }, options),
        getMe: (options?: RequestInit) =>
            this.get(API_ENDPOINTS.AUTH.GET_ME, options),
        logout: (options?: RequestInit) =>
            this.post(API_ENDPOINTS.AUTH.LOGOUT, undefined, options),
    };
}

export const apiClient = new ApiClient();
export default ApiClient;
