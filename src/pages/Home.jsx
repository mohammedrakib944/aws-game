import { NavLink } from "react-router";
import Button from "../components/button";
// import cover from "/assets/cover.png";

const Home = () => {
  return (
    <div
      className="min-h-screen flex justify-center items-center"
      // style={{
      //   backgroundImage: `url(${cover})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hide & Seek</h1>
        <div className=" space-x-2">
          <NavLink to="/join?type=create">
            <Button>Create Room</Button>
          </NavLink>
          <NavLink to="/join?type=join">
            <Button>Join</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
