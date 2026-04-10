// [POST] /admin/auth/login
export const login = (req, res) => {
  try {
    res.status(200).json({
      message: "đăng nhập thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi login", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /admin/auth/logout
export const logout = (req, res) => {
  try {
    res.status(200).json({
      message: "đăng xuất thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi logout", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
