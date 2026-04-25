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

// [PATCH] /api/v1/admin/promotion/:id
export const update = async (req, res) => {
  try {
    const promotionId = req.params.id;
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

    const updateData = {};
    if (title != undefined) updateData.title = title;
    if (code != undefined) updateData.code = code.toUpperCase();
    if (description != undefined) updateData.description = description;
    if (discountType != undefined) updateData.discountType = discountType;
    if (discountValue != undefined)
      updateData.discountValue = Number(discountValue);
    if (minOrderValue != undefined)
      updateData.minOrderValue = Number(minOrderValue);
    if (maxDiscountAmount != undefined)
      updateData.maxDiscountAmount = maxDiscountAmount
        ? Number(maxDiscountAmount)
        : null;
    if (usageLimit != undefined)
      updateData.usageLimit = usageLimit ? Number(usageLimit) : null;
    if (startDate != undefined) updateData.startDate = new Date(startDate);
    if (endDate != undefined) updateData.endDate = new Date(endDate);
    if (status != undefined) updateData.status = status;

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      promotionId,
      updateData,
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

// [DELETE] /api/v1/admin/promotion/:id
export const softDelete = async (req, res) => {
  try {
    const promotionId = req.params.id;

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
