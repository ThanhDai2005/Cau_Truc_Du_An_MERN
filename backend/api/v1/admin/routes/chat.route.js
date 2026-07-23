import express from "express";
const router = express.Router();

import * as controller from "../controllers/chat.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("chats_view"), controller.list);

router.get("/:conversationId", requirePermission("chats_view"), controller.detail);

router.patch(
  "/:conversationId/close",
  requirePermission("chats_view"),
  controller.closeConversation,
);

export default router;
