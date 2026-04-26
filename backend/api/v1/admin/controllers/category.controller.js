import Category from "../../../../models/category.model.js";
import slugify from "slugify";

// [GET] /api/v1/admin/category
export const list = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const filter = {
      deleted: false,
      status: "active",
    };

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    const [data, totalItems] = await Promise.all([
      Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Category.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách category thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/category
export const create = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Tên category là bắt buộc",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existedCategory = await Category.findOne({ slug: slug });
    if (existedCategory) {
      return res.status(409).json({
        message: "Slug category đã tồn tại",
      });
    }

    const createdCategory = await Category.create({
      name: name,
      slug: slug,
      description: description || "",
      status: status || "active",
    });

    res.status(201).json({
      message: "Tạo category thành công",
      data: createdCategory,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/category/update/:categoryId
export const update = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name, description, status } = req.body;

    if (!name && !description && !status) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const existedCategory = await Category.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (!existedCategory) {
      return res.status(404).json({
        message: "Category không tồn tại",
      });
    }

    let slug = existedCategory.slug;
    if (name) {
      slug = slugify(name, { lower: true, strict: true });
      const duplicateSlug = await Category.findOne({
        slug: slug,
        _id: { $ne: categoryId },
      });
      if (duplicateSlug) {
        return res.status(409).json({
          message: "Slug category đã tồn tại",
        });
      }
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { categoryId: categoryId },
      {
        name: name,
        slug: slug,
        description: description,
        status: status,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Cập nhật category thành công",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/category/delete/:categoryId
export const softDelete = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const existedCategory = await Category.findOne({
      _id: categoryId,
      deleted: false,
    });

    if (!existedCategory) {
      return res.status(404).json({
        message: "Category không tồn tại",
      });
    }

    await Category.updateOne(
      { _id: categoryId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa category thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
