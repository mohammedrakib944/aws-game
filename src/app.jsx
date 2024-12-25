import React from "react";
import MapView from "./sections/map-view";
import GameContainer from "./sections/game-container";

const App = () => {
  return (
    <div className="relative">
      <MapView />
      <GameContainer />
    </div>
  );
};

export default App;
