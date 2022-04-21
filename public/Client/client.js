const socket = io();

const chat_content = document.querySelector("#chat_content");
const send = document.querySelector("#send");
const input = document.querySelector("#message");
const heading = document.querySelector("#heading");
const sidebar = document.querySelector("#sidebar");

let count = 0;

let [username, room] = location.href.split("?")[1].split("&");
username = username.split("=")[1];
room = room.split("=")[1];

socket.on("user_detail", () => {
  socket.emit("join", username, room);
});

socket.on("grp_name", (room_name) => {
  heading.innerText = room_name.replace("+", " ");
});

socket.on("greet", (username) => {
  const html = `<div id="user_join">
      <p>
        Welcome to this group, <span id="username">${username} </span>
      </p>
    </div>`;
  chat_content.insertAdjacentHTML("beforeend", html);
});

socket.on("user", (username) => {
  const user_name = `<div id="name" class=${username}>${username}</div>`;
  sidebar.insertAdjacentHTML("beforeend", user_name);
});

socket.on("new_user", (username) => {
  const html = `<div id="user_join">
        <p>
          <span id="username">${username} </span>joined this group
        </p>
      </div>`;
  chat_content.insertAdjacentHTML("beforeend", html);
});

socket.on("send_message", (data) => {
  const time = new Date();
  const Time = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const html = ` <div id="message" class="_${count}">
      <p>
        <h1 id="username">${data.username}</h1>
        ${data.message}
      </p>
      <p style="text-align: right; font-size: 15px;"> ${Time} </p>
    </div>`;
  chat_content.insertAdjacentHTML("beforeend", html);
  document.querySelector(`._${count}`).scrollIntoView();
  count++;
});

socket.on("send_message_owner", (data) => {
  const time = new Date();
  const Time = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  console.log(Time);
  const html = ` <div id="message" class="_${count}" style="margin-left: auto; margin-right: 0;">
      <p>
        <h1 id="username">${data.username}</h1>
        ${data.message}
      </p>
      <p style="text-align: right; font-size: 15px;"> ${Time} </p>
    </div>`;
  chat_content.insertAdjacentHTML("beforeend", html);
  document.querySelector(`._${count}`).scrollIntoView();
  count++;
});

socket.on("exit_message", (data) => {
  const html = `<div id="user_join">
      <p>
       <span id="username">${data.username} </span> left this group
      </p>
    </div>`;
  chat_content.insertAdjacentHTML("beforeend", html);
  document.querySelector(`.${data.username}`).classList.add("hidden");
});

function button_fn() {
  socket.emit("send_msg", {
    username: username,
    room: room,
    message: input.value,
  });
  input.value = "";
}

send.addEventListener("click", () => {
  if (input.value) {
    button_fn();
  }
});

input.addEventListener("keyup", (event) => {
  if (input.value) {
    if (event.keyCode === 13) {
      button_fn();
    }
  }
});
