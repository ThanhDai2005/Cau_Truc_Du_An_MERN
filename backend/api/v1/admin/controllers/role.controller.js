import Role from "../../../../models/role.model.js";

// [GET] /api/v1/admin/role
export const list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      deleted: false,
    };

    const [data, totalItems] = await Promise.all([
      Role.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Role.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách vai trò thành công",
      data: data,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log("Lỗi khi gọi list role", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/role
export const create = async (req, res) => {
  try {
    const { title, description, permissions } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Thiếu tên vai trò",
      });
    }

    const existedRole = await Role.findOne({ title: title });
    if (existedRole) {
      return res.status(409).json({
        message: "Tên vai trò đã tồn tại",
      });
    }

    const createdRole = await Role.create({
      title: title,
      description: description || "",
      permissions: permissions || [],
    });

    res.status(201).json({
      message: "Tạo vai trò thành công",
      data: createdRole,
    });
  } catch (error) {
    console.log("Lỗi khi gọi create role", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/role/update/:roleId
export const update = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const { title, description, permissions } = req.body;

    if (!title && !description && !permissions) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const existedRole = await Role.findOne({
      _id: roleId,
      deleted: false,
    });

    if (!existedRole) {
      return res.status(404).json({
        message: "Vai trò không tồn tại",
      });
    }

    if (title) {
      const duplicateTitle = await Role.findOne({
        title: title,
        _id: { $ne: roleId },
      });
      if (duplicateTitle) {
        return res.status(409).json({
          message: "Tên vai trò đã tồn tại",
        });
      }
    }

    const updatedRole = await Role.findOneAndUpdate(
      { _id: roleId },
      {
        title: title,
        description: description,
        permissions: permissions,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Cập nhật vai trò thành công",
      data: updatedRole,
    });
  } catch (error) {
    console.log("Lỗi khi gọi update role", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/role/delete/:roleId
export const softDelete = async (req, res) => {
  try {
    const roleId = req.params.roleId;

    const existedRole = await Role.findOne({
      _id: roleId,
      deleted: false,
    });

    if (!existedRole) {
      return res.status(404).json({
        message: "Vai trò không tồn tại",
      });
    }

    await Role.updateOne(
      { _id: roleId },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa vai trò thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi delete role", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/admin/role/permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = [
      { group: "Quản lý sản phẩm", value: "products_view", label: "Xem" },
      { group: "Quản lý sản phẩm", value: "products_create", label: "Thêm" },
      { group: "Quản lý sản phẩm", value: "products_edit", label: "Sửa" },
      { group: "Quản lý sản phẩm", value: "products_delete", label: "Xóa" },

      { group: "Quản lý danh mục", value: "categories_view", label: "Xem" },
      { group: "Quản lý danh mục", value: "categories_create", label: "Thêm" },
      { group: "Quản lý danh mục", value: "categories_edit", label: "Sửa" },
      { group: "Quản lý danh mục", value: "categories_delete", label: "Xóa" },

      { group: "Quản lý vai trò", value: "roles_view", label: "Xem" },
      { group: "Quản lý vai trò", value: "roles_create", label: "Thêm" },
      { group: "Quản lý vai trò", value: "roles_edit", label: "Sửa" },
      { group: "Quản lý vai trò", value: "roles_delete", label: "Xóa" },
      {
        group: "Quản lý vai trò",
        value: "roles_permissions",
        label: "Phân quyền",
      },

      { group: "Quản lý tài khoản", value: "accounts_view", label: "Xem" },
      { group: "Quản lý tài khoản", value: "accounts_create", label: "Thêm" },
      { group: "Quản lý tài khoản", value: "accounts_edit", label: "Sửa" },
      { group: "Quản lý tài khoản", value: "accounts_delete", label: "Xóa" },

      { group: "Quản lý đơn hàng", value: "orders_view", label: "Xem" },
      { group: "Quản lý đơn hàng", value: "orders_edit", label: "Sửa" },

      { group: "Quản lý khuyến mãi", value: "promotions_view", label: "Xem" },
      {
        group: "Quản lý khuyến mãi",
        value: "promotions_create",
        label: "Thêm",
      },
      { group: "Quản lý khuyến mãi", value: "promotions_edit", label: "Sửa" },
      { group: "Quản lý khuyến mãi", value: "promotions_delete", label: "Xóa" },
    ];

    res.status(200).json({
      message: "Lấy danh sách quyền thành công",
      data: permissions,
    });
  } catch (error) {
    console.log("Lỗi khi gọi getPermissions", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
