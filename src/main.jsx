import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app.jsx";
import GameContextProvider from "./context/game-context.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameContextProvider>
      <Toaster position="bottom-right" />
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </GameContextProvider>
  </React.StrictMode>
);
