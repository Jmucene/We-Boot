const nameEl = $("#profile-name"); //document.getElementById("profile-name");
const emailEl = $("#profile-email");
const githubEl = $("#profile-github");
const slackEl = $("#profile-slack");
const buttonEl = $("#profile-buttons");
const editIcon = $("#edit-profile");
const bioEl = $("#profile-bio");
const imageEl = $("#profile-pic");
const uploadBtns = $("#upload-btns");
const createEl = $("#create-post");

let uploadEl = $("#image-upload");
let name, email, github, slack, bio, originalImg, newImg;

const enableEdit = () => {
  $(".profile-input").each(function (i) {
    const input = $(this);
    input.prop("disabled", false);
    input.toggleClass("form-control-plaintext");
    input.toggleClass("form-control");
  });
  buttonEl.prop("hidden", false);
  editIcon.prop("hidden", true);
};

const disableEdit = () => {
  $(".profile-input").each(function (i) {
    const input = $(this);
    input.prop("disabled", true);
    input.toggleClass("form-control-plaintext");
    input.toggleClass("form-control");
  });
  buttonEl.prop("hidden", true);
  editIcon.prop("hidden", false);
};

const profileEditHandler = async (event) => {
  event.preventDefault();
  name = nameEl.val().trim();
  email = emailEl.val().trim();
  github = githubEl.val().trim();
  slack = slackEl.val().trim();
  bio = bioEl.val().trim();
  const id = window.location.pathname.split("/")[2];
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, email, github, slack, bio }),
    headers: { "Content-Type": "application/json" },
  });

  disableEdit();
};

const enableEditHandler = async (event) => {
  event.preventDefault();
  name = nameEl.val().trim();
  email = emailEl.val().trim();
  github = githubEl.val().trim();
  slack = slackEl.val().trim();
  bio = bioEl.val().trim();

  enableEdit();
};

const cancelEditHandler = async (event) => {
  event.preventDefault();
  nameEl.val(name);
  emailEl.val(email);
  githubEl.val(github);
  slackEl.val(slack);
  bioEl.val(bio);

  disableEdit();
};

const previewProfileImage = () => {
  //ensure a file was selected
  const uploader = uploadEl.get()[0];
  if (uploader.files && uploader.files[0]) {
    originalImg = imageEl.attr("src");
    const imageFile = uploader.files[0];
    const type = imageFile.type.split("/")[1];
    let reader = new FileReader();
    reader.onload = function (e) {
      //set the image data as source
      imageEl.attr("src", e.target.result);
      newImg = { data: e.target.result, type };
    };
    reader.readAsDataURL(imageFile);
    uploadBtns.prop("hidden", false);
  }
};

const profilePicHandler = async (event) => {
  event.preventDefault();
  const action = event.target.textContent;
  uploadBtns.prop("hidden", true);
  if (action === "Cancel") {
    imageEl.attr("src", originalImg);
    uploadBtns.prop("hidden", true);
    uploadEl.replaceWith(uploadEl.val("").clone());
    uploadEl = $("#image-upload").on("change", () => previewProfileImage());
    return;
  }
  const id = window.location.pathname.split("/")[2];
  const response = await fetch(`/api/users/image/${id}`, {
    method: "POST",
    body: JSON.stringify({ newImg }),
    headers: { "Content-Type": "application/json" },
  });
};

const hoverIn = (event) => {
  const target = $(event.target);
  const profileId = Number(window.location.pathname.split("/")[2]);
  const userId = Number(target.data("loggedIn"));
  if (profileId === userId) {
    imageEl.addClass("prof-hover");
  }
};

const hoverOut = (event) => {
  imageEl.removeClass("prof-hover");
};

const createPostHandler = async (event) => {};

uploadBtns.on("click", profilePicHandler);
imageEl.on("click", () => uploadEl.click());
uploadEl.on("change", () => previewProfileImage());

$("#profile-form").on("submit", profileEditHandler);
editIcon.on("click", enableEditHandler);
$("#cancel-profile").on("click", cancelEditHandler);
$("#create-post").on("click", createPostHandler);

imageEl.hover(hoverIn, hoverOut);
