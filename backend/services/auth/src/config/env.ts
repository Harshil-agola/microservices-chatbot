import { config as envConfig } from "dotenv"

envConfig()

export const ENV_CONFIG = {
    BACKEND_PORT: Number(process.env.BACKEND_PORT) || 8001,
    DATABASE_URL: process.env.DATABASE_URL || "",
    DATBASE_URL: process.env.DATABASE_URL || "",
    REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
    FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
}