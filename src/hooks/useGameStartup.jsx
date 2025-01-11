import { useEffect, useState } from "react";
import { socket } from "./base";
import { useGameContext } from "../context/game-context";

const useGameStartup = () => {
  const setRoomInfo = useGameContext().setRoomInfo;

  const [status, setStatus] = useState(null);
  // const [countrySelector, setCountrySelector] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [hintsReceived, setHintsReceived] = useState(null);
  const [answerReceived, setAnswerReceived] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("playerList", (room) => {
      setRoomInfo(room);
    });

    // socket.on("newRound", (data) => {
    //   setCountrySelector(data);
    // });

    socket.on("characters", (data) => {
      setCharacters(data);
    });

    socket.on("receiveHint", (data) => {
      setHintsReceived(data);
    });

    socket.on("receiveAnswer", (data) => {
      setAnswerReceived(data);
    });

    socket.on("timer", (data) => {
      setTimer(data);
    });

    socket.on("currentStatus", (data) => {
      setStatus(data);
    });

    return () => {
      socket.off("playerList");
      socket.off("characters");
      socket.off("receiveHint");
      socket.off("receiveAnswer");
      socket.off("timer");
      socket.off("currentStatus");
    };
  }, []);

  return {
    hintsReceived,
    answerReceived,
    timer,
    status,
    characters,
  };
};

export default useGameStartup;
