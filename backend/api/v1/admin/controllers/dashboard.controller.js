// [GET] /admin/dashboard
export const dashboard = (req, res) => {
  try {
    res.status(200).json({
      message: "giao diện dashboard",
    });
  } catch (error) {
    console.log("Lỗi khi gọi dashboard", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
