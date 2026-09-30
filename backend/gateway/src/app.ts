import express, { type Application, type Request, type Response } from "express";
import proxy from "express-http-proxy";
import { ENV_CONFIG } from "./config/env.js";

const app: Application = express();

app.use(express.json());

app.get("/", (_req:Request, res:Response) => {
    return res.status(200).json({ message: "Welcome to the API" });
})

app.use('/api/auth', proxy(ENV_CONFIG.AUTH_SERVICE_URL));

export default app;