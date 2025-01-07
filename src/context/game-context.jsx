import { createContext, useContext, useState } from "react";

const gameContext = createContext(null);

export const useGameContext = () => useContext(gameContext);

const GameContextProvider = ({ children }) => {
  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [roomInfo, setRoomInfo] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const values = {
    location,
    setLocation,
    loadingLocation,
    setLoadingLocation,
    roomInfo,
    setRoomInfo,
    userInfo,
    setUserInfo,
  };

  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
};

export default GameContextProvider;
