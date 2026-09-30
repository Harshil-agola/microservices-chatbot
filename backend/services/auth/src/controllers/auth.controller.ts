import type { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { User } from "../models/user.model.js";
import redis from "@shared/redis";


const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const login = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

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
        if (error instanceof Error) {
            return res.status(500).json({ status: false, message: error.message || "Something went wrong while login process" });
        }
        return res.status(500).json({ status: false, message: "Failed to login" });
    }
};