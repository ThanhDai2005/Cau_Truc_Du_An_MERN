import Product from "../../../../models/product.model.js";
import Category from "../../../../models/category.model.js";
import slugify from "slugify";

// [GET] /api/v1/admin/product
export const list = async (req, res) => {
  try {
    const data = await Product.find({ deleted: false })
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

// [POST] /api/v1/admin/product
export const create = async (req, res) => {
  try {
    const { name, description, category, price, discount, images, stock, status } = req.body;

    if (!name || !description || !category || !price ) {
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
      category: category,
      price: Number(price),
      discount: discount == null ? null : Number(discount),
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

// [PATCH] /api/v1/admin/product/:id
export const update = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, category, price, discount, images, stock, status } = req.body;

    const existedProduct = await Product.findOne({
      _id: productId,
      deleted: false,
    });
    if (!existedProduct) {
      return res.status(404).json({
        message: "Product không tồn tại",
      });
    }

    if (stock != undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock không hợp lệ",
      });
    }

    if (category != undefined) {
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

    const updateData = {};

    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      const duplicateSlug = await Product.findOne({
        slug: slug,
        _id: { $ne: productId },
      });
      if (duplicateSlug) {
        return res.status(409).json({
          message: "Slug product đã tồn tại",
        });
      }
      updateData.name = name;
      updateData.slug = slug;
    }

    if (description != undefined) updateData.description = description;
    if (category != undefined) updateData.category = category;
    if (price != undefined) updateData.price = Number(price);
    if (discount != undefined) updateData.discount = discount == null ? null : Number(discount);
    if (images != undefined) updateData.images = images;
    if (stock != undefined) updateData.stock = Number(stock);
    if (status != undefined) updateData.status = status;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
      },
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

// [DELETE] /api/v1/admin/product/:id
export const softDelete = async (req, res) => {
  try {
    const productId = req.params.id;
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
