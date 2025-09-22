import LoginRegisterPage from "./pages/LoginRegisterPage";
import MainMenu from "./pages/MainMenu";
import { Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("uy");
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoginRegisterPage />} />
      <Route path="/main-menu" element={<MainMenu />} />
    </Routes>
  );
}

export default App;
