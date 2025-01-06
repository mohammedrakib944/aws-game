import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const PORT = 8000;
const TIMER = 60000; // 1 min

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
    (player) => room.turns[player.username] >= 3
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
  let selectorFound = false;
  while (!selectorFound) {
    room.selectorIndex = (room.selectorIndex + 1) % room.players.length;
    const nextPlayer = room.players[room.selectorIndex];

    if (room.turns[nextPlayer.username] < 3) {
      room.countrySelector = nextPlayer.username;
      room.turns[nextPlayer.username]++;
      selectorFound = true;
    }
  }

  room.countryName = null; // Reset the country name for the new round

  io.to(room_number).emit("newRound", {
    countrySelector: room.countrySelector,
    message: `A new round has started! ${room.countrySelector} will choose a country.`,
  });

  // Restart the timer for the next round after 60 seconds
  clearTimeout(room.timer);
  room.timer = setTimeout(() => {
    io.to(room_number).emit("roundTimeout", { message: "Time's up!" });
    startNewRound(room_number);
  }, TIMER);
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ username, room_number }, callback) => {
    console.log(username, " Join!");
    if (!rooms[room_number]) {
      rooms[room_number] = {
        players: [],
        admin: username,
        selectorIndex: -1,
        timer: null,
        countryName: null,
        turns: {},
      };
    }

    const room = rooms[room_number];
    const player = room.players.find((p) => p.username === username);

    if (!player) {
      room.players.push({ username, socketId: socket.id, playing: false });
      room.turns[username] = 0;
    }

    socket.join(room_number);

    console.log("Emitting playerList to room:", room_number, room.players);

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

  socket.on("startGame", ({ room_number, username }) => {
    const room = rooms[room_number];

    if (room && room.admin === username) {
      console.log(`Game started by admin: ${username} in room ${room_number}`);
      startNewRound(room_number);
    }
  });

  socket.on("selectCountry", ({ room_number, country }) => {
    const room = rooms[room_number];
    if (room && room.countrySelector === socket.username) {
      io.to(room_number).emit("countrySelected", { country });
    }
  });

  socket.on("sendHint", ({ room_number, hint }) => {
    io.to(room_number).emit("receiveHint", { hint });
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
