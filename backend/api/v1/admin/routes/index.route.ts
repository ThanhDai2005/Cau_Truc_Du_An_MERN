import { requireAuth } from "../middlewares/auth.middleware.js";
import authRoute from "./auth.route.js";
import dashboardRoute from "./dashboard.route.js";
import userRoute from "./user.route.js";

export const adminV1Routes = (app) => {
  const version = "/api/v1/admin";

  app.use(version + "/auth", authRoute);

  app.use(version + "/dashboard", requireAuth, dashboardRoute);

  app.use(version + "/user", requireAuth, userRoute);
};
