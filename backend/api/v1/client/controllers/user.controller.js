import User from "../../../../models/user.model.js";

// [GET] /api/v1/user/detail
export const getDetail = async (req, res) => {
  try {
    res.status(200).json({
      message: "lấy thông tin thành công",
      user: req.user,
    });
  } catch (error) {
    console.log("Lỗi hệ thống", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/user/uploadAvatar
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.body.avatar) {
      return res.status(400).json({ message: "Không nhận được ảnh!" });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        avatarUrl: req.body.avatar,
      },
      { new: true },
    ).select("avatarUrl");

    res.json({
      message: "Cập nhật avatar thành công",
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.log("Lỗi xảy ra khi upload Avatar", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/user/profile
export const updateInfo = async (req, res) => {
  try {
    const { displayName, email, phone } = req.body;
    const userId = req.user._id;

    if (!displayName || !email || !phone) {
      return res.status(400).json({
        message: "Không thể thiếu displayName, email và phone",
      });
    }

    const existPhone = await User.findOne({
      _id: { $ne: userId },
      phone: phone,
    });

    if (existPhone) {
      return res.status(400).json({
        message: "Số điện thoại đã tồn tại",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        displayName: displayName,
        email: email,
        phone: phone,
      },
      { new: true },
    ).select("-hashedPassword");

    res.json({
      message: "Cập nhật user thành công",
      user: user,
    });
  } catch (error) {
    console.log("Lỗi xảy ra khi updateInfo", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
