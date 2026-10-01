import type { Request, RequestHandler } from "express";
import proxy, { type ProxyOptions } from "express-http-proxy";

export interface UserPayload {
    userId: string;
    firebaseUID?: string;
    email?: string;
    name?: string;
    profileImage?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

export const proxyWithHeader = (url: string, options?: ProxyOptions): RequestHandler => {
    return proxy(url, {
        ...options,
        proxyReqOptDecorator: (proxyReqOpts, srcReq: Request) => {
            const req = srcReq as AuthenticatedRequest;
            if (req?.user?.userId) {
                proxyReqOpts.headers = {
                    ...proxyReqOpts.headers,
                    "x-user-id": req.user.userId,
                };
            }
            if (options?.proxyReqOptDecorator) {
                return options.proxyReqOptDecorator(proxyReqOpts, srcReq);
            }
            return proxyReqOpts;
        },
    });
};