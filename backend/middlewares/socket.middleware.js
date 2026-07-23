import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyToken = async (socket) => {
  const token = socket.handshake.auth?.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      status: "active",
      deleted: false,
    })
      .select("-hashedPassword")
      .populate("roleId");

    return user || null;
  } catch (error) {
    return null;
  }
};

// 1. MIDDLEWARE CHO CLIENT NAMESPACE (/)
export const clientSocketAuth = async (socket, next) => {
  const user = await verifyToken(socket);

  if (user) {
    socket.user = user;
    socket.isGuest = false;
    return next();
  }

  const { guestName, guestPhone } = socket.handshake.query || {};

  if (!guestName || !guestPhone) {
    return next(
      new Error("Vui lòng nhập đầy đủ Tên và Số điện thoại trước khi chat"),
    );
  }

  socket.user = { displayName: guestName, phone: guestPhone };
  socket.isGuest = true;
  next();
};

// 2. MIDDLEWARE CHO ADMIN NAMESPACE (/admin)
export const adminSocketAuth = async (socket, next) => {
  const user = await verifyToken(socket);

  if (!user) {
    return next(new Error("Unauthorized - Token không hợp lệ hoặc đã hết hạn"));
  }

  const permissions = user.roleId?.permissions || [];
  if (!permissions.includes("chats_view")) {
    return next(new Error("Forbidden - Không có quyền truy cập quản lý chat"));
  }

  socket.user = user;
  next();
};
