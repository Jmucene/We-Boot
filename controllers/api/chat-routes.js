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
  const partnerId = req.params.partnerId;
  const userId = req.session.userId;
  console.log("partnerId", partnerId, "userId", userId);
  const chat = await Chat.findAll({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
  });
  res.json(chat);
})


router.post('/:id', (req, res) => { 
  const id = req.params.id;
  const message = req.body
  console.log('message', message, 'id', id)

  pusher.trigger('We-Boot', `chat-${id}`, message)
  res.send(message)
})

router.put('/:id', async (req, res) => {
  const partnerId = req.params.id;
  const userId = req.session.user_id;
  const chat = req.body;
})
 

module.exports = router;
