const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GitHub_Key,
  //auth: process.env.Backup_GitHub_Key,
});

//our rate limit for these requests with octokit is either 1,000/hour or 5,000/hour, I'm honestly not sure
//Get a backup API key as well for presentation day

let hardcodedCringe = [
  { name: "Casey Chartier", username: "MustyBraid" },
  { name: "Milantea Adams", username: "milantea" },
  { name: "Shannon Kendall", username: "shannie14" },
  { name: "DJ McMillan", username: "deejerz88" },
  { name: "Donna Bussure", username: "bussudo" },
  { name: "Jase Mucene", username: "Jmucene" },
  { name: "Mim Armand", username: "mim-Armand" },
  { name: "Austin Leblanc", username: "austinleblanc" },
  { name: "Derek Hoye", username: "DLHoye" },
  { name: "Justin Thon", username: "Limpbrick" },
  { name: "Doug Schulte", username: "dkschulte" },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function homepageList(length) {
  let final = [];
  let chosenUsers = [];
  for (let i = 0; i < length; ) {
    let randomUser = hardcodedCringe[getRandomInt(hardcodedCringe.length)];

    if (!chosenUsers.includes(randomUser.username)) {
      chosenUsers.push(randomUser.username);
      a = await githubRequest(randomUser.username, 5);
      if (a.urls) {
        for (let j = 0; j < a.urls.length; ) {
          if (!final.includes(a.urls[j])) {
            final.push(
              `${randomUser.name} recently updated a project at ${a.urls[j]}`
            );
            i++;
            break;
          } else {
            j++;
          }
        }
      }
    }
  }
  return final;
}

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
  formattedEvents = { urls: publicEvents[0], repos: publicEvents[1] };
  //console.log(publicEvents); //note that this is a length 2 array defined in uniqueFilter
  return formattedEvents;
};

homepageList(5);
module.exports = { githubRequest, homepageList };
