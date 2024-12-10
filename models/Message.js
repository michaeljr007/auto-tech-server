const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "No message content"],
    },
    sender: {
      type: String,
      required: [true, "sender ID required"],
      maxlength: [70, "Name too long"],
    },
    receiver: {
      type: String,
      required: [true, "receiver ID required"],
      maxlength: [70, "Name too long"],
    },
    receiverName: {
      type: String,
      required: [true, "receiver name required"],
      maxlength: [70, "Name too long"],
    },
    senderName: {
      type: String,
      required: [true, "sender name required"],
      maxlength: [70, "Name too long"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
