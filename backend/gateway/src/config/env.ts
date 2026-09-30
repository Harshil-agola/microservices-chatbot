import { config as envConfig } from "dotenv"

envConfig()

export const ENV_CONFIG = {
    BACKEND_PORT: process.env.BACKEND_PORT || 8000,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string
}