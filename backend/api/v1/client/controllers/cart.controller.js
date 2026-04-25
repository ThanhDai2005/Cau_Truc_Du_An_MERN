import Cart from "../../../../models/cart.model.js";
import Product from "../../../../models/product.model.js";

// [GET] /api/v1/cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({
      userId: userId,
    }).populate("items.productId");

    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [],
      });

      await cart.save();
    }

    res.status(200).json({
      cart: cart,
    });
  } catch (error) {
    console.log("Lỗi khi gọi cart", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/cart/add
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Thiếu thông tin sản phẩm hoặc số lượng",
      });
    }

    const product = await Product.findOne({
      _id: productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() == productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    await cart.save();

    cart = await Cart.findOne({ _id: cart._id }).populate("items.productId");

    res.status(200).json({
      message: "Thêm vào giỏ hàng thành công",
      cart: cart,
    });
  } catch (error) {
    console.log("Lỗi khi thêm vào giỏ hàng", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/cart/update
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Thiếu thông tin sản phẩm hoặc số lượng",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Số lượng phải lớn hơn 0",
      });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() == productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Sản phẩm không có trong giỏ hàng",
      });
    }

    item.quantity = quantity;
    await cart.save();

    cart = await Cart.findOne({ _id: cart._id }).populate("items.productId");

    res.status(200).json({
      message: "Cập nhật số lượng thành công",
      cart: cart,
    });
  } catch (error) {
    console.log("Lỗi khi cập nhật số lượng", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/cart/remove
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({
        message: "Thiếu thông tin sản phẩm",
      });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại",
      });
    }

    cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: productId } } },
      { new: true },
    ).populate("items.productId");

    res.status(200).json({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      cart: cart,
    });
  } catch (error) {
    console.log("Lỗi khi xóa sản phẩm khỏi giỏ hàng", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
