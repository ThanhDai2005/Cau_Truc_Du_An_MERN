import Category from "../../../../models/category.model.js";
import slugify from "slugify";

// [GET] /api/v1/admin/category
export const list = async (req, res) => {
  try {
    const data = await Category.find({ deleted: false }).sort({
      createdAt: -1,
    });
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

// [POST] /api/v1/admin/category
export const create = async (req, res) => {
  try {
    const { name, description, parentCategory, status } = req.body;

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
      parentCategory: parentCategory || null,
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

// [PATCH] /api/v1/admin/category/:id
export const update = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, parentCategory, status } = req.body;

    const existedCategory = await Category.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (!existedCategory) {
      return res.status(404).json({
        message: "Category không tồn tại",
      });
    }

    const updateData = {};

    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      const duplicateSlug = await Category.findOne({
        slug: slug,
        _id: { $ne: categoryId },
      });
      if (duplicateSlug) {
        return res.status(409).json({
          message: "Slug category đã tồn tại",
        });
      }
      updateData.name = name;
      updateData.slug = slug;
    }

    if (description != undefined) updateData.description = description;
    if (parentCategory != undefined) updateData.parentCategory = parentCategory;
    if (status != undefined) updateData.status = status;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      {
        new: true,
      },
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

// [DELETE] /api/v1/admin/category/:id
export const softDelete = async (req, res) => {
  try {
    const categoryId = req.params.id;
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
