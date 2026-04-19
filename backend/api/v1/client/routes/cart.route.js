import express from "express";
const router = express.Router();

import * as controller from "../controllers/cart.controller.js";

router.get("/", controller.cart);

export default router;
