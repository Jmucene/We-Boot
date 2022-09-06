const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");
const githubEl = document.getElementById("profile-github");
const slackEl = document.getElementById("profile-slack");
const buttonEl = document.getElementById("profile-buttons");
const editIcon = document.getElementById("edit-profile");
const bioEl = document.getElementById("profile-bio");
const imageEl = document.getElementById("profile-pic");
const uploadEl = document.getElementById("image-upload");
const uploadBtns = document.getElementById("upload-btns");

let name, email, github, slack, bio, originalImg, newImg

const enableEdit = () => {
  document.querySelectorAll(".profile-input").forEach((input) => {
    input.removeAttribute("disabled");

    input.classList.toggle("form-control-plaintext");
    input.classList.toggle("form-control");
  });
  buttonEl.removeAttribute("hidden");
  editIcon.setAttribute("hidden", true);
  // bioEl.style.resize = 'both'
};

const disableEdit = () => {
  document.querySelectorAll(".profile-input").forEach((input) => {
    input.setAttribute("disabled", true);
    input.classList.toggle("form-control-plaintext");
    input.classList.toggle("form-control");
  });
  buttonEl.setAttribute("hidden", true);
  editIcon.removeAttribute("hidden");
  // bioEl.style.resize = "none";
};

const profileEditHandler = async (event) => {
  event.preventDefault();
  console.log("event", event);
  name = nameEl.value.trim();
  email = emailEl.value.trim();
  github = githubEl.value.trim();
  slack = slackEl.value.trim();
  bio = bioEl.value.trim();
  const id = window.location.pathname.split("/")[2];
  console.log(id);
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, email, github, slack, bio }),
    headers: { "Content-Type": "application/json" },
  });

  disableEdit();
};

const enableEditHandler = async (event) => {
  event.preventDefault();
  console.log("event", event);
  name = nameEl.value.trim();
  email = emailEl.value.trim();
  github = githubEl.value.trim();
  slack = slackEl.value.trim();
  bio = bioEl.value.trim();

  enableEdit();
};

const cancelEditHandler = async (event) => {
  event.preventDefault();
  nameEl.value = name;
  emailEl.value = email;
  githubEl.value = github;
  slackEl.value = slack;
  bioEl.value = bio;
  
  disableEdit();
};

const previewProfileImage = (uploader) => {
  //ensure a file was selected
  if (uploader.files && uploader.files[0]) {
    originalImg = imageEl.getAttribute("src");
    const imageFile = uploader.files[0];
    const type = imageFile.type.split("/")[1];
    console.log({ imageFile });
    let reader = new FileReader();
    reader.onload = function (e) {
      //set the image data as source
      imageEl.setAttribute("src", e.target.result);
      newImg = {data: e.target.result, type};
      console.log("newImg", newImg);
    };
    reader.readAsDataURL(imageFile);
    uploadBtns.removeAttribute("hidden");
  }
};

const profilePicHandler = async (event) => { 
  event.preventDefault();
  uploadBtns.setAttribute("hidden", true);

  const action = event.target.textContent
  if (action === "Cancel") {
    imageEl.setAttribute("src", originalImg);
    uploadBtns.setAttribute("hidden", true);
    return
  }
  const id = window.location.pathname.split("/")[2];
  const response = await fetch(`/api/users/image/${id}`, {
    method: "POST",
    body: JSON.stringify({ newImg }),
    headers: { "Content-Type": "application/json" },
  })
}


uploadBtns.addEventListener("click", profilePicHandler);
imageEl.addEventListener("click", () => uploadEl.click());
uploadEl.addEventListener("change", () => previewProfileImage(uploadEl));

document
  .getElementById("profile-form")
  .addEventListener("submit", profileEditHandler);
document
  .getElementById("edit-profile")
  .addEventListener("click", enableEditHandler);
document
  .getElementById("cancel-profile")
  .addEventListener("click", cancelEditHandler);
