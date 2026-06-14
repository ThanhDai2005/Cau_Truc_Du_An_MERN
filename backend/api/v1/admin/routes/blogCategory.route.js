import express from "express";
const router = express.Router();

import * as controller from "../controllers/blogCategory.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("blog_categories_view"), controller.list);

router.post("/", requirePermission("blog_categories_create"), controller.create);

router.patch("/update/:blogCategoryId", requirePermission("blog_categories_edit"), controller.update);

router.patch(
  "/delete/:blogCategoryId",
  requirePermission("blog_categories_delete"),
  controller.softDelete,
);

export default router;
