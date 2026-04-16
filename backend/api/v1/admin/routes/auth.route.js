import express from "express";
const router = express.Router();

import * as controller from "../controllers/auth.controller.js";

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.post("/refresh", controller.refreshToken);

export default router;
