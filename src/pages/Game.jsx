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
  const {
    countrySelector,
    countrySelected,
    hintsReceived,
    answerReceived,
    timer,
    endRound,
  } = useGameStartup();

  const isOwner = countrySelector?.id === userInfo?.id;

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
    if (isOwner && countrySelector?.playing) {
      setShowMap(true);
    }
  }, [countrySelector, isOwner]);

  useEffect(() => {
    if (timer && !isStarted) setIsStarted(true);
  }, [timer, isStarted]);

  return (
    <div>
      <Modal showMap={showMap} handleSelectCountry={handleSelectCountry} />
      <Navbar />

      <div className="system-width">
        <div className="flex items-end justify-between pt-4 pb-3">
          {/* <Timer start={startTimer} onTimeUp={onTimeUp} /> */}
          <h1 className="text-xl font-semibold">
            Timer:{" "}
            <span className="text-blue-600 text-2xl font-bold">{timer}</span>
          </h1>

          <h1>{countrySelected && <PrintName data={countrySelected} />}</h1>
          <h1 className="text-xl">
            Room: <span className="font-semibold">{room_number}</span>
          </h1>
        </div>

        <div className="border rounded-lg shadow-xl flex gap-2 lg:gap-4 px-2 lg:px-5 py-4 relative">
          {!isOwner && countrySelector?.username && !countrySelected && (
            <div className="absolute w-full h-full top-0 left-0 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <h2 className="text-4xl text-white">
                {countrySelector.username} is Choosing a place!
              </h2>
            </div>
          )}

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
            {countrySelected && (
              <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
                <Hints
                  room_number={room_number}
                  isOwner={isOwner}
                  hintsReceived={hintsReceived}
                  reset={endRound}
                />
                <Answers
                  room_number={room_number}
                  isOwner={isOwner}
                  answerReceived={answerReceived}
                  userInfo={userInfo}
                  reset={endRound}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
