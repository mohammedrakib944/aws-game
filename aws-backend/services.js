import {
  broadcastAnswer,
  broadcastCharacters,
  broadcastNewRound,
  sendPlayersOfRoom,
  sendStatus,
  sendTimer,
  STATUS,
} from "./senders.js";

export const TIMER = 20; // 100 seconds
export const BREAK_TIME = 5; // seconds
export const TOTAL_LEVEL = 2;

export const getPlayer = (room) => {
  const nextPlayer = room.players.find(
    (player) => room.turns[player.id] <= room.level
  );

  if (nextPlayer) {
    room.turns[nextPlayer.id] = (room.turns[nextPlayer.id] || 0) + 1;

    return nextPlayer;
  }

  // If no player found and level is less than 3, increment the level and try again
  if (room.level < TOTAL_LEVEL - 1) {
    room.level += 1;
    return getPlayer(room);
  }

  return { status: "all-player-done" };
};

export const sortPlayersByPoints = (players) => {
  return [...players].sort((a, b) => b.points - a.points);
};

export const startNewRound = (io, rooms, room_number) => {
  const room = rooms[room_number];

  if (!room || room.players.length === 0) return;

  // Clear all points
  room.correctAnswers = {};

  // Select the next player in sequence
  const player = getPlayer(room);

  if (player?.status === "all-player-done") {
    //Handle Game Over
    console.log("Game is over!");
    const players_list = sortPlayersByPoints(room.players);
    sendStatus(io, room_number, STATUS.GAME_OVER, { points: players_list });

    // Reset Room data
    rooms[room_number] = {
      players: [],
      countryName: null,
      level: 0,
      turns: {},
      correctAnswers: {},
    };

    return;
  }

  sendStatus(io, room_number, STATUS.CHOOSING, {
    message: `${player.username} is choosing a place!`,
    user_id: player.id,
  });

  broadcastNewRound(io, room_number, player);
};

export const startTimer = (io, roomNumber, country, rooms) => {
  let seconds = TIMER;
  const timerInterval = setInterval(() => {
    if (seconds > 0) {
      seconds -= 1;
      sendTimer(io, roomNumber, seconds);
    } else {
      // Round one complete
      clearInterval(timerInterval);
      const room = rooms[roomNumber];

      io.to(roomNumber).emit("roundEnd", {
        country,
        isRoundEnd: true,
      });

      // Round end
      sendStatus(io, roomNumber, STATUS.SHOW_ANSWER, {
        answer: `"${room.countryName}" is the correct answer!`,
      });

      // Update Players
      sendPlayersOfRoom(io, roomNumber, {
        players: room.players,
        admin: room.admin,
      });

      const timer = setTimeout(() => {
        clearTimeout(timer);

        // START NEW ROUND
        startNewRound(io, rooms, roomNumber);
      }, BREAK_TIME * 1000);
    }
  }, 1000);
};

export const sendRandomCharacter = (io, roomNumber, str) => {
  const totalCharactersToSend = Math.ceil(str.length / 2);
  const intervalTime = Math.round(TIMER / totalCharactersToSend) * 1000;
  const selectedIndices = {};
  let emittedCount = 0;

  const initialIndex = Math.floor(Math.random() * str.length);
  selectedIndices[initialIndex] = str[initialIndex];
  emittedCount++;

  broadcastCharacters(io, roomNumber, str.length, selectedIndices);

  const interval = setInterval(() => {
    if (emittedCount >= totalCharactersToSend) {
      broadcastCharacters(io, roomNumber, str.length, selectedIndices);
      clearInterval(interval);
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * str.length);
    } while (selectedIndices[randomIndex] !== undefined);

    const character = str[randomIndex];
    selectedIndices[randomIndex] = character;
    emittedCount++;

    // Emit the data using socket.io
    broadcastCharacters(io, roomNumber, str.length, selectedIndices);
  }, intervalTime);
};

export const sendAnswer = (io, data, rooms) => {
  const { room_number, user_id, username, answer } = data;

  const room = rooms[room_number];

  if (!room) {
    console.log("Room not found.");
    return;
  }

  // Ensure countryName is set
  if (!room.countryName) {
    console.log("Country name not set.");
    return;
  }

  // Check if the answer is correct
  if (answer.toLowerCase() === room.countryName.toLowerCase()) {
    // Check if the user already answered correctly before
    if (room.correctAnswers[user_id]) {
      broadcastAnswer(io, room_number, {
        username,
        answer: "Relax bro, Your answer was already correct!",
        correct: true,
        relax: true,
        points: room.correctAnswers[user_id],
      });
      return;
    }

    // Determine points based on the order of correct answers
    const correctAnswersCount = Object.keys(room.correctAnswers).length;
    const pointsAwarded = Math.max(1000 - correctAnswersCount * 50, 100);

    // Store the points for the user
    room.correctAnswers[user_id] = pointsAwarded;

    // Update player's points
    const player = room.players.find((p) => p.id === user_id);
    if (player) {
      player.points = (player.points || 0) + pointsAwarded;
    }

    // Broadcast the updated scores and answer to everyone in the room
    broadcastAnswer(io, room_number, {
      username,
      answer: "Correct Answer!!",
      correct: true,
      points: player.points,
    });
  } else {
    // If the answer is incorrect, broadcast it as incorrect
    broadcastAnswer(io, room_number, {
      username,
      answer,
      correct: false,
    });
  }
};
