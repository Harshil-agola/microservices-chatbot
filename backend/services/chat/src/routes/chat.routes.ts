import { Router } from "express";
import { createConversation, getConversations, updateConversation } from "../controllers/conversation.controller.js";
import { getMessages, saveMessage } from "../controllers/message.controller.js";

const router: Router = Router();

router.post("/", createConversation);
router.get("/", getConversations);
router.put("/:id", updateConversation);

router.post("/message", saveMessage);
router.get("/message/:conversation-id", getMessages);

export { router as chatRoutes };