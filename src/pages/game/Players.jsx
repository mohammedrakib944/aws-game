import { useEffect } from "react";
import toast from "react-hot-toast";
import { useGameContext } from "../../context/game-context";
const Players = () => {
  const roomInfo = useGameContext().roomInfo;

  useEffect(() => {
    if (roomInfo?.isLeft) {
      toast(roomInfo.message);
    }
  }, [roomInfo]);

  return (
    <div>
      <h2 className="text-xl font-bold pb-1">
        {roomInfo?.players?.length} Participants
      </h2>
      <div className="h-[500px] overflow-y-auto bg-gray-50 rounded-lg border space-y-1">
        {roomInfo?.players &&
          roomInfo.players?.map((player, index) => (
            <div
              key={index}
              className="px-4 py-2 border-b flex items-center justify-between"
            >
              <h4 className="text-lg font-bold">{player?.username}</h4>
              <p className="text-xs">
                {player?.playing ? "Playing" : "Not playing"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Players;
