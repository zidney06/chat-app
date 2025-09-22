import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../store/store";
import { getFetch, postFetch } from "../../utils/fetch";
import { socket } from "../../socket/socket";

export default function MembersGrub() {
  const { room, setMode, setRoom, setMessages, setChatName } =
    useContext(MyContext);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // ambil data member
    getFetch(`/api/get-grub-members/${room._id}`).then((res) => {
      if (!res.success) {
        return alert(res.response.data.msg);
      }
      setMembers(res.data.data.members);
    });
  }, []);

  const backToChatHandler = () => {
    postFetch("/api/join-room", {
      roomId: room._id,
      chatName: room.roomName,
    }).then((res) => {
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

  console.log(room, "dari membergrub");

  return (
    <div className="">
      <div className="border-bottom d-flex">
        <p
          onClick={backToChatHandler}
          className="m-1 col-3 text-center border"
          style={{ cursor: "pointer" }}
        >
          <span className="bi bi-arrow-return-left"></span>Balik
        </p>
        <h3 className="text-center col-9 my-1">Anggota grub</h3>
      </div>
      <div>
        <ul className="list-group">
          {members.map((member, i) => (
            <li
              key={i}
              className="list-group-item px-2 py-1 border my-1 d-flex"
              style={{ height: 60 }}
            >
              <div className="" style={{ height: 50 }}>
                <img
                  className="rounded-circle"
                  src={member.profilePhotoUrl}
                  alt="profile"
                  style={{ width: 50, height: 50 }}
                />
              </div>
              <div className="px-1" style={{ width: "80%" }}>
                <p>
                  <strong>{member.username}</strong>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
