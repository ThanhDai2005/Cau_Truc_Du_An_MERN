import Cart from "../../../../models/cart.model.js";

// [GET] /api/v1/cart
export const cart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({
      userId: userId,
    });

    if (!cart) {
      cart = new Cart({
        userId: userId,
      });

      await cart.save();
    }
  } catch (error) {
    console.log("Lỗi khi gọi cart", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
