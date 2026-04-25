import User from "../../../../models/user.model.js";
import Role from "../../../../models/role.model.js";
import bcrypt from "bcrypt";

// [GET] /api/v1/admin/users
export const list = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      deleted: false,
    };

    if (keyword) {
      filter.$or = [
        { displayName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    const [data, totalItems] = await Promise.all([
      User.find(filter)
        .populate("roleId", "title")
        .select("-hashedPassword")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách tài khoản thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list user", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/users
export const create = async (req, res) => {
  try {
    const { displayName, email, phone, password, roleId, status, address } =
      req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc",
      });
    }

    const existedEmail = await User.findOne({ email: email });
    if (existedEmail) {
      return res.status(409).json({
        message: "Email đã tồn tại",
      });
    }

    if (phone) {
      const existedPhone = await User.findOne({ phone: phone });
      if (existedPhone) {
        return res.status(409).json({
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    if (roleId) {
      const existedRole = await Role.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!existedRole) {
        return res.status(404).json({
          message: "Vai trò không tồn tại",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      displayName: displayName,
      email: email,
      phone: phone || "",
      hashedPassword: hashedPassword,
      roleId: roleId || null,
      status: status || "active",
      address: address || "",
    });

    const userData = await User.findById(createdUser._id)
      .populate("roleId", "title")
      .select("-hashedPassword");

    res.status(201).json({
      message: "Tạo tài khoản thành công",
      data: userData,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create user", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/users/:id
export const update = async (req, res) => {
  try {
    const userId = req.params.id;
    const { displayName, email, phone, password, roleId, status, address } =
      req.body;

    const existedUser = await User.findOne({
      _id: userId,
      deleted: false,
    });

    if (!existedUser) {
      return res.status(404).json({
        message: "Tài khoản không tồn tại",
      });
    }

    if (email) {
      const duplicateEmail = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (duplicateEmail) {
        return res.status(409).json({
          message: "Email đã tồn tại",
        });
      }
    }

    if (phone) {
      const duplicatePhone = await User.findOne({
        phone: phone,
        _id: { $ne: userId },
      });
      if (duplicatePhone) {
        return res.status(409).json({
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    if (roleId) {
      const existedRole = await Role.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!existedRole) {
        return res.status(404).json({
          message: "Vai trò không tồn tại",
        });
      }
    }

    const updateData = {};
    if (displayName != undefined) updateData.displayName = displayName;
    if (email != undefined) updateData.email = email;
    if (phone != undefined) updateData.phone = phone;
    if (password != undefined) {
      updateData.hashedPassword = await bcrypt.hash(password, 10);
    }
    if (roleId != undefined) updateData.roleId = roleId;
    if (status != undefined) updateData.status = status;
    if (address != undefined) updateData.address = address;

    await User.findByIdAndUpdate(userId, updateData);

    const updatedUser = await User.findById(userId)
      .populate("roleId", "title")
      .select("-hashedPassword");

    res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update user", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [DELETE] /api/v1/admin/users/:id
export const softDelete = async (req, res) => {
  try {
    const userId = req.params.id;

    const existedUser = await User.findOne({
      _id: userId,
      deleted: false,
    });

    if (!existedUser) {
      return res.status(404).json({
        message: "Tài khoản không tồn tại",
      });
    }

    await User.updateOne(
      { _id: userId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete user", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
