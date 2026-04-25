import User from "../../../../models/user.model.js";
import Product from "../../../../models/product.model.js";
import Order from "../../../../models/order.model.js";
import Category from "../../../../models/category.model.js";

// [GET] /api/v1/admin/dashboard
export const dashboard = async (req, res) => {
  try {
    // 1. Thống kê tổng quan (4 cards trên cùng)
    const [totalUsers, totalProducts, totalOrders, totalCategories] =
      await Promise.all([
        User.countDocuments({ deleted: false }),
        Product.countDocuments({ deleted: false }),
        Order.countDocuments({}),
        Category.countDocuments({ deleted: false }),
      ]);

    // 2. Thống kê hóa đơn theo trạng thái (biểu đồ tròn)
    const [
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Processing" }),
      Order.countDocuments({ orderStatus: "Shipped" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments({ orderStatus: "Cancelled" }),
    ]);

    const orderStatusData = {
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    };

    // 3. Thống kê doanh thu theo khoảng thời gian (filter)
    const { startDate, endDate } = req.query;

    let revenueStats = {
      totalRevenue: 0,
      totalOrders: 0,
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        paymentStatus: "Paid",
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      let totalRevenue = 0;
      orders.forEach((order) => {
        totalRevenue += order.totalAmount;
      });

      revenueStats = {
        totalRevenue: totalRevenue,
        totalOrders: orders.length,
      };
    }

    res.status(200).json({
      message: "Lấy thống kê dashboard thành công",
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
        },
        orderStatus: orderStatusData,
        revenueByDateRange: revenueStats,
      },
    });
  } catch (error) {
    console.log("Lỗi khi gọi dashboard", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
