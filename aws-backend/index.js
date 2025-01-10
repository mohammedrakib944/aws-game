import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  getPlayer,
  sendAnswer,
  sendRandomCharacter,
  startTimer,
} from "./helper.js";

const app = express();
const server = http.createServer(app);

const PORT = 8000;

app.use(cors());
app.options("*", cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let rooms = {}; // Example: { "234234": { players: [], admin: null, countrySelector: null, ... } }

app.use(express.json());

function startNewRound(room_number) {
  const room = rooms[room_number];

  if (!room || room.players.length === 0) return;

  // Check if all players have had 3 turns
  const allTurnsComplete = room.players.every(
    (player) => room.turns[player.id] >= 3
  );

  if (allTurnsComplete) {
    io.to(room_number).emit("gameOver", {
      message: "Game over! Each player has had 3 turns.",
    });
    clearTimeout(room.timer); // Clear the timer
    delete rooms[room_number]; // Remove room data
    return;
  }

  // Select the next player in sequence
  const player = getPlayer(room);

  io.to(room_number).emit(
    "choosing",
    `${player.username} is choosing a place!`
  );
  io.to(room_number).emit("newRound", player);
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ id, username, room_number }, callback) => {
    console.log(username, " Join!");
    if (!rooms[room_number]) {
      rooms[room_number] = {
        players: [],
        admin: {
          id,
          username,
        },
        selectorIndex: -1,
        timer: null,
        countryName: null,
        turns: {},
      };
    }

    const room = rooms[room_number];
    const player = room.players.find((p) => p.id === id);

    if (!player) {
      room.players.push({ id, username, socketId: socket.id, playing: false });
      room.turns[id] = 0;
    }

    socket.join(room_number);

    io.to(room_number).emit("playerList", {
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

    if (room && room.admin.id === id) {
      console.log(`Game started by admin: ${username} in room ${room_number}`);
      startNewRound(room_number);
    }
  });

  socket.on("selectCountry", ({ room_number, country }) => {
    if (!room_number || !country) {
      console.log("No country name found!");
      return;
    }

    const room = rooms[room_number];
    room.countryName = country;

    io.to(room_number).emit("endRound", false);
    startTimer(io, room_number, country, rooms);
    sendRandomCharacter(io, room_number, country);
  });

  socket.on("sendHint", ({ room_number, hint }) => {
    io.to(room_number).emit("receiveHint", { hint });
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
