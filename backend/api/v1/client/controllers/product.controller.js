import Product from "../../../../models/product.model.js";
import Category from "../../../../models/category.model.js";

// [GET] /api/v1/product
export const list = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const categorySlug = req.query.categorySlug;
    const filter = {
      status: "active",
      deleted: false,
    };

    if (categorySlug) {
      const category = await Category.findOne({
        slug: categorySlug,
        status: "active",
        deleted: false,
      });

      if (!category) {
        return res.status(404).json({
          message: "Category không tồn tại",
        });
      }

      filter.category = category._id;
    }

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    const data = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách product thành công",
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi gọi list product", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/product/:slug
export const detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const data = await Product.findOne({
      slug: slug,
      status: "active",
      deleted: false,
    }).populate("category", "name slug");

    if (!data) {
      return res.status(404).json({
        message: "Product không tồn tại",
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết product thành công",
      data: data,
    });
  } catch (error) {
    console.log("Lỗi khi gọi detail product", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
