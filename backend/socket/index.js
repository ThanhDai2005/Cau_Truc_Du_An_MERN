import { Server } from "socket.io";
import {
  adminSocketAuth,
  clientSocketAuth,
} from "../middlewares/socket.middleware.js";
import { handleClientChat, handleAdminChat } from "./chat.handler.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // 1. Phân luồng cho Admin Namespace (/admin)
  const adminNamespace = io.of("/admin");
  adminNamespace.use(adminSocketAuth);
  adminNamespace.on("connection", (socket) => {
    const user = socket.user;
    console.log(`[ADMIN] ${user.displayName} online: ${socket.id}`);

    // Xử lý chat admin
    handleAdminChat(io, socket);

    socket.on("disconnect", () => {
      console.log("[ADMIN] disconnected:", socket.id);
    });
  });

  // 2. Phân luồng cho Client Namespace (Mặc định /)
  const clientNamespace = io.of("/");
  clientNamespace.use(clientSocketAuth);
  clientNamespace.on("connection", (socket) => {
    const user = socket.user;
    const isGuest = socket.isGuest ? "(Khách vãng lai)" : "(Thành viên)";
    console.log(`[CLIENT] ${user.displayName} ${isGuest} online: ${socket.id}`);

    // Xử lý chat client
    handleClientChat(io, socket);

    socket.on("disconnect", () => {
      console.log("[CLIENT] disconnected:", socket.id);
    });
  });

  return io;
};

export { io };
