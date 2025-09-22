import { useContext, useState } from "react";
import ChatListComponent from "../components/ChatComponents/ChatListComponent";
import Navbar from "../components/NavigationComponents/Navbar";
import MainSection from "../components/MainSection";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function MainMenu() {
  const [mode, setMode] = useState("");

  const navigate = useNavigate();
  const token = sessionStorage.getItem("waclone-token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="container-fluid row p-0 m-0" style={{ height: "100vh" }}>
      <div className="col-5 border-end border-2">
        <Navbar setMode={setMode} />
        <ChatListComponent />
      </div>

      <div className="container col-7 p-0">
        <MainSection />
      </div>
    </div>
  );
}
