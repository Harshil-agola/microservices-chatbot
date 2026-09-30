import express, { type Application, type Request, type Response } from "express";
import { authRoutes } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();
app.use(cors({
    origin: ["http://localhost:8000"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use("/", authRoutes)

app.get("/", (_req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome to auth API" });
})

export default app;