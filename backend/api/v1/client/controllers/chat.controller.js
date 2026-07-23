import Conversation from "../../../../models/conversation.model.js";
import Message from "../../../../models/message.model.js";

// [GET] /api/v1/chat/conversations
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      userId,
      status: { $ne: "closed" },
    })
      .sort({ lastMessageAt: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      message: "Lấy danh sách cuộc hội thoại thành công",
      data: conversations.map((c) => ({
        _id: c._id,
        status: c.status,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        unreadByClient: c.unreadByClient,
      })),
    });
  } catch (error) {
    console.log("Lỗi khi lấy conversations của client:", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/chat/conversations/:conversationId/messages
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Cuộc hội thoại không tồn tại",
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.status(200).json({
      message: "Lấy tin nhắn thành công",
      data: messages.map((m) => ({
        _id: m._id,
        content: m.content,
        senderType: m.senderType,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.log("Lỗi khi lấy messages:", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
