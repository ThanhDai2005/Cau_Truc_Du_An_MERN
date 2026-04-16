// [GET] /api/v1/admin/user/detail
export const getDetail = (req, res) => {
  try {
    res.status(200).json({
      message: "lấy thông tin thành công",
      user: req.user,
    });
  } catch (error) {
    console.log("Lỗi khi gọi getDetail", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
