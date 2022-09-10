const router = require("express").Router();
const gitRequest = require("../utils/github.js");
const { User } = require("../models");

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/*", async (req, res) => {
  try {
    const userData = await User.findAll({
      raw: true,
      attributes: { exclude: ["password"] },
      order: [["name", "ASC"]],
    });

    githubList = await gitRequest.homepageList(8);
    githubList = { list: githubList };
    console.log("userData", userData);
    req.session.save(() => {
      if (req.session.countVisit) {
        req.session.countVisit++;
      } else {
        req.session.countVisit = 1;
      }
      res.render("homepage", {
        userData,
        userId: req.session.userId,
        loggedIn: req.session.loggedIn,
        countVisit: req.session.countVisit,
        githubList,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
