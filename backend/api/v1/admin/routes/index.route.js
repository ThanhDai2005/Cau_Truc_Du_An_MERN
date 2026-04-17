import { requireAuth } from "../middlewares/auth.middleware.js";
import authRoute from "./auth.route.js";
import dashboardRoute from "./dashboard.route.js";
import userRoute from "./user.route.js";
import usersRoute from "./users.route.js";
import categoryRoute from "./category.route.js";
import productRoute from "./product.route.js";
import orderRoute from "./order.route.js";

export const adminV1Routes = (app) => {
  const version = "/api/v1/admin";

  app.use(version + "/auth", authRoute);

  app.use(version + "/dashboard", requireAuth, dashboardRoute);

  app.use(version + "/user", requireAuth, userRoute);

  app.use(version + "/category", requireAuth, categoryRoute);

  app.use(version + "/product", requireAuth, productRoute);

  app.use(version + "/users", requireAuth, usersRoute);

  app.use(version + "/order", requireAuth, orderRoute);
};
