import BlogCategory from "../../../../models/blogCategory.model.js";

// [GET] /api/v1/blog-category
export const list = async (req, res) => {
  try {
    const data = await BlogCategory.find({
      status: "active",
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách blog category thành công",
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi gọi list blog category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
