import React from "react";
import { useGameContext } from "../context/game-context";
import Button from "../components/button";

const GameContainer = () => {
  const { location } = useGameContext();

  return (
    <div className=" bg-white border-t border-black/20 mt-[calc(70vh-30px)] min-h-lvh relative z-40 rounded-t-3xl top-shadow p-10">
      <div className="text-font text-xl flex flex-col gap-2 items-center  space-y-5">
        <p className="text-3xl flex gap-3 items-center">
          <img className="size-10" src="/icons/map.png" alt="Map" />
          <span className="font-bold">Select a Location</span>
        </p>
        <p className="border bg-gray-100 py-3 font-semibold px-5 rounded-xl">
          {location || "Search / Point a place"}
        </p>
        <Button>Confirm Location</Button>
      </div>
    </div>
  );
};

export default GameContainer;
