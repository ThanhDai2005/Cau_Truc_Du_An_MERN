import express from "express";
const router = express.Router();

import * as controller from "../controllers/blog.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("blog_view"), controller.list);

router.post("/", requirePermission("blog_create"), controller.create);

router.patch("/update/:blogId", requirePermission("blog_edit"), controller.update);

router.patch(
  "/delete/:blogId",
  requirePermission("blog_delete"),
  controller.softDelete,
);

export default router;
