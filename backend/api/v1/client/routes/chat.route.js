import express from "express";
const router = express.Router();

import * as controller from "../controllers/chat.controller.js";

router.get("/conversations", controller.getMyConversations);

router.get("/conversations/:conversationId/messages", controller.getMessages);

export default router;
