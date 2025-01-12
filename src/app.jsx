import Home from "./pages/Home";
import { socket } from "./hooks/base";

const App = () => {
  if (socket.connected) socket.disconnect();
  return (
    <div>
      <Home />
    </div>
  );
};
export default App;
