import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  sendAnswer,
  sendRandomCharacter,
  startNewRound,
  startTimer,
} from "./services.js";
import {
  broadcastHints,
  newJoin,
  sendPlayersOfRoom,
  sendStatus,
  STATUS,
} from "./senders.js";

const app = express();
const server = http.createServer(app);

const PORT = 8000;

app.use(cors());
app.options("*", cors());

const io = new Server(server, {
  cors: {
    origin: "http://46.137.193.141:3000",
    methods: ["GET", "POST"],
  },
});

let rooms = {};

app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ id, username, room_number }, callback) => {
    console.log(username, " Join!");

    newJoin(io, room_number, {
      message: `${username} - just joined!`,
    });

    if (!rooms[room_number]) {
      rooms[room_number] = {
        players: [],
        admin: {
          id,
          username,
        },
        countryName: null,
        isStarted: false,
        level: 0,
        turns: {},
        correctAnswers: {},
      };

      sendStatus(io, room_number, STATUS.START_GAME, {
        admin: username,
        admin_id: id,
        message: `Wait for admin (${username}) to start the Game!`,
      });
    }

    const room = rooms[room_number];
    const player = room.players.find((p) => p.id === id);

    if (!player) {
      room.players.push({ id, username, socketId: socket.id });
      room.turns[id] = 0; // make turns 0
    }

    socket.join(room_number);

    if (!room.isStarted) {
      sendStatus(io, room_number, STATUS.START_GAME, {
        admin: room.admin.username,
        admin_id: room.admin.id,
        message: `Wait for admin (${room.admin.username}) to start the Game!`,
      });
    }

    sendPlayersOfRoom(io, room_number, {
      players: room.players,
      admin: room.admin,
    });

    // Successfully joined
    callback({
      players: room.players,
      admin: room.admin,
    });
  });

  socket.on("startGame", ({ room_number, id, username }) => {
    const room = rooms[room_number];

    room.isStarted = true;

    if (!room.admin) {
      console.log("No admin found!");
      return;
    }

    if (room && room.admin.id === id) {
      console.log(`Game started by admin: ${username}`);
      console.log("io, rooms, room-number: ", rooms, room_number);
      startNewRound(io, rooms, room_number);
    }
  });

  socket.on("selectCountry", ({ room_number, country, user_id }) => {
    if (!room_number || !country) {
      console.log("No country name found!");
      return;
    }

    const room = rooms[room_number];
    room.countryName = country;

    sendStatus(io, room_number, STATUS.ROUND_START, { user_id });
    startTimer(io, room_number, country, rooms);
    sendRandomCharacter(io, room_number, country);
  });

  socket.on("sendHint", ({ room_number, hint }) => {
    broadcastHints(io, room_number, hint);
  });

  socket.on("sendAnswer", (data) => {
    sendAnswer(io, data, rooms);
  });

  socket.on("disconnect", () => {
    console.log("Player Disconnected");
    for (const room_number in rooms) {
      const room = rooms[room_number];

      const playerIndex = room.players.findIndex(
        (p) => p.socketId === socket.id
      );

      if (playerIndex !== -1) {
        const player = room.players.splice(playerIndex, 1)[0];

        if (room.countrySelector === player.username) {
          room.countrySelector =
            room.players.length > 0 ? room.players[0].username : null;
          io.to(room_number).emit("countrySelector", {
            username: room.countrySelector,
          });
        }

        // Emit the updated player list after a player disconnects
        io.to(room_number).emit("playerList", {
          players: room.players,
          isLeft: true,
          message: `${player.username} has left the room.`,
        });

        if (room.players.length === 0) {
          clearTimeout(room.timer); // Clear the timer if the room is empty
          delete rooms[room_number];
        }

        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
