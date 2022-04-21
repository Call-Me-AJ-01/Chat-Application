const express = require("express");
const socket_io = require("socket.io");
const http = require("http");
const path = require("path");
const {
  addUser,
  removeUser,
  getAllUsers,
} = require("./public/Utils/user_details.js");

const PORT = 3000;

const public_Dir = path.join(__dirname, "/public/");
const app = express();

app.use(express.static(public_Dir));

const server = http.createServer(app);
const io = socket_io(server);

io.on("connection", (socket) => {
  socket.on("join", (username, room) => {
    const tot_users = getAllUsers();
    for (let user of tot_users) {
      socket.emit("user", user.username);
    }
    const { user, error } = addUser({ id: socket.id, username, room });
    socket.join(room);
    socket.emit("grp_name", room);
    socket.emit("greet", username);
    io.emit("user", username);
    socket.broadcast.to(room).emit("new_user", username);
  });

  socket.emit("user_detail");

  socket.on("send_msg", (data) => {
    socket.emit("send_message_owner", data);
    socket.broadcast.to(data.room).emit("send_message", data);
  });

  socket.on("disconnect", () => {
    const data = removeUser(socket.id);
    io.emit("exit_message", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
