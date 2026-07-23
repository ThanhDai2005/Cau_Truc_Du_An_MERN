import Conversation from "../../../../models/conversation.model.js";
import Message from "../../../../models/message.model.js";

// [GET] /api/v1/admin/chat
export const list = async (req, res) => {
  try {
    const { keyword = "", status = "", page = 1, limit = 20 } = req.query;

    const filter = {
      status: { $in: ["bot", "waiting_human", "human_active"] },
    };

    if (status) {
      filter.status = status;
    }

    // Search by phone or name
    if (keyword) {
      filter.$or = [
        { "guestInfo.name": { $regex: keyword, $options: "i" } },
        { "guestInfo.phone": { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [conversations, total] = await Promise.all([
      Conversation.find(filter)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "displayName phone")
        .populate("assignedStaffId", "displayName")
        .lean(),
      Conversation.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách chat thành công",
      data: conversations.map((c) => ({
        _id: c._id,
        userName: c.userId?.displayName || c.guestInfo?.name || "Khách vãng lai",
        phone: c.userId?.phone || c.guestInfo?.phone || "N/A",
        isGuest: !c.userId,
        status: c.status,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        unreadByAdmin: c.unreadByAdmin,
        assignedStaff: c.assignedStaffId?.displayName || null,
      })),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách chat:", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/admin/chat/:conversationId
export const detail = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate("userId", "displayName phone email")
      .populate("assignedStaffId", "displayName")
      .lean();

    if (!conversation) {
      return res.status(404).json({
        message: "Cuộc hội thoại không tồn tại",
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    res.status(200).json({
      message: "Lấy chi tiết chat thành công",
      data: {
        conversation: {
          _id: conversation._id,
          userName: conversation.userId?.displayName || conversation.guestInfo?.name,
          phone: conversation.userId?.phone || conversation.guestInfo?.phone,
          email: conversation.userId?.email || "N/A",
          isGuest: !conversation.userId,
          status: conversation.status,
          assignedStaff: conversation.assignedStaffId?.displayName || null,
          createdAt: conversation.createdAt,
        },
        messages: messages.map((m) => ({
          _id: m._id,
          content: m.content,
          senderType: m.senderType,
          createdAt: m.createdAt,
        })),
      },
    });
  } catch (error) {
    console.log("Lỗi khi lấy chi tiết chat:", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/admin/chat/:conversationId/close
export const closeConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Cuộc hội thoại không tồn tại",
      });
    }

    conversation.status = "closed";
    await conversation.save();

    res.status(200).json({
      message: "Đóng cuộc hội thoại thành công",
      data: { _id: conversation._id, status: conversation.status },
    });
  } catch (error) {
    console.log("Lỗi khi đóng cuộc hội thoại:", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
