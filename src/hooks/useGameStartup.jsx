import { useEffect, useState } from "react";
import { socket } from "./base";
import { useGameContext } from "../context/game-context";

const useGameStartup = () => {
  const setRoomInfo = useGameContext().setRoomInfo;

  const [countrySelector, setCountrySelector] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  const [hintsReceived, setHintsReceived] = useState(null);
  const [answerReceived, setAnswerReceived] = useState(null);
  const [endRound, setEndRound] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("playerList", (room) => {
      setRoomInfo(room);
    });

    socket.on("newRound", (data) => {
      setCountrySelector(data);
    });

    socket.on("countrySelected", (data) => {
      setCountrySelected(data);
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

    socket.on("endRound", (data) => {
      setEndRound(data);
    });

    return () => {
      socket.off("playerList");
      socket.off("newRound");
      socket.off("countrySelected");
      socket.off("receiveHint");
      socket.off("receiveAnswer");
      socket.off("timer");
      socket.off("endRound");
    };
  }, []);

  return {
    countrySelector,
    countrySelected,
    hintsReceived,
    answerReceived,
    timer,
    endRound,
  };
};

export default useGameStartup;
