const express = require("express");
const { addChannel, fetchChat } = require("../controllers/chatControllers");
const { toLowerCaseMiddleware } = require("../middleware/index");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/add",
  protect,
  toLowerCaseMiddleware(["server", "channel"]),
  addChannel
);

router.get("/fetchChat", protect, toLowerCaseMiddleware(["sever", "channel"]), fetchChat);

module.exports = router;
