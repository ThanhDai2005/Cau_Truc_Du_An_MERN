// [GET] /admin/user
export const user = (req, res) => {
  try {
    res.status(200).json({
      message: "giao diện quản lý user",
    });
  } catch (error) {
    console.log("Lỗi khi gọi user", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
