import express from "express";
const router = express.Router();

import * as controller from "../controllers/users.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("accounts_view"), controller.list);

router.post("/", requirePermission("accounts_create"), controller.create);

router.patch(
  "/update/:userId",
  requirePermission("accounts_edit"),
  controller.update,
);

router.patch(
  "/delete/:userId",
  requirePermission("accounts_delete"),
  controller.softDelete,
);

export default router;
