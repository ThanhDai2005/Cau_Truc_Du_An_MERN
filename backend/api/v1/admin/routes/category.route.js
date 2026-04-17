import express from "express";
const router = express.Router();

import * as controller from "../controllers/category.controller.js";

router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.softDelete);

export default router;
