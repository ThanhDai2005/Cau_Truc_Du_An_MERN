import Order from "../../../../models/order.model.js";
import Product from "../../../../models/product.model.js";

// [POST] /api/v1/order
export const create = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, shippingFee } = req.body;

    if (!items || !Array.isArray(items) || items.length == 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        message: "Thông tin địa chỉ giao hàng không hợp lệ",
      });
    }

    const normalizedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: "Dữ liệu sản phẩm trong đơn hàng không hợp lệ",
        });
      }

      const product = await Product.findOne({
        _id: item.product,
        deleted: false,
      });

      if (!product || product.status != "active") {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} không đủ tồn kho`,
        });
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      normalizedItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: Number(product.price || 0),
      });
    }

    const shippingFeeValue = Number(shippingFee || 0);
    const totalAmount = subtotal + shippingFeeValue;

    const createdOrder = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod || "COD",
      shippingFee: shippingFeeValue,
      totalAmount: totalAmount,
    });

    for (const item of normalizedItems) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } },
      );
    }

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      data: createdOrder,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create order", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/order/my
export const myOrders = async (req, res) => {
  try {
    const data = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi gọi myOrders", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
