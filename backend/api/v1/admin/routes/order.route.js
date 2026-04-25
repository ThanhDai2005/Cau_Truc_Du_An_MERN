import express from "express";
const router = express.Router();

import * as controller from "../controllers/order.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("orders_view"), controller.list);

router.patch("/:id", requirePermission("orders_edit"), controller.updateStatus);

export default router;
