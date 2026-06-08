import express from "express";
const router = express.Router();
import * as controller from "../controllers/review.controller.js";
import multer from "multer";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadReviewImages } from "../middlewares/uploadCloud.middleware.js";

// Configure multer for memory storage with file validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
  },
});

router.get("/:productId", controller.listByProduct);

router.post(
  "/",
  requireAuth,
  upload.array("images", 5),
  uploadReviewImages,
  controller.create,
);

export default router;
