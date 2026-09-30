import admin, { cert } from "firebase-admin";
import { ENV_CONFIG } from "./env.js";

export const app = admin.initializeApp({
  credential: cert({
    projectId: ENV_CONFIG.FIREBASE_PROJECT_ID,
    clientEmail: ENV_CONFIG.FIREBASE_CLIENT_EMAIL,
    privateKey: ENV_CONFIG.FIREBASE_PRIVATE_KEY,
  }),
});

