"use server";

import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/constants/api.constants";

export const handleLoginAction = async (token: string) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

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