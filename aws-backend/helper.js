export const getPlayer = (room, maxTurns = 3) => {
  const { players, turns } = room;

  // Find the first player who hasn't completed max turns
  const nextPlayer = players.find((player) => turns[player.id] < maxTurns);

  if (!nextPlayer) {
    return null; // All players have completed the maximum number of turns
  }

  // Update the player's turn count and set playing status to true
  turns[nextPlayer.id] += 1;
  nextPlayer.playing = true;

  // Return the updated player object
  return nextPlayer;
};

export const sendRandomCharacter = (io, roomNumber, str) => {
  const intervalTime = Math.round(100 / str.length) * 1000; // Convert to milliseconds
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
    return;
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
      room.turns[user_id] = pointsAwarded; // Record the points for this turn
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
