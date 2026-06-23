import Order from "../../../../models/order.model.js";
import Product from "../../../../models/product.model.js";
import Promotion from "../../../../models/promotion.model.js";
import Cart from "../../../../models/cart.model.js";
import Review from "../../../../models/review.model.js";
import axios from "axios";
import crypto from "crypto";

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
        status: "active",
        deleted: false,
      });

      if (!product) {
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

    // Atomic stock deduction - prevent race condition
    const stockUpdates = [];
    for (const item of normalizedItems) {
      const updateResult = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity },
          deleted: false,
          status: "active",
        },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!updateResult) {
        // Rollback previous stock changes
        for (const rollbackItem of stockUpdates) {
          await Product.updateOne(
            { _id: rollbackItem.productId },
            { $inc: { stock: rollbackItem.quantity } },
          );
        }

        return res.status(409).json({
          message: `Sản phẩm không đủ tồn kho (có thể đã được mua bởi người khác)`,
        });
      }

      stockUpdates.push(item);
    }

    const createdOrder = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
      shippingAddress: {
        recipient: shippingAddress.recipient,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
      },
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "Pending", // Mặc định chờ xử lý
      orderStatus: "Pending", // Mặc định chờ xử lý
      shippingFee: shippingFeeValue,
      promotionId: promotionId || null,
      discountAmount: discountAmountValue,
      totalAmount: totalAmount,
    });

    // Re-validate and update promotion if applied
    if (promotionId) {
      const now = new Date();
      const promotion = await Promotion.findOne({
        _id: promotionId,
        deleted: false,
        status: "active",
        startDate: { $lte: now },
        endDate: { $gte: now },
      });

      if (!promotion) {
        // Rollback stock changes
        for (const item of stockUpdates) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
          );
        }
        return res.status(400).json({
          message: "Mã khuyến mãi không còn hợp lệ",
        });
      }

      // Check if user already used this promotion
      if (
        promotion.usersUsed.some(
          (uid) => uid.toString() === req.user._id.toString(),
        )
      ) {
        // Rollback stock changes
        for (const item of stockUpdates) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
          );
        }
        return res.status(400).json({
          message: "Bạn đã sử dụng mã khuyến mãi này rồi",
        });
      }

      // Check usage limit
      if (
        promotion.usageLimit != null &&
        promotion.usedCount >= promotion.usageLimit
      ) {
        // Rollback stock changes
        for (const item of stockUpdates) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
          );
        }
        return res.status(400).json({
          message: "Mã khuyến mãi đã hết lượt sử dụng",
        });
      }

      // Atomic promotion update
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

    if (paymentMethod === "MOMO") {
      const partnerCode = "MOMO";
      const accessKey = "F8BBA842ECF85";
      const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const requestId = partnerCode + new Date().getTime();
      const orderId = createdOrder._id.toString();

      const orderInfo = `Thanh toan don hang #${orderId}`;

      const redirectUrl = `${process.env.CLIENT_URL}/order-success/${createdOrder._id.toString()}`;
      const ipnUrl = "http://localhost:3000/api/v1/order/momo-callback";
      const amount = totalAmount;
      const requestType = "payWithMethod";
      const extraData = "";

      const rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

      const signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: "vi",
      });

      try {
        const momoResponse = await axios.post(
          `https://test-payment.momo.vn/v2/gateway/api/create`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(requestBody),
            },
          },
        );

        if (momoResponse.data && momoResponse.data.payUrl) {
          return res.status(201).json({
            message: "Tạo đơn hàng thành công, đang chuyển hướng sang MoMo...",
            data: populatedOrder,
            paymentUrl: momoResponse.data.payUrl,
          });
        }
      } catch (error) {
        console.error("Lỗi kết nối cổng MoMo:", error);
      }
    }

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

// [POST] /api/v1/order/momo-callback
export const momoCallback = async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const accessKey = "F8BBA842ECF85";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const calculatedSignature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    if (calculatedSignature !== signature) {
      console.error("CẢNH BÁO BẢO MẬT: Chữ ký MoMo IPN không hợp lệ!");
      return res.status(400).json({ message: "Sai chữ ký bảo mật" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`MoMo IPN: Không tìm thấy đơn hàng ID ${orderId}`);
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.paymentStatus !== "Pending") {
      return res
        .status(200)
        .json({ message: "Đơn hàng đã được xử lý từ trước" });
    }

    if (resultCode === 0) {
      await Order.updateOne(
        { _id: orderId },
        {
          paymentStatus: "Paid",
          orderStatus: "Processing",
        },
      );
      console.log(`MoMo IPN: Đơn hàng ${orderId} đã thanh toán THÀNH CÔNG.`);
    } else {
      await Order.updateOne(
        { _id: orderId },
        {
          paymentStatus: "Failed",
        },
      );
      console.log(`MoMo IPN: Đơn hàng ${orderId} thanh toán THẤT BẠI`);
    }

    return res.status(200).json({ message: "Đã xác nhận IPN" });
  } catch (error) {
    console.error("Lỗi khi xử lý MoMo IPN Callback:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xử lý IPN" });
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
      r.productId.toString(),
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
