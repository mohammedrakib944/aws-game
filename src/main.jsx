import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app.jsx";
import GameContextProvider from "./context/game-context.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Join from "./pages/Join.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/join",
    element: <Join />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameContextProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </GameContextProvider>
  </React.StrictMode>
);
