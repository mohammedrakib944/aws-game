import Button from "../components/button";
import Loader from "../components/loader";
import { useGameContext } from "../context/game-context";
import MapView from "./map-view";

const Modal = ({ showMap, handleSelectCountry }) => {
  const { location, loadingLocation } = useGameContext();

  return (
    <>
      {showMap ? (
        <div className="fixed w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[80%] h-[70%] mx-auto rounded-xl p-4 border bg-white relative">
            <div className="absolute w-[500px] -top-16 left-1/2 -translate-x-1/2 bg-white px-7 pb-5 pt-3 rounded-xl text-lg font-semibold text-center flex items-center justify-between">
              <div>
                {loadingLocation ? (
                  <Loader text="Loading location..." />
                ) : (
                  <h4 className="text-xl font-semibold">
                    {location || "Search or point a place"}
                  </h4>
                )}
              </div>

              <Button disabled={!location} onClick={handleSelectCountry}>
                Confirm
              </Button>
            </div>
            <MapView />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
