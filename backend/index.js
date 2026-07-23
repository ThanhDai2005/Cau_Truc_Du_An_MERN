import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connect from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { initSocket } from "./socket/index.js";
import { adminV1Routes } from "./api/v1/admin/routes/index.route.js";
import { clientV1Routes } from "./api/v1/client/routes/index.route.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiLimiter);

const server = createServer(app);
initSocket(server);

adminV1Routes(app);
clientV1Routes(app);

connect().then(() => {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
