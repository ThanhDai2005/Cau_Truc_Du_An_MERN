import express from "express";
const router = express.Router();
import multer from "multer";
import { uploadMulti } from "../middlewares/uploadCloud.middleware.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

import * as controller from "../controllers/product.controller.js";

router.get("/", requirePermission("products_view"), controller.list);

router.post(
  "/",
  requirePermission("products_create"),
  upload.array("images", 10),
  uploadMulti,
  controller.create,
);

router.patch(
  "/update/:productId",
  requirePermission("products_edit"),
  upload.array("images", 10),
  uploadMulti,
  controller.update,
);

router.patch(
  "/delete/:productId",
  requirePermission("products_delete"),
  controller.softDelete,
);

export default router;
