import Blog from "../../../../models/blog.model.js";
import BlogCategory from "../../../../models/blogCategory.model.js";
import Product from "../../../../models/product.model.js";
import slugify from "slugify";

// [GET] /api/v1/admin/blog
export const list = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const blogCategorySlug = req.query.blogCategorySlug;
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {
      deleted: false,
    };

    if (status) {
      filter.status = status;
    }

    if (blogCategorySlug) {
      const blogCategory = await BlogCategory.findOne({
        slug: blogCategorySlug,
        status: "active",
        deleted: false,
      });

      if (!blogCategory) {
        return res.status(404).json({
          message: "Blog category không tồn tại",
        });
      }

      filter.blogCategoryId = blogCategory._id;
    }

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    const [data, totalItems] = await Promise.all([
      Blog.find(filter)
        .populate("authorId", "displayName email")
        .populate("blogCategoryId", "name slug")
        .populate("relatedProducts", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách blog thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list blog", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/blog
export const create = async (req, res) => {
  try {
    const {
      title,
      content,
      imageUrl,
      blogCategory,
      featured,
      relatedProducts,
      status,
    } = req.body;

    if (!title || !content || !imageUrl) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc",
      });
    }

    const slug = slugify(title, { lower: true, strict: true });
    const existedBlog = await Blog.findOne({ slug: slug });
    if (existedBlog) {
      return res.status(409).json({
        message: "Slug blog đã tồn tại",
      });
    }

    // Validate blogCategory if provided
    if (blogCategory) {
      const existedBlogCategory = await BlogCategory.findOne({
        _id: blogCategory,
        deleted: false,
      });

      if (!existedBlogCategory) {
        return res.status(404).json({
          message: "Blog category không tồn tại",
        });
      }
    }

    // Validate relatedProducts if provided
    if (relatedProducts && relatedProducts.length > 0) {
      const validProducts = await Product.find({
        _id: { $in: relatedProducts },
        deleted: false,
      });

      if (validProducts.length !== relatedProducts.length) {
        return res.status(404).json({
          message: "Một số sản phẩm không tồn tại",
        });
      }
    }

    const createdBlog = await Blog.create({
      title: title,
      slug: slug,
      content: content,
      imageUrl: imageUrl,
      blogCategoryId: blogCategory || null,
      authorId: req.user._id,
      featured: featured || false,
      relatedProducts: relatedProducts || [],
      status: status || "active",
      publishedAt: status === "active" ? new Date() : null,
    });

    res.status(201).json({
      message: "Tạo blog thành công",
      data: createdBlog,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create blog", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/blog/update/:blogId
export const update = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const {
      title,
      content,
      imageUrl,
      blogCategory,
      featured,
      relatedProducts,
      status,
    } = req.body;

    if (
      !title &&
      !content &&
      !imageUrl &&
      !blogCategory &&
      featured === undefined &&
      !relatedProducts &&
      !status
    ) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const existedBlog = await Blog.findOne({
      _id: blogId,
      deleted: false,
    });
    if (!existedBlog) {
      return res.status(404).json({
        message: "Blog không tồn tại",
      });
    }

    let slug = existedBlog.slug;
    if (title) {
      slug = slugify(title, { lower: true, strict: true });
      const duplicateSlug = await Blog.findOne({
        slug: slug,
        _id: { $ne: blogId },
      });
      if (duplicateSlug) {
        return res.status(409).json({
          message: "Slug blog đã tồn tại",
        });
      }
    }

    // Validate blogCategory if provided
    if (blogCategory) {
      const existedBlogCategory = await BlogCategory.findOne({
        _id: blogCategory,
        deleted: false,
      });

      if (!existedBlogCategory) {
        return res.status(404).json({
          message: "Blog category không tồn tại",
        });
      }
    }

    // Validate relatedProducts if provided
    if (relatedProducts && relatedProducts.length > 0) {
      const validProducts = await Product.find({
        _id: { $in: relatedProducts },
        deleted: false,
      });

      if (validProducts.length !== relatedProducts.length) {
        return res.status(404).json({
          message: "Một số sản phẩm không tồn tại",
        });
      }
    }

    // Set publishedAt if status changes to active
    let publishedAt = existedBlog.publishedAt;
    if (status === "active" && existedBlog.status !== "active") {
      publishedAt = new Date();
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId },
      {
        title: title,
        slug: slug,
        content: content,
        imageUrl: imageUrl,
        blogCategoryId: blogCategory,
        featured: featured,
        relatedProducts: relatedProducts,
        status: status,
        publishedAt: publishedAt,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Cập nhật blog thành công",
      data: updatedBlog,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update blog", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/blog/delete/:blogId
export const softDelete = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const existedBlog = await Blog.findOne({
      _id: blogId,
      deleted: false,
    });

    if (!existedBlog) {
      return res.status(404).json({
        message: "Blog không tồn tại",
      });
    }

    await Blog.updateOne(
      { _id: blogId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa blog thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete blog", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
