export const STATUS = {
  START_GAME: "not-started", // {admin, admin_id, message}
  CHOOSING: "choosing", // {message, user_id} -> see the modal to owner, other messsage
  ROUND_START: "round-start", // see the hints and message box
  SHOW_ANSWER: "show-answer", // {answer} show the answeer
  GAME_OVER: "game-over", // { points: players_list } all player points
};

export const sendStatus = (io, room_number, status = "", data) => {
  io.to(room_number).emit("currentStatus", {
    status,
    data,
  });
};

export const newJoin = (io, room_number, data) => {
  io.to(room_number).emit("newJoin", data);
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
  selected_indices,
  clear = false
) => {
  // countrySelected <- privious
  io.to(room_number).emit("characters", {
    str_len: str_length,
    index: selected_indices,
    clear,
  });
};

export const sendTimer = (io, room_number, seconds) => {
  io.to(room_number).emit("timer", seconds);
};

export const broadcastHints = (io, room_number, hint) => {
  io.to(room_number).emit("receiveHint", { hint });
};

export const broadcastAnswer = (io, room_number, data) => {
  io.to(room_number).emit("receiveAnswer", data);
};
