import Navbar from "../components/Navbar";
import Answers from "./game/Answers";
import { socket } from "../hooks/base";
import { useNavigate } from "react-router";
import Hints from "./game/Hints";
import Players from "./game/Players";
import { useEffect, useState } from "react";
import useGameStartup from "../hooks/useGameStartup";
import { useSearchParams } from "react-router";
import Button from "../components/button";
import Modal from "../sections/modal";
import { useGameContext } from "../context/game-context";
import PrintName from "./game/PrintName";

const Game = () => {
  const [searchParams] = useSearchParams();
  const [isStarted, setIsStarted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const room_number = searchParams.get("room");
  const roomInfo = useGameContext().roomInfo;
  const userInfo = useGameContext().userInfo;
  const location = useGameContext().location;
  const { countrySelector, countrySelected } = useGameStartup();

  console.log("Country Selected: ", countrySelected);

  const handleStartGame = () => {
    socket.emit("startGame", {
      room_number,
      id: userInfo?.id,
      username: userInfo?.username,
    });
    setIsStarted(true);
  };

  const handleSelectCountry = () => {
    if (!location) return;
    socket.emit("selectCountry", {
      room_number,
      country: location,
    });
    setShowMap(false);
  };

  useEffect(() => {
    if (!socket.connected) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (
      countrySelector?.id === userInfo?.id &&
      countrySelected?.status !== "running"
    ) {
      setShowMap(true);
    }
  }, [countrySelector, userInfo, countrySelected]);

  return (
    <div>
      <Modal showMap={showMap} handleSelectCountry={handleSelectCountry} />
      <Navbar />
      <div className="flex flex-col items-center justify-center pb-4">
        <h1 className="text-4xl text-center font-bold uppercase">Timer: 60</h1>
        <p>
          Room: <span className="font-semibold">{room_number}</span>
        </p>
        <div className="pt-3">
          {countrySelected && <PrintName data={countrySelected} />}
        </div>
      </div>
      {/* <MapView /> */}
      <div className="max-w-[1200px] border rounded-lg shadow-xl mx-auto flex gap-2 lg:gap-4 px-2 lg:px-5 py-4">
        <div className="w-[250px]">
          <Players />
        </div>
        <div className="w-full min-h-[500px] flex items-center justify-center">
          {!isStarted && !countrySelector && (
            <div className="w-full flex flex-col gap-4 items-center justify-center">
              <h2 className="text-xl font-semibold">
                {roomInfo?.admin?.id === userInfo?.id ? (
                  <div className="text-center">
                    <p className="pb-4 text-4xl font-semibold">
                      Start the game now!
                    </p>
                    <Button onClick={handleStartGame}>Start Game</Button>
                  </div>
                ) : (
                  `Wait for ${roomInfo?.admin?.username} (Admin) to start the game.`
                )}
              </h2>
            </div>
          )}
          {countrySelector && !countrySelected && (
            <h4 className="text-xl font-semibold">
              {countrySelector.username} is choosing a Place!
            </h4>
          )}
          {countrySelected && (
            <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
              <Hints />
              <Answers />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
