import express from "express";
const router = express.Router();

import * as controller from "../controllers/role.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/permissions", controller.getPermissions);

router.get("/", requirePermission("roles_view"), controller.list);

router.post("/", requirePermission("roles_create"), controller.create);

router.patch("/:id", requirePermission("roles_edit"), controller.update);

router.delete("/:id", requirePermission("roles_delete"), controller.softDelete);

export default router;
