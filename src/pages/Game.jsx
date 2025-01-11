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

const STATUS = {
  START_GAME: "not-started", // {admin, admin_id, message}
  CHOOSING: "choosing", // {message, user_id} -> see the modal to owner, other messsage
  ROUND_START: "round-start", // see the hints and message box
  SHOW_ANSWER: "show-answer", // {answer} show the answeer
  GAME_OVER: "game-over", // { points: players_list } all player points
};

const Game = () => {
  const [searchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const room_number = searchParams.get("room");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(null);
  const userInfo = useGameContext().userInfo;
  const location = useGameContext().location;
  const { hintsReceived, answerReceived, timer, status, characters } =
    useGameStartup();

  console.log("Status: ", status);

  const handleStartGame = () => {
    socket.emit("startGame", {
      room_number,
      id: userInfo?.id,
      username: userInfo?.username,
    });
  };

  const handleSelectCountry = () => {
    if (!location) return;
    socket.emit("selectCountry", {
      room_number,
      country: location,
      user_id: userInfo?.id,
    });
    setShowMap(false);
  };

  useEffect(() => {
    if (!socket.connected) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (status?.status === STATUS.CHOOSING) {
      const data = status.data;
      if (data?.user_id === userInfo.id) {
        setShowMap(true);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }

    if (status?.status === STATUS.SHOW_ANSWER) {
      setShowAnswer(status?.data.answer);
    } else {
      setShowAnswer(null);
    }
  }, [status, userInfo]);

  let content;

  if (status?.status === STATUS.START_GAME) {
    const { admin_id, message } = status.data;
    content = (
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <h2 className="text-xl font-semibold">
          {admin_id === userInfo.id ? (
            <div className="text-center">
              <p className="pb-4 text-3xl font-semibold">Start the game now!</p>
              <Button onClick={handleStartGame}>Start Game</Button>
            </div>
          ) : (
            <span className="text-xl font-semibold">{message}</span>
          )}
        </h2>
      </div>
    );
  }

  if (status?.status !== STATUS.START_GAME) {
    content = (
      <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
        <Hints
          room_number={room_number}
          isOwner={isPlaying}
          hintsReceived={hintsReceived}
        />
        <Answers
          room_number={room_number}
          isOwner={isPlaying}
          answerReceived={answerReceived}
          userInfo={userInfo}
        />
      </div>
    );
  }

  if (status?.status === STATUS.GAME_OVER) {
    const { points = [], admin_id } = status.data;

    content = (
      <div className="max-h-[70%] overflow-y-auto flex flex-col items-center">
        <h2 className="text-4xl font-bold">Game is over!</h2>
        {handleStartGame}
        <div className="w-fit mt-3 border px-5 py-2 rounded-lg shadow-lg">
          {points.map((player, index) => (
            <p key={index} className="pb-1">
              <span className="font-bold text-blue-600">{index + 1}</span> -{" "}
              <span className="font-semibold">{player.username}</span>{" "}
              <span className="text-green-600 font-semibold">
                {player.points}
              </span>{" "}
              <span className="text-xs">Points</span>
            </p>
          ))}
        </div>

        {admin_id === userInfo.id ? (
          <div className="pt-4">
            <Button onClick={handleStartGame}>Start Game Again?</Button>
          </div>
        ) : (
          <p className="text-sm pt-3 font-bold text-blue-600">
            Admin will decide game start again or not!
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Modal showMap={showMap} handleSelectCountry={handleSelectCountry} />
      <Navbar name={userInfo?.username} />

      <div className="system-width">
        <div className="flex items-end justify-between pt-4 pb-3">
          <h1 className="text-xl font-semibold">
            Timer:{" "}
            <span className="text-blue-600 text-2xl font-bold">{timer}</span>
          </h1>

          <h1>
            {characters && (
              <PrintName
                clearString={status?.status === STATUS.SHOW_ANSWER}
                data={characters}
              />
            )}
          </h1>
          <h1 className="text-xl">
            Room: <span className="font-semibold">{room_number}</span>
          </h1>
        </div>

        <div className="border rounded-lg shadow-xl flex gap-2 lg:gap-4 px-2 lg:px-5 py-4 relative">
          {status?.status === STATUS.CHOOSING &&
            status?.data?.user_id !== userInfo.id && (
              <div className="absolute w-full h-full top-0 left-0 bg-sky-600/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <h2 className="text-4xl text-white">{status?.data?.message}</h2>
              </div>
            )}

          {showAnswer && (
            <div className="absolute w-full h-full top-0 left-0 bg-[#3e8c3e]/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <h2 className="text-4xl text-white">{showAnswer}</h2>
            </div>
          )}

          <div className="w-[250px]">
            <Players />
          </div>
          <div className="w-full min-h-[500px] flex items-center justify-center">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
