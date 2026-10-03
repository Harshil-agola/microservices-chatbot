"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/utils/api-client";
import { UserResponse } from "@/types";

export const handleLoginAction = async (token: string) => {
    try {
        const response = await apiClient.auth.login(token);
        const result = await response.json();

        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
            const cookieStore = await cookies();
            const sessionMatch = setCookie.match(/session=([^;]+)/);
            if (sessionMatch) {
                cookieStore.set("session", sessionMatch[1], {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60,
                    path: "/",
                });
            }
        }

        return result;
    } catch (error) {
        console.error("Backend login error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to authenticate with backend",
        };
    }
};

export const getCurrentUser = async (): Promise<UserResponse | null> => {
    try {
        const response = await apiClient.auth.getMe();
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Backend get me error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to get current user",
        };
    }
};

export const logout = async (_prevState?: unknown) => {
    try {
        const response = await apiClient.auth.logout();

        const cookieStore = await cookies();
        cookieStore.delete("session");

        if (!response.ok) {
            throw new Error("Failed to logout");
        }
        return {
            status: true,
            message: "Logout successful",
        };
    } catch (error) {
        console.error("Backend logout error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to logout",
        };
    }
};


