// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;
const slideIntervalDuration = 15000;
const fs = require('fs');

let message = "Welcome to the Southwest Livestock Show!";
let imageIndex = 0;

const fileExcpetions = [".DS_Store", "images.md"];

const allImages = fs.readdirSync(path.resolve("./images/")).filter(i => {
  return !fileExcpetions.includes(i);
});

app.get("/slide/:index", (req, res) => {
  const imagePath = path.resolve("./images/" + allImages[req.params.index]);
  res.sendFile(imagePath);
});

app.use(express.static(path.join(__dirname, 'app')));

server.listen(PORT, () => {
  console.log("Listening on " + PORT);
});

io.on("connection", (socket) => {
  socket.on("setMessage", (data) => {
    console.log("set message", data);
    socket.broadcast.emit("message", data);
  });

  socket.on("getMessage", () => {
    socket.emit("message", message);
  });

  socket.on("getSlide", () => {
    socket.emit("slide", `/slide/${imageIndex}`);
  });
});

setInterval(() => {
  imageIndex += 1;
  if (imageIndex >= allImages.length) {
    imageIndex = 0;
  }
}, slideIntervalDuration);