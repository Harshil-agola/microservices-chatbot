import mongoose from "mongoose"
import { ENV_CONFIG } from "./env.js";
import dns from "dns";

export const connectDatabase = async () => {
    try {
        dns.setServers([
            '1.1.1.1'
        ])
        await mongoose.connect(ENV_CONFIG.DATBASE_URL as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}