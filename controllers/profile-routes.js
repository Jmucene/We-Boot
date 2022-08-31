const router = require("express").Router();
const { User } = require("../models");

router.get("/", (req, res) => {res.render("profile")});

module.exports = router;