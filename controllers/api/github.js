const app = require("express").Router();
const { Octokit } = require("@octokit/rest");
//const { Sequelize } = require("sequelize");

const octokit = new Octokit({
  auth: process.env.GitHub_Key,
});

require("dotenv").config();
//our rate limit for these requests with octokit is either 1,000/hour or 5,000/hour, I'm honestly not sure

//const github = require("octokat")({ token: process.env.GitHub_Key });

//return github

let username = "MustyBraid"; //this will come from a sequelize query, obviously

async function main() {
  const events = await octokit.request("GET /users/{username}/events/public", {
    username: username,
  });
  console.log(events);
  return events;
}

main();
