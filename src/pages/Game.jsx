// import MapView from "../sections/map-view";
import Navbar from "../components/Navbar";
import useSocket from "../hooks/useSocket";
import Answers from "../sections/Answers";
// import GameContainer from "../sections/game-container";
import Hints from "../sections/Hints";
import Players from "../sections/Players";

const Game = () => {
  const { roomInfo } = useSocket();

  console.log("Players: ", roomInfo);

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl text-center font-bold uppercase pb-4">
        Timer: 60
      </h1>
      {/* <MapView /> */}
      <div className="max-w-[1200px] mx-auto flex gap-2 lg:gap-4 px-2 lg:px-5 py-4">
        <div className="w-[250px]">
          <Players roomInfo={roomInfo} />
        </div>
        <div className="w-full grid grid-cols-2 gap-2 lg:gap-4">
          <Hints />
          <Answers />
        </div>
      </div>
    </div>
  );
};

export default Game;
