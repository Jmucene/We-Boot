function getName() {
  let clkN = document.getElementById("search-Ninput");
  fetch(`/searchName/${clkN.value}`)
    .then((response) => {
      return response.json();
    })
    .then((nameData) => {
      console.log(nameData);
    });
}
// search by name
let nameBtn = document.getElementById("searchNBtn");
nameBtn.addEventListener("click", function async(e) {
  e.preventDefault();
  getName();
});

function getGithub() {
  let clkG = document.getElementById("search-Ginput");
  fetch(`/searchGithub/${clkG.value}`)
    .then((response) => {
      return response.json();
    })
    .then((githubData) => {
      console.log(githubData);
    });
}

// search by github
let gBtn = document.getElementById("searchGBtn");
gBtn.addEventListener("click", function async(e) {
  e.preventDefault();
  getGithub();
});
