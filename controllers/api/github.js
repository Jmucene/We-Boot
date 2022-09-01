const USER = "MustyBraid";
const EMAIL = "elawsomo@gmail.com";
const app = require("express").Router();

require("dotenv").config();

//const github = require("octokat")({ token: process.env.GitHub_Key });

//return github
await octokit.request("GET /repos/{owner}/{repo}/issues", {
  owner: "octocat",
  repo: "hello-world",
  title: "Hello, world!",
  body: "I created this issue using Octokit!",
});
