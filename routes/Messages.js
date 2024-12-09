const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessage,
  getAllMessages,
  getMessageHistory,
  updateMessage,
  deleteMessage,
} = require("../controllers/Messages");

router.route("/").post(createMessage).get(getAllMessages);
router.route("/history").get(getMessageHistory);
router.route("/:id").get(getMessage).patch(updateMessage).delete(deleteMessage);

module.exports = router;
