import express from "express";
const router = express.Router();

import * as controller from "../controllers/promotion.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("promotions_view"), controller.list);

router.post("/", requirePermission("promotions_create"), controller.create);

router.patch("/:id", requirePermission("promotions_edit"), controller.update);

router.delete(
  "/:id",
  requirePermission("promotions_delete"),
  controller.softDelete,
);

export default router;
