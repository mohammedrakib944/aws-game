import React from "react";
import SelectLocation from "../components/select-location";

const GameContainer = () => {
  return (
    <div className=" bg-white border-t border-black/20 mt-[calc(70vh-30px)] min-h-lvh relative z-40 rounded-t-3xl top-shadow p-10">
      <SelectLocation />
    </div>
  );
};

export default GameContainer;
