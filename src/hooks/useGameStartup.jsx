import { useEffect } from "react";
import { socket } from "./base";
import { useGameContext } from "../context/game-context";

const useGameStartup = () => {
  const setRoomInfo = useGameContext().setRoomInfo;

  // const [countrySelector, setCountrySelector] = useState("");
  // const [country, setCountry] = useState("");
  // const [hint, setHint] = useState("");
  // const [hintsReceived, setHintsReceived] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("playerList", (room) => {
      setRoomInfo(room);
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

  // return {};
};

export default useGameStartup;
