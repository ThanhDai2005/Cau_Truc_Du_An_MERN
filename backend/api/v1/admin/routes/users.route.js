import express from "express";
const router = express.Router();

import * as controller from "../controllers/users.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("accounts_view"), controller.list);

router.post("/", requirePermission("accounts_create"), controller.create);

router.patch("/:id", requirePermission("accounts_edit"), controller.update);

router.delete(
  "/:id",
  requirePermission("accounts_delete"),
  controller.softDelete,
);

export default router;
