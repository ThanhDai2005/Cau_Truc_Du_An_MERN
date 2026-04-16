// [GET] /api/v1/admin/users
export const users = (req, res) => {
  try {
    res.status(200).json({
      message: "giao diện quản lý user",
    });
  } catch (error) {
    console.log("Lỗi khi gọi users", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
