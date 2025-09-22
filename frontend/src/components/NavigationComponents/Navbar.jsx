import { useNavigate } from "react-router";
import { useContext } from "react";
import { MyContext } from "../../store/store.jsx";
import { socket } from "../../socket/socket.js";

export default function Navbar() {
  const navigate = useNavigate();
  const { setMode, userData, room } = useContext(MyContext);

  const handleModeChange = (mode) => {
    setMode(mode);
  };
  const handleLogout = () => {
    if (confirm("Yakin mau keluar?")) {
      sessionStorage.removeItem("waclone-token");
      setMode("");
      socket.emit("leave-grub", { room });
      socket.disconnect();
      navigate("/");
    }
  };

  return (
    <nav className="p-2 border rounded border-2" style={{ height: 150 }}>
      <div className="d-flex my-1 justify-content-between">
        <div className="">
          <img
            className="rounded-circle"
            src={userData.profilePhotoUrl}
            alt="profil"
            style={{ width: 50, height: 50 }}
          />
          <p className="text-center mb-0">{userData.username}</p>
          {socket.connected ? (
            <p className="text-center mb-0">Online</p>
          ) : (
            <p className="text-center mb-0">Offline</p>
          )}
        </div>
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Fitur
            </button>
            <ul className="dropdown-menu p-2">
              <li>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => handleModeChange("find-friends")}
                >
                  Cari teman
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleModeChange("friend-request")}
                  style={{ cursor: "pointer" }}
                >
                  Permintaan pertemanan
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleModeChange("create-group")}
                  style={{ cursor: "pointer" }}
                >
                  Buat grub
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleModeChange("blacklisted-user")}
                  style={{ cursor: "pointer" }}
                >
                  Daftar blaclist
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleModeChange("settings")}
                  style={{ cursor: "pointer" }}
                >
                  Pengaturan
                </p>
              </li>
              <li>
                <p onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
