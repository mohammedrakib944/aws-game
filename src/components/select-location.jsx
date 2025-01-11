import { useGameContext } from "../context/game-context";
import Button from "../components/button";
import Loader from "./loader";

const SelectLocation = () => {
  const { location, loadingLocation } = useGameContext();
  return (
    <div className="text-font text-xl flex flex-col gap-2 items-center  space-y-5">
      <p className="text-3xl flex gap-3 items-center">
        <img className="size-10" src="/icons/map.png" alt="Map" />
        <span className="font-bold">Select a Location</span>
      </p>
      <div className="border bg-gray-100 py-3 font-semibold px-5 rounded-xl">
        {loadingLocation ? (
          <Loader text="Loading location..." />
        ) : (
          location || "Search / Point a place"
        )}
      </div>
      <Button>Confirm Location</Button>
    </div>
  );
};

export default SelectLocation;
