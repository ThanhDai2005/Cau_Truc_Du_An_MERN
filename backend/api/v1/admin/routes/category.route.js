import express from "express";
const router = express.Router();

import * as controller from "../controllers/category.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("categories_view"), controller.list);

router.post("/", requirePermission("categories_create"), controller.create);

router.patch("/:id", requirePermission("categories_edit"), controller.update);

router.delete(
  "/:id",
  requirePermission("categories_delete"),
  controller.softDelete,
);

export default router;
