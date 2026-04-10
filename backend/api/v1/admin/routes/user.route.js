import express from "express";
const router = express.Router();

import * as controller from "../controllers/user.controller.js";

router.get("/", controller.user);

export default router;
