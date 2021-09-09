// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;
const nameIntervalDuration = 10000;
// const fs = require('fs');
const names = require('./names.json');

let message = "Welcome to the Southwest Livestock Show!";
let nameIndex = 0;

const allNames = names.names;

// app.get("/slide/:index", (req, res) => {
//   const imagePath = path.resolve("./images/" + allImages[req.params.index]);
//   res.sendFile(imagePath);
// });

app.use(express.static(path.join(__dirname, 'app')));

server.listen(PORT, () => {
  console.log("Listening on " + PORT);
});

io.on("connection", (socket) => {
  socket.on("setMessage", (data) => {
    console.log("set message", data);
    message = data;
    socket.broadcast.emit("message", data);
  });

  socket.on("getMessage", () => {
    socket.emit("message", message);
  });

  socket.on("getSupporter", () => {
    socket.emit("supporter", allNames[nameIndex]);
  });
});

setInterval(() => {
  nameIndex += 1;
  if (nameIndex >= allNames.length) {
    nameIndex = 0;
  }
}, nameIntervalDuration);