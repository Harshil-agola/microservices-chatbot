import type { NextFunction, Request, Response } from "express"
import redis from "@shared/redis"

interface RequestType extends Request {
    user: {
        firebaseUID: string;
        name: string;
        email: string;
        profileImage?: string;
    }
}

const protectedRoute = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.cookies?.session
        if (!sessionId) {
            return res.status(401).json({ status: false, message: "unauthorized" });
        }

        const session = await redis.get(`session:${sessionId}`);

        if (!session) {
            return res.status(401).json({ status: false, message: "unauthorized" });
        }

        const sessionData = JSON.parse(session);
        req.user = sessionData;
        next();

    } catch (error) {
        console.error("Protected route error:", error);
        if (error instanceof Error) {
            return res.status(500).json({ status: false, message: error.message || "Something went wrong while authentication process" });
        }
        return res.status(500).json({ status: false, message: "Failed to authenticate" });
    }
}


export { protectedRoute }