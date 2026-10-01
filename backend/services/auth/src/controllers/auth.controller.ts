import type { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { User } from "../models/user.model.js";
import redis from "@shared/redis";


const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const login = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ status: false, message: "Authentication token is required" });
        }

        const decodedUser = await getAuth(app).verifyIdToken(token);

        let user = await User.findOne({
            firebaseUID: decodedUser.uid,
        });

        if (!user) {
            user = await User.create({
                name: decodedUser.name,
                email: decodedUser.email,
                firebaseUID: decodedUser.uid,
                profileImage: decodedUser.picture,
            });
        }

        const sessionId = crypto.randomUUID();

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                userId: user._id,
                firebaseUID: user.firebaseUID,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage
            }),
            "EX",
            SESSION_TTL_SECONDS
        );

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: SESSION_TTL_SECONDS * 1000,
        });

        return res.status(200).json({ status: true, data: { user } });
    } catch (error) {
        console.error("Login error:", error);
        if (error && typeof error === "object" && "code" in error) {
            const firebaseErrorCode = (error as { code: string }).code;
            if (
                firebaseErrorCode.includes("auth/id-token-expired") ||
                firebaseErrorCode.includes("auth/argument-error") ||
                firebaseErrorCode.includes("auth/invalid-id-token")
            ) {
                return res.status(401).json({ status: false, message: "Invalid or expired authentication token" });
            }
        }

        return res.status(500).json({ status: false, message: "An unexpected error occurred during login" });
    }
};


export const logout = async (req: Request, res: Response) => {
    try {
        const sessionId = req.cookies?.session

        if (!sessionId) {
            return res.status(400).json({ status: false, message: "Session not found" });
        }

        await redis.del(`session:${sessionId}`);

        res.clearCookie("session");

        return res.status(200).json({ status: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ status: false, message: "Failed to logout" });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const sessionId = req.cookies?.session;

        if (!sessionId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        const session = await redis.get(`session:${sessionId}`);

        if (!session) {
            return res.status(401).json({ status: false, message: "Session expired or invalid" });
        }

        const sessionData = JSON.parse(session);
        return res.status(200).json({ status: true, data: { user: sessionData } });

    } catch (error) {
        console.error("Get me error:", error);
        return res.status(500).json({ status: false, message: "Failed to get user profile" });
    }
};