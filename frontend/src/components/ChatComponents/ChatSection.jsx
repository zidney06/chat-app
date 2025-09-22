import { useState, useEffect, useContext } from "react";
import { socket } from "../../socket/socket";
import { MyContext } from "../../store/store";
import { delFetch, postFetch } from "../../utils/fetch";

export default function ChatSection() {
  const [message, setMessage] = useState("");
  const {
    room,
    messages,
    setMessages,
    userData,
    chatName,
    setChatList,
    setMode,
  } = useContext(MyContext);

  useEffect(() => {
    console.log("Did mount");

    return () => {
      console.log("un mount");
    };
  }, []);

  useEffect(() => {
    console.log("use effect socket");

    socket.on("success-join-room", (data) => {
      console.log(data);
    });
    socket.on("error", (value) => {
      console.log(value);
      alert(value);
    });
    socket.on("terima", (msg) => {
      console.log(msg, "dari terima");
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("success-delete-message", (data) => {
      const { msgId } = data;

      setMessages((prevMsg) => prevMsg.filter((msg) => msg._id !== msgId));
    });

    // component did un mount
    return () => {
      socket.off("error");
      socket.off("terima");
      socket.off("success-join-room");
      socket.off("success-delete-message");
    };
  }, [socket]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = () => {
    if (!message.trim()) {
      alert("Ketikan pesan dulu!");
      return;
    }
    socket.emit("send-message", {
      room,
      message: message,
      sender: userData.username,
    });
    setMessage("");
  };
  const handleDeleteMessage = (msgId) => {
    console.log("handl dlt");
    socket.emit("delete-message", { msgId, roomName: room.roomName });
  };
  const handleDeleteChat = () => {
    if (room.roomType === "chat") {
      if (confirm("Yakin ingin menghapus pertemanan?")) {
        delFetch(`/api/delete-chat/${room._id}`).then((res) => {
          if (!res.success) {
            alert(res.response.data.msg);
            return;
          }
          setChatList((prev) => {
            return prev.filter((chat) => chat.chatId !== res.data.data.chatId);
          });
          setMode("");
        });
      }
    } else {
      if (confirm("Apakah mau hapus grub?")) {
        delFetch(`/api/delete-grub/${room._id}`).then((res) => {
          if (!res.success) {
            alert(res.response.data.msg);
            return;
          }
          setChatList((prev) => {
            return prev.filter((chat) => chat.chatId !== res.data.data.chatId);
          });
          setMode("");
        });
      }
    }
  };

  const handleLeaveGrub = (roomId) => {
    if (confirm("Yakin mau keluar grub?")) {
      postFetch("/api/leave-grub", { roomId }).then((res) => {
        if (!res.success) {
          return alert(res.response.data.msg);
        }
        console.log(res.data);
        setChatList((prev) => {
          return prev.filter((chat) => chat.chatId !== res.data.data.roomId);
        });
        setMode("");
      });
    }
  };

  const handleMembersGrub = () => {
    setMode("members-grub");
  };

  console.log(room.admins.includes(userData.userId), "chatSec");

  return (
    <div
      className="container p-0 position-relative"
      style={{ height: "100vh" }}
    >
      <div
        className="px-3 d-flex justify-content-between border-bottom border-3 align-items-center"
        style={{ height: 40 }}
      >
        <h5 className="text-center mb-0">{chatName}</h5>
        <div className="dropdown d-flex align-items-center">
          <a
            className="text-dark border border-2 rounded border-terniary"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-three-dots"></i>
          </a>
          <ul className="dropdown-menu">
            {room.roomType === "grub" ? (
              <>
                <li
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={handleMembersGrub}
                >
                  Anggota grub
                </li>
                {room.admins.includes(userData.userId) && (
                  <>
                    <li
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={handleDeleteChat}
                    >
                      Hapus grub
                    </li>
                    <li className="dropdown-item" style={{ cursor: "pointer" }}>
                      Tambah anggota
                    </li>
                  </>
                )}
                <li
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleLeaveGrub(room._id)}
                >
                  Keluar grub
                </li>
              </>
            ) : (
              <>
                <li
                  className="dropdown-item"
                  onClick={handleDeleteChat}
                  style={{ cursor: "pointer" }}
                >
                  Hapus teman
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <ul
        className="list-group position-absolute p-1"
        style={{
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          bottom: 60,
          top: 40,
        }}
      >
        {messages.map((msg, i) => {
          if (msg.sender === userData.username) {
            return (
              <li
                key={i}
                className="list-group-item list-group-item-success px-2"
              >
                <p className="border-bottom border-4 border-success-subtle">
                  {msg.sender}
                </p>
                <p className="">{msg.message}</p>
                <div className="d-flex justify-content-between px-4">
                  <span>Pada: {msg.timeStamp}</span>
                  <span
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteMessage(msg._id)}
                  >
                    Hapus
                  </span>
                </div>
              </li>
            );
          } else {
            return (
              <li key={i} className="list-group-item px-2">
                <p className="border-bottom border-4">{msg.sender}</p>
                <p>{msg.message}</p>
                <div className="d-flex justify-content-between px-4">
                  <span>Pada: {msg.timeStamp}</span>
                </div>
              </li>
            );
          }
        })}
      </ul>

      <div
        className="position-absolute left-0 bottom-0 w-100 border border-2 border-terniary rounded p-1 input-group"
        style={{ height: 60 }}
      >
        <input
          id="input"
          autoComplete="off"
          className="form-control mb-2"
          onChange={handleMessageChange}
          value={message}
        />
        <div className="d-flex justify-content-between px-2">
          <button
            className="btn btn-outline-secondary"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
