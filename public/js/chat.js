const pusher = new Pusher("0be76b4b2c146e8cd31b", {
  cluster: "us2",
});

console.log(pusher);

$("#chat-toggle").click(async (e) => {
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
      `<a class="dropdown-item" href="#">${user.name}<small class='text-muted'>#${user.id}</small></a>`
    );
  });
});

$("#send-message").click((e) => {
  e.preventDefault();
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
});
