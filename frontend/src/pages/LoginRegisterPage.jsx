import { useState } from "react";
import { postFetch } from "../utils/fetch.js";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { MyContext } from "../store/store.jsx";
import { socket } from "../socket/socket.js";

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { setUserData } = useContext(MyContext);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = () => {
    if (isLogin) {
      if (!email || !password) {
        alert("Semua field harus diisi!");
        return;
      }

      postFetch("/api/login", { email: email, password: password }).then(
        (res) => {
          if (!res.success) {
            alert(res.response.data.msg);
          }
          sessionStorage.setItem("waclone-token", res.data.token);

          socket.auth.token = res.data.token;
          socket.connect();

          setUserData(res.data.userData);

          navigate("/main-menu");
        }
      );
    } else {
      if (!username || !email || !password || !confirmPassword) {
        alert("Semua field harus diisi!");
        return;
      } else if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
      }
      console.log(username, email, password, confirmPassword);

      postFetch("/api/register", {
        username: username,
        email: email,
        password: password,
      }).then((res) => {
        if (!res.success) {
          alert(res.response.data.msg);
          return;
        }

        alert("Berhasil mendaftar, silahkan Login!");
        resetValue();
      });
    }
  };
  const handleIsLogin = () => {
    resetValue();
    setIsLogin(!isLogin);
  };
  const resetValue = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  if (isLogin) {
    return (
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <div
          className="p-3 border border-2 border-secondary rounded"
          style={{ width: "400px" }}
        >
          <h1 className="text-center">Login</h1>
          <div>
            <label className="form-label" htmlFor="email">
              email
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
            <label className="form-label" htmlFor="password">
              password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-outline-secondary mt-3"
                onClick={handleIsLogin}
              >
                Register
              </button>
              <button
                className="btn btn-outline-secondary mt-3"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div
        className="mx-auto p-3 my-auto  border border-2 border-secondary rounded"
        style={{ width: "400px" }}
      >
        <h1 className="text-center">Register</h1>
        <div>
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <label className="form-label" htmlFor="email">
            email
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
          <label className="form-label" htmlFor="password">
            password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label className="form-label" htmlFor="confirm-password">
            confirm-password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary mt-3"
              onClick={handleIsLogin}
            >
              Login
            </button>
            <button
              className="btn btn-outline-secondary mt-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
