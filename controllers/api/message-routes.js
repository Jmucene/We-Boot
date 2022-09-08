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


router.post('/:id', (req, res) => { 
  const id = req.params.id;
  const message = req.body
  console.log('message', message, 'id', id)

  pusher.trigger('We-Boot', `chat-${id}`, message)
  res.send(message)
})

module.exports = router;
