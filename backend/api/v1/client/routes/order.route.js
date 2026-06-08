import express from "express";
const router = express.Router();

import * as controller from "../controllers/order.controller.js";

router.post("/", controller.create);
router.get("/my", controller.myOrders);
router.get("/detail/:orderId", controller.detail);
router.get("/:orderId/review-status", controller.getReviewStatus);
router.get("/:orderId/reviews", controller.getOrderReviews);

export default router;
