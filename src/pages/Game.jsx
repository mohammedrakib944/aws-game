import Navbar from "../components/Navbar";
import Answers from "./game/Answers";
import { socket } from "../hooks/base";
import { NavLink, useNavigate } from "react-router";
import Hints from "./game/Hints";
import Players from "./game/Players";
import { useEffect, useState } from "react";
import useGameStartup from "../hooks/useGameStartup";
import { useSearchParams } from "react-router";
import Button from "../components/button";
import Modal from "../sections/modal";
import { useGameContext } from "../context/game-context";
import PrintName from "./game/PrintName";
import { playSound } from "../utils/helper";
import toast from "react-hot-toast";

import roundStartAudio from "../assets/round-start.wav";
import gameOverAudio from "../assets/game-over.wav";
import correctAnswerAudio from "../assets/correct-answer.mp3";
import newJoinAudio from "../assets/new-join.mp3";
import birdGif from "../assets/bird.gif";

export const STATUS = {
  START_GAME: "not-started",
  CHOOSING: "choosing",
  ROUND_START: "round-start",
  SHOW_ANSWER: "show-answer",
  GAME_OVER: "game-over",
};

const Game = () => {
  const [searchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const room_number = searchParams.get("room");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(null);
  const [shouldReset, setShouldReset] = useState(false);
  const userInfo = useGameContext().userInfo;
  const roomInfo = useGameContext().roomInfo;
  const location = useGameContext().location;
  const setLocation = useGameContext().setLocation;
  const { hintsReceived, answerReceived, timer, status, characters, newJoin } =
    useGameStartup();

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
    setLocation("");
  };

  useEffect(() => {
    if (characters?.clear) {
      setShouldReset(true);
    } else {
      setShouldReset(false);
    }
  }, [characters]);

  useEffect(() => {
    if (!socket.connected) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (newJoin) {
      playSound(newJoinAudio);
      toast.success(newJoin.message);
    }
  }, [newJoin]);

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
      playSound(correctAnswerAudio);
      setShowAnswer(status?.data.answer);
    } else {
      setShowAnswer(null);
    }

    if (status?.status === STATUS.GAME_OVER) {
      playSound(gameOverAudio);
    }
    if (status?.status === STATUS.ROUND_START) {
      playSound(roundStartAudio);
    }
  }, [status, userInfo]);

  let content;

  if (status?.status === STATUS.START_GAME || !status) {
    let isAdmin;
    let message;

    if (status?.data) {
      isAdmin = status.data.admin_id === userInfo.id;
      message = status.data.message;
    }

    if (roomInfo.admin && userInfo) {
      isAdmin = roomInfo.admin.id === userInfo.id;
      message = `Wait please!`;
    }

    content = (
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <h2 className="text-xl font-semibold">
          {isAdmin ? (
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
  } else {
    content = (
      <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
        <Hints
          room_number={room_number}
          isOwner={isPlaying}
          reset={shouldReset}
          hintsReceived={hintsReceived}
        />
        <Answers
          room_number={room_number}
          isOwner={isPlaying}
          reset={shouldReset}
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
        <div className="w-fit mt-3 border px-5 py-2 rounded-lg shadow-lg">
          <h2 className="font-semibold text-center pb-1 text-lg border-b mb-1">
            Rank list
          </h2>
          <table>
            <tbody>
              {points.map((player, index) => (
                <tr key={index}>
                  <td className="px-3 py-1 font-semibold text-green-600 ">
                    {index + 1}
                  </td>
                  <td className="px-3 py-1 font-semibold">{player.username}</td>
                  <td className="px-3 py-1 font-semibold text-blue-600">
                    {player.points}
                  </td>
                  <td className="px-3 py-1 text-sm">Points</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {admin_id === userInfo.id ? (
          <div className="pt-4">
            <Button onClick={handleStartGame}>Start Game Again?</Button>
            <NavLink to="/" className="block text-center pt-3">
              <span className="font-semibold text-blue-600 hover:underline">
                Go Home
              </span>
            </NavLink>
          </div>
        ) : (
          <p className="pt-5 font-bold">
            Admin will decide game start again or not!
            <NavLink to="/" className="block text-center pt-3">
              <span className="font-semibold text-blue-600 hover:underline">
                Go Home
              </span>
            </NavLink>
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Modal showMap={showMap} handleSelectCountry={handleSelectCountry} />
      <Navbar name={userInfo?.username} />

      <img
        src={birdGif}
        className="w-[100px] absolute top-3 transform -translate-y-1/2 animate-fly"
      />

      <div className="system-width">
        <div className="flex items-end justify-between pt-4 pb-3">
          <h1 className="text-xl font-semibold">
            Timer:{" "}
            <span className="text-blue-600 text-2xl font-bold">{timer}</span>
          </h1>

          <h1>
            {characters && (
              <PrintName data={characters} status={status?.status} />
            )}
          </h1>
          <h1 className="text-xl">
            <span className="text-base font-semibold">Share this code</span>{" "}
            <span className="font-semibold text-blue-600">{room_number}</span>
          </h1>
        </div>

        <div className="bg-white border-2 border-black/20 rounded-lg shadow-xl flex gap-2 lg:gap-4 px-2 lg:px-5 py-4 relative">
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
            <Players reset={status?.status === STATUS.GAME_OVER} />
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
