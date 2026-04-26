import Product from "../../../../models/product.model.js";
import Category from "../../../../models/category.model.js";
import slugify from "slugify";

// [GET] /api/v1/admin/product
export const list = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const categorySlug = req.query.categorySlug;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
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

      filter.categoryId = category._id;
    }

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    const [data, totalItems] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách product thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list product", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/product
export const create = async (req, res) => {
  try {
    const {
      name,
      description,
      ingredients,
      category,
      price,
      images,
      stock,
      status,
    } = req.body;

    if (!name || !description || !ingredients || !category || !price) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc",
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock không hợp lệ",
      });
    }

    const existedCategory = await Category.findOne({
      _id: category,
      deleted: false,
    });
    if (!existedCategory) {
      return res.status(404).json({
        message: "Category không tồn tại",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existedProduct = await Product.findOne({ slug: slug });
    if (existedProduct) {
      return res.status(409).json({
        message: "Slug product đã tồn tại",
      });
    }

    const createdProduct = await Product.create({
      name: name,
      slug: slug,
      description: description,
      ingredients: ingredients,
      categoryId: category,
      price: Number(price),
      images: images || [],
      stock: Number(stock || 0),
      status: status || "active",
    });

    res.status(201).json({
      message: "Tạo product thành công",
      data: createdProduct,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create product", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/product/update/:productId
export const update = async (req, res) => {
  try {
    const productId = req.params.productId;
    const {
      name,
      description,
      ingredients,
      category,
      price,
      images,
      stock,
      status,
    } = req.body;

    if (
      !name &&
      !description &&
      !ingredients &&
      !category &&
      !price &&
      !images &&
      !stock &&
      !status
    ) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật",
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock không hợp lệ",
      });
    }

    const existedProduct = await Product.findOne({
      _id: productId,
      deleted: false,
    });
    if (!existedProduct) {
      return res.status(404).json({
        message: "Product không tồn tại",
      });
    }

    if (category) {
      const existedCategory = await Category.findOne({
        _id: category,
        deleted: false,
      });

      if (!existedCategory) {
        return res.status(404).json({
          message: "Category không tồn tại",
        });
      }
    }

    let slug = existedProduct.slug;
    if (name) {
      slug = slugify(name, { lower: true, strict: true });
      const duplicateSlug = await Product.findOne({
        slug: slug,
        _id: { $ne: productId },
      });
      if (duplicateSlug) {
        return res.status(409).json({
          message: "Slug product đã tồn tại",
        });
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      {
        name: name,
        slug: slug,
        description: description,
        ingredients: ingredients,
        categoryId: category,
        price: price ? Number(price) : existedProduct.price,
        images: images,
        stock: stock ? Number(stock) : existedProduct.stock,
        status: status,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Cập nhật product thành công",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update product", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/product/delete/:productId
export const softDelete = async (req, res) => {
  try {
    const productId = req.params.productId;
    const existedProduct = await Product.findOne({
      _id: productId,
      deleted: false,
    });

    if (!existedProduct) {
      return res.status(404).json({
        message: "Product không tồn tại",
      });
    }

    await Product.updateOne(
      { _id: productId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa product thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete product", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
