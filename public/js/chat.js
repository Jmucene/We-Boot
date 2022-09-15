const pusher = new Pusher("0be76b4b2c146e8cd31b", {
  cluster: "us2",
});

console.log(pusher);

let myId = $("#chat-toggle").data("id");
console.log("myId", myId);
const channel = pusher.subscribe(`We-Boot`);
let socketId = null;
pusher.connection.bind("connected", () => {
  socketId = pusher.connection.socket_id;
});
console.log("socketId", socketId);
channel.bind(`profile-${myId}`, async function (data) {});

console.log("channel", channel);

const updateScroll = () => {
  const chatBody = $(".card-body");
  chatBody.scrollTop(chatBody.prop("scrollHeight"));
};

// const updatePartnerId = () => { }

const showChat = async (e) => {
  e.preventDefault();
  const tgt = $(e.target);
  const userId = tgt.data("id");

  const res = await fetch(`/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let users = await res.json();

  users = users.filter((user) => user.id !== userId);
  const partnerId = $("#send-message").data("partnerid") || users[0].id;
  console.log("partnerId", partnerId);

  console.log("userId", userId);
  let channel = pusher.subscribe(`We-Boot`);
  console.log("subscribed");
  const chatId = [userId, partnerId].sort().join("");
  console.log("chatId", chatId);
  channel.bind(`chat-${chatId}`, function (data) {
    console.log("data", data);
    if (data.partnerId === userId) {
      console.log("socketId", pusher.connection.socket_id);
      console.log("dont add");
      return;
    }
    if ($(".card-body").text() === "No messages yet") {
      $(".card-body").empty();
    }
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
    const push = false;
    fetch(`/api/chat/${data.partnerId}`, {
      method: "POST",
      body: JSON.stringify({ chat: $(".card-body").html(), partnerId, push }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  console.log("channel", channel);
  // $('#send-message').data("partnerid", partnerId);
  const sendMessage = document.getElementById("send-message");
  sendMessage.setAttribute("data-partnerid", partnerId);

  const response = await fetch(`/api/chat/${partnerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const chatData = await response.json();
  const name = chatData.partnerName;
  $("#chat-users").text(name);
  // console.log("chatData", chatData);
  // console.log("chat", chatData[0].chat);
  if (users.length === 1) {
    users = [{ id: 0, name: "No other users" }];
  }
  console.log("users", users);
  $(".dropdown-menu").empty();
  users.forEach((user) => {
    console.log("user", user);
    $(".dropdown-menu").append(
      `<a class="dropdown-item" data-id=${user.id} href="#">${user.name}</a>`
    );
  });
  $(".card-body").empty();
  console.log(chatData);
  chatData.chat
    ? $(".card-body").append(chatData.chat)
    : $(".card-body").append(`<p class="text-center">No messages yet</p>`);
  $("#send-message").data("partnerId", partnerId);
  updateScroll();
};

const sendMessage = async (e) => {
  e.preventDefault();
  console.log("e.target", e.target);
  const tgt = $(e.target);
  // console.log("data", tgt.data());
  const sendMessage = document.getElementById("send-message");
  const partnerId = sendMessage.getAttribute("data-partnerid");
  const userId = window.location.pathname.split("/")[2];
  console.log("partnerId send message", partnerId);
  // const userId =
  const message = $("#chat-message").val();
  console.log("message", message);
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
  const chat = $(".card-body").html();
  console.log("chat", chat);
  const push = true;
  const res = await fetch(`/api/chat/${partnerId}`, {
    method: "POST",
    body: JSON.stringify({ chat, partnerId, message, push }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const changePartner = async (e) => {
  const partnerId = $(e.target).data("id");
  const name = $(e.target).text();
  const userId = window.location.pathname.split("/")[2];
  const chatId = [userId, partnerId].sort().join("");
  console.log("chatId", chatId);
  channel.bind(`chat-${chatId}`, function (data) {
    console.log("data", data);
    if (data.partnerId === userId) {
      console.log("socketId", pusher.connection.socket_id);
      console.log("dont add");
      return;
    }
    if ($(".card-body").text() === "No messages yet") {
      $(".card-body").empty();
    }
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
    const push = false;
    fetch(`/api/chat/${data.partnerId}`, {
      method: "POST",
      body: JSON.stringify({ chat: $(".card-body").html(), partnerId, push }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  $("#chat-users").text(name);
  console.log("partnerId", partnerId);
  const res = await fetch(`/api/chat/${partnerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const chatData = await res.json();
  $('.card-body').empty()
  console.log('chatData', chatData)
  chatData.chat
    ? $(".card-body").append(chatData.chat)
    : $(".card-body").append(`<p class="text-center">No messages yet</p>`);
  const sendMessage = document.getElementById("send-message");
  sendMessage.setAttribute("data-partnerid", partnerId);
};

$(".dropdown-menu").on("click", "a", changePartner);
$("#chat-toggle").click(showChat);
$("#send-message").click(sendMessage);
