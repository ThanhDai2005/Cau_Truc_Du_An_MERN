import Promotion from "../../../../models/promotion.model.js";

// [GET] /api/v1/admin/promotion
export const list = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      deleted: false,
    };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { code: { $regex: keyword, $options: "i" } },
      ];
    }

    const [data, totalItems] = await Promise.all([
      Promotion.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Promotion.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách khuyến mãi thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list promotion", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/promotion
export const create = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      usageLimit,
      startDate,
      endDate,
      status,
    } = req.body;

    if (
      !title ||
      !code ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc",
      });
    }

    if (
      discountType == "percentage" &&
      (discountValue < 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        message: "Giá trị giảm giá phần trăm phải từ 0 đến 100",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
    }

    const existedCode = await Promotion.findOne({ code: code.toUpperCase() });
    if (existedCode) {
      return res.status(409).json({
        message: "Mã khuyến mãi đã tồn tại",
      });
    }

    const createdPromotion = await Promotion.create({
      title: title,
      code: code.toUpperCase(),
      description: description || "",
      discountType: discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue || 0),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || "active",
    });

    res.status(201).json({
      message: "Tạo khuyến mãi thành công",
      data: createdPromotion,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create promotion", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/promotion/update/:promotionId
export const update = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;
    const {
      title,
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      usageLimit,
      startDate,
      endDate,
      status,
    } = req.body;

    if (
      !title &&
      !code &&
      !description &&
      !discountType &&
      !discountValue &&
      !minOrderValue &&
      !maxDiscountAmount &&
      !usageLimit &&
      !startDate &&
      !endDate &&
      !status
    ) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const existedPromotion = await Promotion.findOne({
      _id: promotionId,
      deleted: false,
    });

    if (!existedPromotion) {
      return res.status(404).json({
        message: "Khuyến mãi không tồn tại",
      });
    }

    if (code) {
      const duplicateCode = await Promotion.findOne({
        code: code.toUpperCase(),
        _id: { $ne: promotionId },
      });
      if (duplicateCode) {
        return res.status(409).json({
          message: "Mã khuyến mãi đã tồn tại",
        });
      }
    }

    if (
      discountType == "percentage" &&
      discountValue &&
      (discountValue < 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        message: "Giá trị giảm giá phần trăm phải từ 0 đến 100",
      });
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
    }

    const updatedPromotion = await Promotion.findOneAndUpdate(
      { _id: promotionId },
      {
        title: title,
        code: code ? code.toUpperCase() : existedPromotion.code,
        description: description,
        discountType: discountType,
        discountValue: discountValue
          ? Number(discountValue)
          : existedPromotion.discountValue,
        minOrderValue: minOrderValue
          ? Number(minOrderValue)
          : existedPromotion.minOrderValue,
        maxDiscountAmount: maxDiscountAmount
          ? Number(maxDiscountAmount)
          : existedPromotion.maxDiscountAmount,
        usageLimit: usageLimit
          ? Number(usageLimit)
          : existedPromotion.usageLimit,
        startDate: startDate ? new Date(startDate) : existedPromotion.startDate,
        endDate: endDate ? new Date(endDate) : existedPromotion.endDate,
        status: status,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Cập nhật khuyến mãi thành công",
      data: updatedPromotion,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update promotion", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/promotion/delete/:promotionId
export const softDelete = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;

    const existedPromotion = await Promotion.findOne({
      _id: promotionId,
      deleted: false,
    });

    if (!existedPromotion) {
      return res.status(404).json({
        message: "Khuyến mãi không tồn tại",
      });
    }

    await Promotion.updateOne(
      { _id: promotionId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa khuyến mãi thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete promotion", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
