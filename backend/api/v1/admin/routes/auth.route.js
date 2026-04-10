import express from "express";
const router = express.Router();

import * as controller from "../controllers/login.controller.js";

router.post("/login", controller.login);

router.post("/logout", controller.logout);

export default router;
