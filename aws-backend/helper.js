export const TIMER = 20; // 100 seconds
export const BREAK_TIME = 3; // seconds

export const getPlayer = (room, maxTurns = 1) => {
  // Find the first player who hasn't completed max turns
  const nextPlayer = room.players.find(
    (player) => room.turns[player.id] < maxTurns
  );

  // reset playing to false
  room.players.map((player) => (player.playing = false));

  if (!nextPlayer) {
    return null; // All players have completed the maximum number of turns
  }

  // Update the player's turn count and set playing status to true
  room.turns[nextPlayer.id] += 1;

  nextPlayer.playing = true;

  // Return the updated player object
  return nextPlayer;
};

export const sendRandomCharacter = (io, roomNumber, str) => {
  const intervalTime = Math.round(TIMER / str.length) * 1000; // Convert to milliseconds
  const selectedIndices = {}; // Store selected characters with their indices
  let emittedCount = 0;

  // Send Initial Request
  io.to(roomNumber).emit("countrySelected", {
    status: "running",
    character: {
      str_len: str.length,
      index: selectedIndices,
    },
  });

  const interval = setInterval(() => {
    if (emittedCount >= str.length) {
      io.to(roomNumber).emit("countrySelected", {
        status: "end",
        character: {
          str_len: str.length,
          index: selectedIndices,
        },
      });
      clearInterval(interval);
      return;
    }

    // Select a random index that hasn't been emitted yet
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * str.length);
    } while (selectedIndices[randomIndex] !== undefined);

    const character = str[randomIndex];
    selectedIndices[randomIndex] = character;
    emittedCount++;

    // Emit the data using socket.io
    io.to(roomNumber).emit("countrySelected", {
      status: "running",
      character: {
        str_len: str.length,
        index: selectedIndices,
      },
    });
  }, intervalTime);
};

export const startTimer = (io, roomNumber, country, rooms) => {
  let seconds = TIMER;
  const timerInterval = setInterval(() => {
    if (seconds > 0) {
      seconds -= 1;
      io.to(roomNumber).emit("timer", seconds);
    } else {
      // Round one complete
      clearInterval(timerInterval);
      const room = rooms[roomNumber];

      io.to(roomNumber).emit("roundEnd", {
        country,
        isRoundEnd: true,
      });

      io.to(roomNumber).emit("playerList", {
        players: room.players,
        admin: room.admin,
      });

      const timer = setTimeout(() => {
        clearTimeout(timer);

        // Get Player
        const player = getPlayer(room);
        io.to(roomNumber).emit("endRound", true);
        io.to(roomNumber).emit("newRound", player);
      }, BREAK_TIME * 1000);
    }
  }, 1000);
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

  // Check if the user already answered correctly
  if (room.turns[user_id] > 0) {
    console.log(`${username} already answered correctly.`);
    // return;
  }

  // Check if the answer is correct
  if (answer.toLowerCase() === room.countryName.toLowerCase()) {
    // Determine points based on the order of correct answers
    const correctAnswersCount = Object.values(room.turns).filter(
      (points) => points > 0
    ).length;
    const pointsAwarded = Math.max(1000 - correctAnswersCount * 50, 100);

    // Update player's points
    const player = room.players.find((p) => p.id === user_id);
    if (player) {
      player.points = (player.points || 0) + pointsAwarded; // Add points to player's total
    }

    console.log(
      `${username} answered correctly and earned ${pointsAwarded} points.`
    );

    // Broadcast the updated scores and answer to everyone in the room
    io.to(room_number).emit("receiveAnswer", {
      username,
      answer: "Correct Answer!!",
      correct: true,
      points: player.points,
    });
  } else {
    console.log(`${username} answered incorrectly.`);
    io.to(room_number).emit("receiveAnswer", {
      username,
      answer,
      correct: false,
    });
  }
};
