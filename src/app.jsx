import Home from "./pages/Home";
import { socket } from "./hooks/base";

const App = () => {
  if (socket.connected) socket.disconnect();
  return (
    <div>
      <h2>Awesome</h2>
      <Home />
    </div>
  );
};
export default App;
