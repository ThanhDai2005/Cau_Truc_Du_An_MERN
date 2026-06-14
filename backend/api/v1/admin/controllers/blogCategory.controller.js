import BlogCategory from "../../../../models/blogCategory.model.js";
import Blog from "../../../../models/blog.model.js";
import slugify from "slugify";

// [GET] /api/v1/admin/blog-category
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
      BlogCategory.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BlogCategory.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách blog category thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list blog category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/blog-category
export const create = async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Tên blog category là bắt buộc",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existedBlogCategory = await BlogCategory.findOne({ slug: slug });
    if (existedBlogCategory) {
      return res.status(409).json({
        message: "Slug blog category đã tồn tại",
      });
    }

    const createdBlogCategory = await BlogCategory.create({
      name: name,
      slug: slug,
      status: status || "active",
    });

    res.status(201).json({
      message: "Tạo blog category thành công",
      data: createdBlogCategory,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create blog category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/blog-category/update/:blogCategoryId
export const update = async (req, res) => {
  try {
    const blogCategoryId = req.params.blogCategoryId;
    const { name, status } = req.body;

    if (!name && !status) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const existedBlogCategory = await BlogCategory.findOne({
      _id: blogCategoryId,
      deleted: false,
    });
    if (!existedBlogCategory) {
      return res.status(404).json({
        message: "Blog category không tồn tại",
      });
    }

    let slug = existedBlogCategory.slug;
    if (name) {
      slug = slugify(name, { lower: true, strict: true });
      const duplicateSlug = await BlogCategory.findOne({
        slug: slug,
        _id: { $ne: blogCategoryId },
      });
      if (duplicateSlug) {
        return res.status(409).json({
          message: "Slug blog category đã tồn tại",
        });
      }
    }

    const updatedBlogCategory = await BlogCategory.findOneAndUpdate(
      { _id: blogCategoryId },
      {
        name: name,
        slug: slug,
        status: status,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Cập nhật blog category thành công",
      data: updatedBlogCategory,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update blog category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/blog-category/delete/:blogCategoryId
export const softDelete = async (req, res) => {
  try {
    const blogCategoryId = req.params.blogCategoryId;
    const existedBlogCategory = await BlogCategory.findOne({
      _id: blogCategoryId,
      deleted: false,
    });

    if (!existedBlogCategory) {
      return res.status(404).json({
        message: "Blog category không tồn tại",
      });
    }

    await BlogCategory.updateOne(
      { _id: blogCategoryId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    await Blog.updateMany(
      { blogCategoryId: blogCategoryId, deleted: false },
      { blogCategoryId: null },
    );

    res.status(200).json({
      message: "Xóa blog category thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete blog category", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
