import { useState, useEffect } from "react";
import io from "socket.io-client";

export const API_BASE_URL = "http://localhost:8000";

export const socket = io(API_BASE_URL);

const useSocket = () => {
  const [players, setPlayers] = useState([]);
  // const [countrySelector, setCountrySelector] = useState("");
  // const [country, setCountry] = useState("");
  // const [hint, setHint] = useState("");
  // const [hintsReceived, setHintsReceived] = useState([]);

  useEffect(() => {
    socket.on("playerList", (players) => {
      setPlayers(players);
    });

    // socket.on("countrySelector", ({ username }) => {
    //   setCountrySelector(username);
    // });

    // socket.on("receiveHint", ({ hint }) => {
    //   setHintsReceived((prevHints) => [...prevHints, hint]);
    // });

    return () => {
      socket.off("playerList");
      // socket.off("countrySelector");
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

  return { players };
};

export default useSocket;
