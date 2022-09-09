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
  const partnerId = Number(req.params.partnerId)
  const userId = req.session.userId;
  console.log("partnerId", partnerId, "userId", userId);
  const chat = await Chat.findAll({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
  });
  console.log('chat', chat);
  res.json(chat);
})


router.post('/:id', (req, res) => { 
  const id = req.params.id;
  const {chat, partnerId} = req.body
  console.log('chat', chat, 'id', id)
  
  // pusher.trigger('We-Boot', `chat-${id}`, chat)
  res.send(chat)
})

router.put("/:partnerId", async (req, res) => {
  const userId = req.session.userId;
  const { chat, partnerId } = req.body;

  console.log("chat", chat.length, "userId", userId, "partnerId", partnerId);
  Chat.update(chat, { where: { user_id: userId, partner_id: partnerId } });
  const newChat = await Chat.findAll({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
  });
  console.log("newChat", newChat);
  res.json(chat);
});
 

module.exports = router;
