import Navbar from "../components/Navbar";
import Answers from "./game/Answers";
import { socket } from "../hooks/base";
import { useNavigate } from "react-router";
import Hints from "./game/Hints";
import Players from "./game/Players";
import { useEffect, useState } from "react";
import useGameStartup from "../hooks/useGameStartup";
import Button from "../components/button";
import Modal from "../sections/modal";

const Game = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  useGameStartup();
  const navigate = useNavigate();
  const choosing = true;

  useEffect(() => {
    if (!socket.connected) navigate("/");
  }, [navigate]);

  const handleStartGame = () => {
    // alert("Game started!");
    setIsStarted(true);
  };

  return (
    <div>
      <Modal showMap={showMap} setShowMap={setShowMap} />
      <Navbar />
      <h1 className="text-4xl text-center font-bold uppercase pb-4">
        Timer: 60
      </h1>
      {/* <MapView /> */}
      <div className="max-w-[1200px] border rounded-lg shadow-xl mx-auto flex gap-2 lg:gap-4 px-2 lg:px-5 py-4">
        <div className="w-[250px]">
          <Players />
        </div>
        <div className="w-full min-h-[500px] flex items-center justify-center">
          {isStarted ? (
            choosing ? (
              <h4 className="text-xl font-semibold">
                Tomal is choosing a Place!
              </h4>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
                <Hints />
                <Answers />
              </div>
            )
          ) : (
            <div className="w-full flex flex-col gap-4 items-center justify-center">
              <h2 className="text-xl font-semibold">
                Want for Admin (Polok) to start the game.
              </h2>
              <Button onClick={handleStartGame}>Start Game</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
