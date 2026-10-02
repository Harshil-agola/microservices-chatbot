import { config as envConfig } from "dotenv"

envConfig()

export const ENV_CONFIG = {
    BACKEND_PORT: Number(process.env.BACKEND_PORT) || 8003,
    DATABASE_URL: process.env.DATABASE_URL || "",
    REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    GATEWAY_URL: process.env.GATEWAY_URL || "http://localhost:8000",
    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || ""
}