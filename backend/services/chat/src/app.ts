import express, { type Application, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV_CONFIG } from "./config/env.js";
import { chatRoutes } from "./routes/chat.routes.js";

const app: Application = express();

app.use(cors({
    origin: [ENV_CONFIG.GATEWAY_URL],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", chatRoutes)

app.get("/", (_req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome to chat API" });
})

export default app;