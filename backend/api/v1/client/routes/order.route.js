import express from "express";
const router = express.Router();

import * as controller from "../controllers/order.controller.js";

router.post("/", controller.create);
router.get("/my", controller.myOrders);

export default router;
