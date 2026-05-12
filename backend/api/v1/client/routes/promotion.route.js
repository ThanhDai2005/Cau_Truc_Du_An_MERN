import express from "express";
const router = express.Router();

import * as controller from "../controllers/promotion.controller.js";

router.post("/apply", controller.apply);

export default router;
