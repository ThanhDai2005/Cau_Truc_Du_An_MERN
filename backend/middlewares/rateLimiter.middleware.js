import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 10, // Giới hạn 10 requests mỗi 5 phút
  message: {
    message: "Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 5 phút",
  },
  standardHeaders: true, // Trả về rate limit info trong `RateLimit-*` headers
  legacyHeaders: false, // Tắt `X-RateLimit-*` headers
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100, // Giới hạn 100 requests mỗi phút
  message: {
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 5, // Cho phép thử 5 lần (gửi tối đa 5 mail/mã OTP trong 10 phút)
  message: { message: "Yêu cầu quá nhanh, vui lòng thử lại sau 10 phút" },
  standardHeaders: true,
  legacyHeaders: false,
});
