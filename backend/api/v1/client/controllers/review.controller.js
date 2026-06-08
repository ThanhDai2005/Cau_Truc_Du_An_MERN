import Review from "../../../../models/review.model.js";
import Product from "../../../../models/product.model.js";
import Order from "../../../../models/order.model.js";

// [POST] /api/v1/review
export const create = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment, images } = req.body;

    if (!productId || !rating) {
      return res
        .status(400)
        .json({ message: "Thiếu productId hoặc rating" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating phải từ 1 đến 5" });
    }

    // Validate images array if provided
    if (images && Array.isArray(images) && images.length > 5) {
      return res
        .status(400)
        .json({ message: "Tối đa 5 ảnh cho mỗi đánh giá" });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({
      _id: productId,
      deleted: false,
      status: "active",
    });
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra user đã mua sản phẩm này và đơn hàng đã giao thành công
    const hasPurchased = await Order.findOne({
      userId: userId,
      orderStatus: "Delivered",
      "items.productId": productId,
    });
    if (!hasPurchased) {
      return res.status(403).json({
        message:
          "Bạn chỉ có thể đánh giá sản phẩm đã mua và được giao thành công",
      });
    }

    // Kiểm tra user đã review sản phẩm này chưa
    const existingReview = await Review.findOne({
      userId: userId,
      productId: productId,
    });
    if (existingReview) {
      return res
        .status(409)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    const review = await Review.create({
      productId,
      userId,
      rating: Number(rating),
      comment: comment ? comment.trim() : "",
      images: images || [],
    });

    // Cập nhật averageRating và numReviews trên Product
    const allReviews = await Review.find({ productId: productId });
    const numReviews = allReviews.length;
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await Product.updateOne(
      { _id: productId },
      {
        averageRating: Math.round(averageRating * 10) / 10,
        numReviews: numReviews,
      },
    );

    const populatedReview = await Review.findOne({ _id: review._id }).populate(
      "userId",
      "displayName avatarUrl",
    );

    res.status(201).json({
      message: "Đánh giá sản phẩm thành công",
      data: populatedReview,
    });
  } catch (error) {
    console.log("Lỗi khi tạo review", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// [GET] /api/v1/review/:productId
export const listByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({
      _id: productId,
      deleted: false,
    });
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const [data, totalItems] = await Promise.all([
      Review.find({ productId: productId })
        .populate("userId", "displayName avatarUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ productId: productId }),
    ]);

    res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách review", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
