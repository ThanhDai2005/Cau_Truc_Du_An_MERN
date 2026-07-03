// [GET] /api/v1/upload
export const upload = (req, res) => {
  try {
    res.status(200).json({
      location: req.body.file,
    });
  } catch (error) {
    console.log("Lỗi khi gọi upload", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
