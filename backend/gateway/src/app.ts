import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import { ENV_CONFIG } from "./config/env.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import { protectedRoute } from "./middleware/auth.middleware.js";

const app: Application = express();

app.use(cors({
    origin: [ENV_CONFIG.FRONTEND_URL],
    credentials: true,
}));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome to the API" });
})

app.use('/api/auth', proxyWithHeader(ENV_CONFIG.AUTH_SERVICE_URL));
app.use('/api/chat', protectedRoute, proxyWithHeader(ENV_CONFIG.CHAT_SERVICE_URL));
app.use('/api/agent', protectedRoute, proxyWithHeader(ENV_CONFIG.AGENT_SERVICE_URL));

export default app;