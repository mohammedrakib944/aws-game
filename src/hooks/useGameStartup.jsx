import { useEffect, useState } from "react";
import { socket } from "./base";
import { useGameContext } from "../context/game-context";

const useGameStartup = () => {
  const setRoomInfo = useGameContext().setRoomInfo;

  const [countrySelector, setCountrySelector] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  // const [hint, setHint] = useState("");
  // const [hintsReceived, setHintsReceived] = useState([]);

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

    // socket.on("receiveHint", ({ hint }) => {
    //   setHintsReceived((prevHints) => [...prevHints, hint]);
    // });

    return () => {
      socket.off("playerList");
      socket.off("newRound");
      socket.off("countrySelected");
      // socket.off("receiveHint");
      // socket.off("countrySelected");
    };
  }, []);

  // const handleSelectCountry = () => {
  //   if (username === countrySelector) {
  //     socket.emit("selectCountry", { room_number: roomNumber, country });
  //   } else {
  //     alert("Only the country selector can choose the country.");
  //   }
  // };

  // const sendHint = () => {
  //   socket.emit("sendHint", { room_number: roomNumber, hint });
  //   setHint("");
  // };

  return { countrySelector, countrySelected };
};

export default useGameStartup;
