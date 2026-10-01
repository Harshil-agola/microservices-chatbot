import type { Request } from "express";
import { isObjectIdOrHexString } from "mongoose";

export const getUserId = (req: Request): string | null => {
    const userId = req.headers["x-user-id"];

    if (typeof userId !== "string" || !isObjectIdOrHexString(userId)) {
        return null;
    }

    return userId;
};