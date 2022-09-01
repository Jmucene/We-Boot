const USER = "MustyBraid";
const EMAIL = "elawsomo@gmail.com";
const app = require("express").Router();
require("dotenv").config();

//const github = require("octokat")({ token: process.env.GitHub_Key });

//return github
events = app.get(`https://api.github.com/users/${USER}/events`);
// .then((events) => {
//   let lastCommit;

//   events.some((event) => {
//     return (
//       event.type === "PushEvent" &&
//       event.payload.commits.reverse().some((commit) => {
//         if (commit.author.email === EMAIL) {
//           lastCommit = {
//             repo: event.repo.name,
//             sha: commit.sha,
//             time: new Date(event.createdAt),
//             message: commit.message,
//             url: commit.url,
//           };

//           return true;
//         }

//         return false;
//       })
//     );
//   });

//   return lastCommit;
// });
console.log(events);
