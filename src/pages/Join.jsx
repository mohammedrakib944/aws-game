import Button from "../components/button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { generateUniqueNumber } from "../utils/helper";
import Navbar from "../components/Navbar";

import { socket } from "../hooks/base";
import { useGameContext } from "../context/game-context";

const RoomType = {
  CREATE: "create",
  JOIN: "join",
};

const Join = () => {
  const [name, setName] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setRoomInfo = useGameContext().setRoomInfo;
  const roomType = searchParams.get("type");

  useEffect(() => {
    if (roomType === RoomType.CREATE) {
      const number = generateUniqueNumber();
      setUniqueNumber(number);
    }

    if (roomType !== RoomType.CREATE && roomType !== RoomType.JOIN) {
      navigate("/");
    }
  }, [roomType, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (uniqueNumber.length !== 6 || !name) {
      setShowError(true);
      return;
    }

    const gamePayload = {
      username: name,
      room_number: uniqueNumber,
    };

    // Ensure the socket is connected before emitting
    if (!socket.connected) {
      socket.connect();
    }

    if (socket.connected) {
      socket.emit("joinRoom", gamePayload, (response) => {
        setRoomInfo(response);
      });
      navigate("/game?room=" + uniqueNumber);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center">
        <div>
          <div className="text-center pb-3">
            <h1 className="text-5xl font-bold pb-2">Hide and Seek</h1>
            <h2 className="text-3xl font-semibold text-gray-600">
              {roomType === RoomType.JOIN ? "Join" : "Create"} Game
            </h2>
          </div>
          <form
            action=""
            className="flex flex-col gap-y-4 my-4"
            onSubmit={submitHandler}
          >
            <div className="">
              <p className="pb-1">Your name *</p>
              <input
                type="text"
                className="w-[400px] input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {roomType === RoomType.JOIN ? (
              <div>
                <p className="pb-1">Room number (6 digit)*</p>
                <input
                  type="text"
                  className="w-[400px] input"
                  placeholder="Enter room number"
                  value={uniqueNumber}
                  onChange={(e) => setUniqueNumber(e.target.value)}
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold">{uniqueNumber}</p>
                <p className="text-green-700 font-semibold">
                  Share this code with your friends
                </p>
              </div>
            )}
            {showError && (
              <p className="text-red-500 font-semibold">
                Please enter required fields!
              </p>
            )}
            <Button>Enter game room</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Join;
