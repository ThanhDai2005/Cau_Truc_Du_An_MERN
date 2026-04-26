import express from "express";
const router = express.Router();

import * as controller from "../controllers/promotion.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("promotions_view"), controller.list);

router.post("/", requirePermission("promotions_create"), controller.create);

router.patch(
  "/update/:promotionId",
  requirePermission("promotions_edit"),
  controller.update,
);

router.patch(
  "/delete/:promotionId",
  requirePermission("promotions_delete"),
  controller.softDelete,
);

export default router;
