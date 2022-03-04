const express = require("express");
const app = express();
const http = require("http");
const dotenv = require("dotenv").config();
const path = require("path");
const { Socket } = require("socket.io");
const Port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require("socket.io")(server);
const sockets = {};
const typers = {};
let i = 0;
const animals = ["fish", "cat", "tiger", "bear", "bull", "fox"];

const colors = ["red", "green", "blue", "yellow", "purple", "pink"];

function randomName() {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${color}-${animal}`;
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/user/:id", (req, res) => {
  res.send("HI");
});

io.on("connection", (socket) => {
  sockets[socket.id] = randomName();
  const name = sockets[socket.id];
  console.log(Object.keys(sockets));
  socket.emit("update-peers", {
    peers: Object.values(sockets),
    id: Object.keys(sockets),
  });
  socket.on("message", (msg) => {
    socket.emit("newMessage", {
      sender: sockets[socket.id],
      message: msg,
    });
  });
  socket.on("user-typing", () => {
    typers[socket.id] = 1;
    socket.broadcast.emit("user-typing", {
      peer: sockets[socket.id],
      len: Object.keys(typers).length,
    });
  });
  socket.on("stopped", () => {
    delete typers[socket.id];
    console.log("stopped");
    socket.broadcast.emit("stopped", Object.keys(typers).length);
  });
  socket.emit("name-generated", name);
  socket.on("disconnect", () => {
    console.log(`disconnexted ${name}`);
    delete sockets[socket.id];
  });
});

server.listen(Port, () => {
  console.log(`Server is listening at port : ${Port}`);
});
