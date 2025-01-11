export const STATUS = {
  START_GAME: "not-started",
  CHOOSING: "choosing",
  ROUND_START: "round-start",
  SHOW_ANSWER: "show-answer",
  GAME_OVER: "game-over",
};

export const sendPlayersOfRoom = (io, room_number, data) => {
  io.to(room_number).emit("playerList", data);
};

export const broadcastNewRound = (io, room_number, playerInfo) => {
  io.to(room_number).emit("newRound", playerInfo);
};

export const broadcastCharacters = (
  io,
  room_number,
  str_length,
  selected_indices
) => {
  // countrySelected <- privious
  io.to(room_number).emit("characters", {
    str_len: str_length,
    index: selected_indices,
  });
};

export const sendTimer = (io, room_number, seconds) => {
  io.to(room_number).emit("timer", seconds);
};

export const sendStatus = (io, room_number, status = "", data) => {
  io.to(room_number).emit("currentStatus", {
    status,
    data,
  });
};

export const broadcastHints = (io, room_number, hint) => {
  io.to(room_number).emit("receiveHint", { hint });
};

export const broadcastAnswer = (io, room_number, data) => {
  io.to(room_number).emit("receiveAnswer", data);
};
