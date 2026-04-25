import Role from "../../../models/role.model.js";

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user.roleId._id) {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập",
        });
      }

      const role = await Role.findOne({
        _id: user.roleId._id,
        deleted: false,
      });

      if (!role) {
        return res.status(403).json({
          message: "Vai trò không tồn tại hoặc đã bị vô hiệu hóa",
        });
      }

      if (!role.permissions.includes(permission)) {
        return res.status(403).json({
          message: "Bạn không có quyền thực hiện hành động này",
        });
      }

      next();
    } catch (error) {
      console.log("Lỗi khi kiểm tra quyền", error);
      res.status(500).json({
        message: "Lỗi hệ thống",
      });
    }
  };
};

export const requireAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Chưa đăng nhập",
        });
      }

      const user = req.user;

      if (!user.roleId) {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập",
        });
      }

      const role = await Role.findOne({
        _id: user.roleId,
        deleted: false,
        status: "active",
      });

      if (!role) {
        return res.status(403).json({
          message: "Vai trò không tồn tại hoặc đã bị vô hiệu hóa",
        });
      }

      const hasPermission = permissions.some((permission) =>
        role.permissions.includes(permission),
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Bạn không có quyền thực hiện hành động này",
        });
      }

      next();
    } catch (error) {
      console.log("Lỗi khi kiểm tra quyền", error);
      res.status(500).json({
        message: "Lỗi hệ thống",
      });
    }
  };
};
