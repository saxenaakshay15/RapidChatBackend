require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");

// buiding server
const cors = require("cors");
const { Server } = require("socket.io");
// middleware that resolves socket issues
app.use(cors());

// generating server
const server = http.createServer(app);

const io = new Server(server, {
  // dealing with cors issue  by adding a object
  cors: {
    // which url makes call to socket.io server
    // which url react app will be running
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// detects if someone connects to socket.io server
// listens events named connection
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // join room event from frontend - passing room id as data
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // socket.on("active_users", (data) => {
  //   users = io.sockets.adapter.rooms.get(data.room);
  //   console.log("users " + users);
  //   socket.to(data.room).emit("active_users", users);
  // });

  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // receives message
  socket.on("send_message", (data) => {
    // emitting receive message event and sending to data to data.room
    socket.to(data.room).emit("receive_message", data);
  });

  // disconnect event
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("SERVER RUNNING");
});
