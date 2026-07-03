import express from "express";
const router = express.Router();
import multer from "multer";
import { uploadSingle } from "../middlewares/uploadCloud.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

import * as controller from "../controllers/blog.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("blog_view"), controller.list);

router.get("/:blogId", requirePermission("blog_view"), controller.detail);

router.post(
  "/",
  requirePermission("blog_create"),
  upload.single("imageUrl"),
  uploadSingle,
  controller.create,
);

router.patch(
  "/update/:blogId",
  requirePermission("blog_edit"),
  upload.single("imageUrl"),
  uploadSingle,
  controller.update,
);

router.patch(
  "/change-status/:status/:blogId",
  requirePermission("blog_edit"),
  controller.changeStatus,
);

router.patch(
  "/change-multi",
  requirePermission("blog_delete"),
  controller.changeMulti,
);

router.delete(
  "/delete/:blogId",
  requirePermission("blog_delete"),
  controller.deleteItem,
);

router.patch(
  "/soft-delete/:blogId",
  requirePermission("blog_delete"),
  controller.softDelete,
);

export default router;
