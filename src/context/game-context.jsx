import { createContext, useContext, useState } from "react";

const gameContext = createContext(null);

export const useGameContext = () => useContext(gameContext);

const GameContextProvider = ({ children }) => {
  const [location, setLocation] = useState("");

  const values = {
    location,
    setLocation,
  };

  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
};

export default GameContextProvider;
