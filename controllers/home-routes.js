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

router.get("/", async (req, res) => {
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
router.get("/search", async (req, res) => {
  res.render("search");
});
router.get("/searchName/:name", (req, res) => {
  // Get one alum from the alum table


  User.findOne({
    // Gets the alum based on the name given in the request parameters
    where: {
      name: req.params.name,
    },
  })
    .then((nameData) => {
      res.json(nameData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/searchGithub/:github", (req, res) => {
  // Get one alum from the alum table

  User.findOne({
    // Gets the alum based on the github given in the request parameters
    where: {
      github: req.params.github,
    },
  })
    .then((githubData) => {
      res.json(githubData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
