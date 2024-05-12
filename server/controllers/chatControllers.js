const asyncHandler = require("express-async-handler");
const { getAccess } = require("../blockChainApi/index");
const { getChatFallback } = require("./fallback");

const addChannel = asyncHandler(async (req, res) => {
  const { server, channel } = req.body;

  if (!server || !channel) {
    res.status(400);
    throw new Error("Missing Argument");
  }

  const chat = await getChatFallback({ server, channel });

  res.status(200).json({
    chatRoomId: chat._id,
  });
});

const fetchChat = asyncHandler(async (req, res) => {
  const { server, channel } = req.query;
  if (!server || !channel) {
    res.status(400);
    throw new Error("Missing Argument");
  }
  const user = req.user;
  // check for access, owner or joined
  const haveAccess = await getAccess({
    user: user.address,
    server,
    channel,
  });

  if (!haveAccess) {
    res.status(200).json({
      access: false,
      chatRoomId: "",
    });
    return;
  }

  const chat = await getChatFallback({ server, channel });

  res.status(200).json({
    access: true,
    chatRoomId: chat._id,
  });
});

module.exports = { addChannel, fetchChat };
