import express from "express";
const router = express.Router();
import * as controller from "../controllers/review.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

router.get("/:productId", controller.listByProduct);

router.post("/", requireAuth, controller.create);

export default router;
