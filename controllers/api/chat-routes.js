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
  console.log("partnerId", partnerId, "userId", userId);
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
  console.log("chat", chat);
  res.json(chat);
});

router.post("/:partnerId", async (req, res) => {
  const userId = req.session.userId;
  const { chat, partnerId, message, push } = req.body;
  const chatId = [userId, partnerId].sort().join('');
  console.log("chat", typeof chat);
  console.log("userId", userId, "partnerId", partnerId, "push", push);
  const oldChat = await Chat.findOne({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
  });
  console.log("oldChat", oldChat);
  if (!oldChat) {
    console.log("creating chat");
    const newChat = await Chat.create({
      user_id: userId,
      partner_id: partnerId,
      chat,
    },
      {returning: true}
    );
    console.log("newChat", newChat);
  } else {
    console.log("updating chat");
    const updatedChat = await Chat.update(
      { chat },
      { where: { user_id: userId, partner_id: partnerId }, returning: true }
      
    );
    console.log('updatedChat', updatedChat);
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
      // { socketId }
    );
  }
  res.json(chat);
});

module.exports = router;
