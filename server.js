const express = require("express");
const app = express();
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
const User = require("./models/user");
const MarkDown = require("./models/markdown");

const { detectUserWin } = require("./utils/helpers");

app.use(cors());

io.on("connection", (socket) => {
  console.log("connection");

  Rooms.find().then((result) => io.emit("rooms", result));

  socket.on("create-room", (roomName, callback) => {
    const newRoom = new Rooms({
      name: roomName,
      personJoined: [],
    });
    newRoom.save().then((res) => io.emit("room-created", res));
    callback();
  });

  socket.on("create-user", async (username, callback) => {
    const query = User.where({ name: `${username}` });
    query.findOne((_, user) => {
      if (!user) {
        const newUser = new User({
          name: username,
        });

        newUser.save();
      }
      callback();
    });
  });

  socket.on("join-room", async (username, roomName, callback) => {
    const result = await Rooms.findOne({ name: roomName });
    if (result.personJoined.length < 2) {
      result.personJoined.push(username);
      result.save();
      callback();
    }
  });

  socket.on("leave-room", async (username, roomName) => {
    await Rooms.findOneAndUpdate(
      { name: roomName },
      { $pull: { personJoined: username } }
    );
  });

  socket.on("get-room-info", async (romName, callback) => {
    const room = await Rooms.findOne({ name: romName });
    callback(room);
  });

  socket.on("select-step", (blockIndex, username, roomName) => {
    MarkDown.find({ room: roomName }).then(async (steps) => {
      const stepExisted = steps.find(
        (step) =>
          step.name === username &&
          JSON.stringify(blockIndex) === JSON.stringify(step.step)
      );
      if (!stepExisted) {
        const markdown = new MarkDown({
          name: username,
          room: roomName,
          step: blockIndex,
        });

        await markdown.save().then((resp) => {
          io.emit("mark-down", resp);
        });

        if (steps.length) {
          const userSteps = [];
          steps
            .filter((step) => step.name === username)
            .forEach((step) => userSteps.push(step.step));
          const userWon = detectUserWin(blockIndex, userSteps);
          if (userWon) {
            io.emit("user-won", `${username} is victory `);
          } else if (!userWon && [...steps, markdown].length === 9) {
            io.emit("user-won", `Drawwwwww`);
          }
        }
      }
    });
  });

  socket.on("get-markDown-list", async (roomName, callback) => {
    const markDown = await MarkDown.find({ room: roomName });
    callback(markDown);
  });

  socket.on("reset-step", async (roomName) => {
    const markDown = await MarkDown.deleteMany({ room: roomName });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

http.listen(process.env.PORT || 8000);
