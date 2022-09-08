const app = require("express").Router();
const { Octokit } = require("@octokit/rest");
//const { Sequelize } = require("sequelize");

const octokit = new Octokit({
  auth: process.env.GitHub_Key,
});

require("dotenv").config();
//our rate limit for these requests with octokit is either 1,000/hour or 5,000/hour, I'm honestly not sure
//Get a backup API key as well for presentation day

//TO DO: write a function that grabs the github username from a random (or specified, for profile pages) registered user
let name = "MustyBraid";

function contributionFilter(event) {
  if (
    event.type == "PullRequestReviewEvent" ||
    "PushEvent" ||
    "ReleaseEvent" ||
    "CreateEvent"
  ) {
    return true;
  }
  return false;
}

function uniqueFilter(event) {
  let urls = []; //this will be an array of unique urls
  let goodEvents = []; //this will be an array of the event objects containing those unique lists, so we can pull more data from them
  for (let i = 0; i < event.length; i++) {
    if (!urls.includes(event[i].repo.url)) {
      urls.push(event[i].repo.url);
      goodEvents.push(event[i]);
    }
    //find unique urls, append them to the urls array, and append the corresponding objects at index i to the goodEvents array
    //It's just now occurring to me that we can probably just take the first goodEvent for the main page,
    //but this code will be necessary for the profile page implementation
  }
  return [urls, goodEvents];
}

const request = async () => {
  let { data: publicEvents } = await octokit.request(
    "GET /users/{username}/events/public",
    {
      username: name,
      per_page: 10,
    }
  );
  publicEvents = publicEvents.filter(contributionFilter);
  publicEvents = uniqueFilter(publicEvents);
  console.log(publicEvents[0]); //This is a little weird, but just use index 0 or 1 to choose what we want to interact with.
  return publicEvents;
};

request();

//TO DO: append the results from request to an array, and write those values into the html.
//This will need logic to make sure we get at least 5 unique repositories, we may need to make calls for more than 5 users to do this
