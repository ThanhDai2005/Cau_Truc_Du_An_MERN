import User from "../../../../models/user.model.js";
import Session from "../../../../models/session.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TIME = "30m";
const REFRESH_TOKEN_TIME = 14 * 24 * 60 * 60 * 1000;

// [POST] /api/v1/admin/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Không thể thiếu username hoặc password",
      });
    }

    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    const correctPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!correctPassword) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    if (user.role != "admin") {
      return res.status(403).json({
        message: "bạn không có quyền truy cập",
      });
    }

    if (user.status != "active") {
      return res.status(403).json({
        message: "tài khoản bạn đã bị khóa",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TIME },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    const session = new Session({
      userId: user._id,
      refreshToken: refreshToken,
      expireAt: new Date(Date.now() + REFRESH_TOKEN_TIME),
    });

    await session.save();

    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TIME,
    });

    res.status(200).json({
      message: "đăng nhập thành công",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log("Lỗi khi gọi login", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/admin/auth/logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.adminRefreshToken;
    if (refreshToken) {
      await Session.deleteOne({ refreshToken: refreshToken });

      res.clearCookie("adminRefreshToken");
    }

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

// [POST] /api/v1/admin/auth/refresh
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Token không tồn tại",
      });
    }

    const session = await Session.findOne({ refreshToken: refreshToken });

    if (!session) {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    if (session.expireAt < new Date()) {
      return res.status(401).json({
        message: "Token đã hết hạn",
      });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TIME },
    );

    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    console.log("Lỗi khi gọi refreshToken", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
