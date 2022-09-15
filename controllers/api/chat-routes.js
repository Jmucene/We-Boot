const router = require("express").Router();
const Pusher = require("pusher");
const { User, Chat } = require("../../models");

const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  encrypted: true,
});

router.get("/:partnerId", async (req, res) => {
  const partnerId = Number(req.params.partnerId);
  const userId = req.session.userId;
  let chat = await Chat.findOne({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
    raw: true,
  });
  chat = chat || { partnerName: "" };
  const partner = await User.findByPk(partnerId, { raw: true });
  chat.partnerName = partner.name;
  res.json(chat);
});

router.post("/:partnerId", async (req, res) => {
  const userId = req.session.userId;
  let { chat, partnerId, message, push, socketId } = req.body;
  const chatId = [userId, partnerId].sort().join('');
  socketId = Number(socketId);
  const oldChat = await Chat.findOne({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
  });
  if (!oldChat) {
    console.log("creating chat");
    const newChat = await Chat.create({
      user_id: userId,
      partner_id: partnerId,
      chat,
    },
      {returning: true}
    );
  } else {
    console.log("updating chat");
    const updatedChat = await Chat.update(
      { chat },
      { where: { user_id: userId, partner_id: partnerId }, returning: true }
      
    );
  }
  if (push) {
    pusher.trigger(
      "We-Boot",
      `chat-${chatId}`,
      {
        userId: partnerId,
        partnerId: userId,
        message,
      },
      { socketId }
    );
  }
  res.json(chat);
});

module.exports = router;
