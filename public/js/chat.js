const pusher = new Pusher("0be76b4b2c146e8cd31b", {
  cluster: "us2",
});

console.log(pusher);

const showChat = async (e) => { 
    e.preventDefault();
    const tgt = $(e.target);
    const userId = tgt.data("id");
    console.log("userId", userId);

    let channel = pusher.subscribe(`We-Boot`);
    console.log("subscribed");
    channel.bind(`chat-${userId}`, function (data) {
      console.log("data", data);
    });
    console.log("channel", channel);
    const res = await fetch(`/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const users = await res.json();
    console.log("users", users);
    $(".dropdown-menu").empty();
    users.forEach((user) => {
      $(".dropdown-menu").append(
        `<a class="dropdown-item" data-id=${user.id} href="#">${user.name}</a>`
      );
    });
}

const sendMessage = async (e) => {e.preventDefault();
  const tgt = $(e.target);
  // const userId =
  const message = $("#chat-message").val();
  console.log("message", message);
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
        src="/images/uploads/profile-1.jpg"
        alt="avatar 1"
        style="width: 45px; height: 100%;"
      />
    </div>`
  );
  // pusher.trigger('We-Boot', `chat-${userId}`, message)
  $("#chat-message").val("");
  const chat = $('.card-body').html();
  console.log("chat", chat);
  const res = await fetch(`/api/chat`, {
    method: "POST",
    body: JSON.stringify({ chat }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const changePartner = async (e) => {
  const partnerId = $(e.target).data("id");
  console.log("partnerId", partnerId);
  const res = await fetch(`/api/chat/${partnerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const chat = await res.json();
  console.log("chat", chat);
 }

$('.dropdown-menu').on('click', 'a', changePartner);
$("#chat-toggle").click(showChat);
$("#send-message").click(sendMessage)
