import Order from "../../../../models/order.model.js";

// [GET] /api/v1/admin/order
export const list = async (req, res) => {
  try {
    const data = await Order.find({})
      .populate("userId", "displayName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi gọi list order admin", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/order/:id
export const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus, paymentStatus } = req.body;

    const existedOrder = await Order.findById(orderId);
    if (!existedOrder) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    const updateData = {};
    if (orderStatus != undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus != undefined) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: updatedOrder,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update status order admin", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
