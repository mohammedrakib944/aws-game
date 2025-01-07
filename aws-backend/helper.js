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
