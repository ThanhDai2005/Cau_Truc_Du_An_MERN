import Order from "../../../../models/order.model.js";
import Product from "../../../../models/product.model.js";
import Promotion from "../../../../models/promotion.model.js";
import Cart from "../../../../models/cart.model.js";
import Review from "../../../../models/review.model.js";

// [POST] /api/v1/order
export const create = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      shippingFee,
      promotionId,
      discountAmount,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.recipient ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      return res.status(400).json({
        message: "Thông tin địa chỉ giao hàng không hợp lệ",
      });
    }

    const normalizedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: "Dữ liệu sản phẩm trong đơn hàng không hợp lệ",
        });
      }

      const product = await Product.findOne({
        _id: item.productId,
        deleted: false,
      });

      if (!product || product.status !== "active") {
        return res.status(404).json({
          message: `Sản phẩm không tồn tại hoặc đã ngừng kinh doanh`,
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
        quantity: item.quantity,
        price: Number(product.price || 0),
      });
    }

    const shippingFeeValue = Number(shippingFee || 0);
    const discountAmountValue = Number(discountAmount || 0);
    const totalAmount = subtotal + shippingFeeValue - discountAmountValue;

    const createdOrder = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
      shippingAddress: {
        recipient: shippingAddress.recipient,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
      },
      paymentMethod: paymentMethod || "COD",
      shippingFee: shippingFeeValue,
      promotionId: promotionId || null,
      discountAmount: discountAmountValue,
      totalAmount: totalAmount,
    });

    for (const item of normalizedItems) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } },
      );
    }

    // Update promotion usedCount and usersUsed if promotion was applied
    if (promotionId) {
      await Promotion.updateOne(
        { _id: promotionId },
        {
          $inc: { usedCount: 1 },
          $addToSet: { usersUsed: req.user._id },
        },
      );
    }

    // Clear cart after successful order creation
    await Cart.updateOne({ userId: req.user._id }, { items: [] });

    const populatedOrder = await Order.findOne({ _id: createdOrder._id })
      .populate("userId", "displayName email")
      .populate("items.productId", "name images price");

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      data: populatedOrder,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }

    const [data, totalItems] = await Promise.all([
      Order.find(filter)
        .populate("items.productId", "name images price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi myOrders", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/order/detail/:orderId
export const detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    }).populate("items.productId", "name images price");

    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.log("Lỗi khi gọi detail order", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/order/:orderId/review-status
export const getReviewStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user._id;

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    // Chỉ kiểm tra review cho đơn hàng đã giao
    if (order.orderStatus !== "Delivered") {
      return res.status(200).json({
        message: "Đơn hàng chưa được giao",
        data: {
          hasReviewed: false,
          canReview: false,
        },
      });
    }

    // Lấy danh sách productId trong đơn hàng
    const productIds = order.items.map((item) => item.productId);

    // Kiểm tra xem user đã review tất cả sản phẩm chưa
    const reviewedProducts = await Review.find({
      userId: userId,
      productId: { $in: productIds },
    }).select("productId");

    const reviewedProductIds = reviewedProducts.map((r) =>
      r.productId.toString()
    );
    const hasReviewedAll =
      reviewedProductIds.length === productIds.length &&
      productIds.every((pid) => reviewedProductIds.includes(pid.toString()));

    res.status(200).json({
      message: "Lấy trạng thái đánh giá thành công",
      data: {
        hasReviewed: hasReviewedAll,
        canReview: true,
        totalProducts: productIds.length,
        reviewedCount: reviewedProductIds.length,
      },
    });
  } catch (error) {
    console.log("Lỗi khi gọi getReviewStatus", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/order/:orderId/reviews
export const getOrderReviews = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user._id;

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
    }).populate("items.productId", "name images price");

    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    // Lấy danh sách productId trong đơn hàng
    const productIds = order.items.map((item) => item.productId._id);

    // Lấy tất cả reviews của user cho các sản phẩm trong đơn hàng
    const reviews = await Review.find({
      userId: userId,
      productId: { $in: productIds },
    }).populate("userId", "displayName avatarUrl");

    res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      data: {
        order: order,
        reviews: reviews,
      },
    });
  } catch (error) {
    console.log("Lỗi khi gọi getOrderReviews", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
