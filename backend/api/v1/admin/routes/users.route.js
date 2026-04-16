import express from "express";
const router = express.Router();

import * as controller from "../controllers/users.controller.js";

router.get("/", controller.users);

export default router;
