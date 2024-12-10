const Message = require("../models/Message");
const { StatusCodes } = require("http-status-codes");

const createMessage = async (req, res) => {
  const message = await Message.create(req.body);

  // Emit the new message to all connected clients
  req.io.emit("receiveMessage", message);

  res.status(StatusCodes.CREATED).json({ msg: "Message created", message });
};

const getMessage = async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Message not found" });
  }
  res.status(StatusCodes.OK).json({ msg: "Get Single Message", message });
};

const getAllMessages = async (req, res) => {
  const messages = await Message.find();
  res.status(StatusCodes.OK).json({ msg: "Get All Messages", messages });
};

const updateMessage = async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!message) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Message not found" });
  }

  // Emit the updated message to all connected clients
  req.io.emit("receiveMessage", message);

  res.status(StatusCodes.OK).json({ msg: "Message updated", message });
};

const deleteMessage = async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Message not found" });
  }
  res.status(StatusCodes.OK).json({ msg: "Message deleted" });
};

const getMessageHistory = async (req, res) => {
  const { user1, user2 } = req.query; // Use req.query instead of req.params

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

    const documentId = messages.length > 0 ? messages[0].documentId : null; // Assuming you have a documentId in your messages

    res.status(StatusCodes.OK).json({
      msg: "Message history retrieved",
      messages,
      documentId,
    });
  } catch (error) {
    console.error("Error retrieving message history:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error retrieving message history" });
  }
};

module.exports = {
  createMessage,
  updateMessage,
  getMessage,
  getAllMessages,
  deleteMessage,
  getMessageHistory,
};
