import { Router } from "express";
import { createConversation, getConversations, updateConversation } from "../controllers/conversation.controller.js";
import { getMessages, saveMessage, searchMessagesAndConversations } from "../controllers/message.controller.js";

const router: Router = Router();

router.get("/search", searchMessagesAndConversations);
router.post("/", createConversation);
router.get("/", getConversations);
router.put("/:id", updateConversation);

router.post("/message", saveMessage);
router.get("/message/:conversationId", getMessages);

export { router as chatRoutes };