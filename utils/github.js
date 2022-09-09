const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GitHub_Key,
});

require("dotenv").config();
//our rate limit for these requests with octokit is either 1,000/hour or 5,000/hour, I'm honestly not sure
//Get a backup API key as well for presentation day

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
  let urls = [];
  let goodEvents = []; //This copies the events the urls above are from. They should share the same index number
  for (let i = 0; i < event.length; i++) {
    if (!urls.includes(event[i].repo.url)) {
      urls.push(event[i].repo.url);
      goodEvents.push(event[i]);
    }
    //It's just now occurring to me that we can probably just take the first goodEvent for the main page,
    //but this code will be necessary for the profile page implementation
  }
  return [urls, goodEvents];
}

const githubRequest = async (username, number) => {
  let { data: publicEvents } = await octokit.request(
    "GET /users/{username}/events/public",
    {
      username: username,
      per_page: number, //Change this variable to change how many events we're requesting from any one user before filtering
    }
  );
  publicEvents = publicEvents.filter(contributionFilter);
  publicEvents = uniqueFilter(publicEvents);
  console.log(publicEvents); //note that this is a length 2 array defined in uniqueFilter
  return publicEvents;
};

module.exports = githubRequest;
