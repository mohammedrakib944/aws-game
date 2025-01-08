import { useEffect, useState } from "react";
import { socket } from "./base";
import { useGameContext } from "../context/game-context";

const useGameStartup = () => {
  const setRoomInfo = useGameContext().setRoomInfo;

  const [countrySelector, setCountrySelector] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  const [hintsReceived, setHintsReceived] = useState(null);
  const [answerReceived, setAnswerReceived] = useState(null);

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

    return () => {
      socket.off("playerList");
      socket.off("newRound");
      socket.off("countrySelected");
      socket.off("receiveHint");
      socket.off("receiveAnswer");
    };
  }, []);

  return { countrySelector, countrySelected, hintsReceived, answerReceived };
};

export default useGameStartup;
