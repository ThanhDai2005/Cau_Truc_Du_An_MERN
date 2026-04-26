import express from "express";
const router = express.Router();

import * as controller from "../controllers/role.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/permissions", controller.getPermissions);

router.get("/", requirePermission("roles_view"), controller.list);

router.post("/", requirePermission("roles_create"), controller.create);

router.patch("/update/:roleId", requirePermission("roles_edit"), controller.update);

router.patch(
  "/delete/:roleId",
  requirePermission("roles_delete"),
  controller.softDelete,
);

export default router;
