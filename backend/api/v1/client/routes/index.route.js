import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import categoryRoute from "./category.route.js";
import productRoute from "./product.route.js";
import orderRoute from "./order.route.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const clientV1Routes = (app) => {
  const version = "/api/v1";

  app.use(version + "/auth", authRoute);

  app.use(version + "/user", requireAuth, userRoute);

  app.use(version + "/category", categoryRoute);

  app.use(version + "/product", productRoute);

  app.use(version + "/order", requireAuth, orderRoute);
};
