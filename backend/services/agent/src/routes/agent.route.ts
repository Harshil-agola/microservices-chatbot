import { Router } from "express";
import { agentController } from "../controllers/agent.controller.js";

const router: Router = Router();

router.post("/ask", agentController);

export { router as agentRoutes };