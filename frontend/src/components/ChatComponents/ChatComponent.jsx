import { useContext } from "react";
import { postFetch } from "../../utils/fetch";
import { MyContext } from "../../store/store";
import { socket } from "../../socket/socket";

export default function ChatComponent({ chat, setChatList }) {
  const { room, setRoom, setMessages, setChatName, setMode } =
    useContext(MyContext);

  const handleModeChange = (roomId, chatName) => {
    postFetch("/api/join-room", { roomId, chatName }).then((res) => {
      if (!res.success) {
        return alert(res.data.response);
      }
      setRoom(res.data.data.room);
      setMessages(res.data.data.messages);
      setChatName(res.data.data.chatName);
      setMode("chat");
      socket.emit("join-room", {
        roomId: res.data.data.room._id,
        chatName: res.data.data.chatName,
      });
    });
  };

  // console.log(chat);

  return (
    <div
      className="px-2 py-1 border my-1 d-flex"
      style={{ height: 60, cursor: "pointer" }}
      onClick={() => handleModeChange(chat.chatId, chat.name)}
    >
      <div className="" style={{ height: 50 }}>
        <img
          className="rounded-circle"
          src={chat.profilePhotoUrl}
          alt="profile"
          style={{ width: 50, height: 50 }}
        />
      </div>
      <div className="px-1" style={{ width: "80%" }}>
        <p>
          <strong>{chat.name}</strong>
        </p>
      </div>
    </div>
  );
}
