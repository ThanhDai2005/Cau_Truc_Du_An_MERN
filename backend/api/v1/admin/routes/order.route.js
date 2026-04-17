import express from "express";
const router = express.Router();

import * as controller from "../controllers/order.controller.js";

router.get("/", controller.list);
router.patch("/:id", controller.updateStatus);

export default router;
