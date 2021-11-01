const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(http);
const cors = require("cors");
const mongoose = require("mongoose");

const mongoDB =
  "mongodb+srv://phatnguyen_ekino:phatnguyen@cluster0.uksqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));
const Rooms = require("./models/room");
const { resolvePtr } = require("dns");

app.use(cors());

const user = [];

io.on("connection", (socket) => {
  console.log("connection");

  Rooms.find().then((result) => socket.emit("rooms", result));

  socket.on("create-room", (roomName) => {
    const newRoom = new Rooms({
      name: roomName,
    });
    newRoom.save().then((res) => io.emit("room-created", res));
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

http.listen(8000);
