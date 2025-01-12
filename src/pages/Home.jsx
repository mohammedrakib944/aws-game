import Button from "../components/button";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { generateUniqueNumber } from "../utils/helper";
import Navbar from "../components/Navbar";
import Logo from "../assets/Logo.svg";

import { socket } from "../hooks/base";
import { useGameContext } from "../context/game-context";
import { v4 as uuidv4 } from "uuid";
import birdGif from "../assets/bird.gif";

const RoomType = {
  CREATE: "create",
  JOIN: "join",
};

const Home = () => {
  const [name, setName] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setRoomInfo = useGameContext().setRoomInfo;
  const setUserInfo = useGameContext().setUserInfo;
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
      id: uuidv4(),
      username: name,
      room_number: uniqueNumber,
    };

    setUserInfo(gamePayload);

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
      <img
        src={birdGif}
        className="w-[100px] absolute top-[100px] transform -translate-y-1/2 animate-fly"
      />
      <Navbar />
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="px-10 py-5 blur-bg">
          <div className="text-center pb-3">
            <div className="flex items-end gap-2 justify-center">
              <img src={Logo} className="w-[250px]" />
              <span className="text-sm -mb-0.5">
                {roomType === RoomType.CREATE ? "Create" : "Join"}{" "}
              </span>
            </div>
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
            {roomType !== RoomType.CREATE && (
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
            )}

            {showError && (
              <p className="text-red-500 font-semibold">
                Please enter required fields!
              </p>
            )}
            <Button type="submit">
              {roomType === RoomType.CREATE
                ? "Create new Room"
                : "Join on a Room"}
            </Button>

            <div className="text-center">or</div>

            <div className="flex justify-center">
              {roomType === RoomType.CREATE ? (
                <NavLink to="?type=join">
                  <span className="font-semibold text-blue-600 hover:underline">
                    Join on a Room
                  </span>
                </NavLink>
              ) : (
                <NavLink to="?type=create">
                  <span className="font-semibold text-blue-600 hover:underline">
                    Create Room
                  </span>
                </NavLink>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
