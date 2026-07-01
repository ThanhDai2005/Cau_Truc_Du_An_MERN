import express from "express";
const router = express.Router();

import * as controller from "../controllers/dashboard.controller.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

router.get("/", requirePermission("dashboard_view"), controller.dashboard);

export default router;
