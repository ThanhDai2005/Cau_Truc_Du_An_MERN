import Category from "../../../../models/category.model.js";

// [GET] /api/v1/category
export const list = async (req, res) => {
  try {
    const data = await Category.find({
      status: "active",
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách category thành công",
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi gọi list category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
