const pusher = new Pusher("0be76b4b2c146e8cd31b", {
  cluster: "us2",
});
const channel = pusher.subscribe(`We-Boot`);
let myId = $("#chat-toggle").data("id");

const receiveMessage = (data, userId) => {
  if (data.partnerId === userId) {
    return;
  }
  if ($(".card-body").text() === "No messages yet") {
    $(".card-body").empty();
  }
  //append received message
  $(".card-body").append(
    `<div class="d-flex flex-row justify-content-start">
        <img
          src="/images/uploads/profile-${data.partnerId}.jpg"
          alt="avatar 1"
          style="width: 45px; height: 100%;"
        />
        <div>
          <p
            class="small p-2 ms-3 mb-1 rounded-3"
            style="background-color: #f5f6f7;"
          >
            ${data.message}
          </p>
          <p class="small ms-3 mb-3 rounded-3 text-muted">
            ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>`
  );
  updateScroll();
  //save chat without triggering pusher
  const push = false;
  fetch(`/api/chat/${data.partnerId}`, {
    method: "POST",
    body: JSON.stringify({ chat: $(".card-body").html(), partnerId, push }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const changeParnter = async (chatId, userId, partnerId,) => {
  channel.bind(`chat-${chatId}`, function (data) {
    receiveMessage(data, userId);
  });
  //get chat
  const response = await fetch(`/api/chat/${partnerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const chatData = await response.json();

  //replace chat body with chat from db
  $(".card-body").empty();
  chatData.chat
    ? $(".card-body").append(chatData.chat)
    : $(".card-body").append(`<p class="text-center">No messages yet</p>`);
  updateScroll();
  const name = chatData.partnerName;
  return name;
};

const updateScroll = () => {
  const chatBody = $(".card-body");
  chatBody.scrollTop(chatBody.prop("scrollHeight"));
};

const showChat = async (e) => {
  e.preventDefault();
  const tgt = $(e.target);
  const userId = tgt.data("id");
  //get all users
  const res = await fetch(`/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let users = await res.json();
  //filter out current user and get partner id
  users = users.filter((user) => user.id !== userId);
  const partnerId = $("#send-message").data("partnerid") || users[0].id;
  //bind to chat channel & add message to chat
  const chatId = [userId, partnerId].sort().join("");

  const name = await changeParnter(chatId, userId, partnerId);

  //change partner id of send message button
  const sendMessage = document.getElementById("send-message");
  sendMessage.setAttribute("data-partnerid", partnerId);

  //change user selection to partner
  $("#chat-users").text(name);
  if (users.length === 1) {
    users = [{ id: 0, name: "No other users" }];
  }
  //add users to chat dropdown
  $(".dropdown-menu").empty();
  users.forEach((user) => {
    $(".dropdown-menu").append(
      `<a class="dropdown-item" data-id=${user.id} href="#">${user.name}</a>`
    );
  });
};

const sendMessage = async (e) => {
  e.preventDefault();
  const tgt = $(e.target);
  const sendMessage = document.getElementById("send-message");
  const partnerId = sendMessage.getAttribute("data-partnerid");
  const userId = window.location.pathname.split("/")[2];
  const socketId = pusher.connection.socket_id;
  const message = $("#chat-message").val();
  //append sent message
  if ($(".card-body").text() === "No messages yet") {
    $(".card-body").empty();
  }
  $(".card-body").append(
    `<div class="d-flex flex-row justify-content-end">
      <div>
        <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
          ${message}
        </p>
        <p
          class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end"
        >
          ${new Date().toLocaleTimeString()}
        </p>
      </div>
      <img
        src="/images/uploads/profile-${userId}.jpg"
        alt="avatar 1"
        style="width: 45px; height: 100%;"
      />
    </div>`
  );
  updateScroll();
  $("#chat-message").val("");
  //save chat and send pusher event to partner (from controller)
  const chat = $(".card-body").html();
  const push = true;
  await fetch(`/api/chat/${partnerId}`, {
    method: "POST",
    body: JSON.stringify({ chat, partnerId, message, push, socketId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const changePartnerHandler = async (e) => {
  e.preventDefault();
  const partnerId = $(e.target).data("id");
  const name = $(e.target).text();
  const userId = window.location.pathname.split("/")[2];
  const chatId = [userId, partnerId].sort().join("");
  $("#chat-users").text(name);
  changeParnter(chatId, userId, partnerId);
};

$(".dropdown-menu").on("click", "a", changePartnerHandler);
$("#chat-toggle").click(showChat);
$("#send-message").click(sendMessage);
