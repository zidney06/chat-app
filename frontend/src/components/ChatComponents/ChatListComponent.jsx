import { useEffect } from "react";
import ChatComponent from "./ChatComponent.jsx";
import { getFetch } from "../../utils/fetch.js";
import { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../store/store.jsx";

export default function ChatListComponent() {
  const { chatList, setChatList } = useContext(MyContext);

  useEffect(() => {
    getFetch("/api/get-chatList").then((res) => {
      if (!res.success) {
        alert(res.response.data.msg);
        return;
      }
      setChatList(res.data.data);
    });
  }, []);

  const handleRefresh = () => {
    getFetch("/api/get-chatList").then((res) => {
      if (!res.success) {
        alert(res.response.data.msg);
        return;
      }
      setChatList(res.data.data);
    });
  };

  console.log(chatList);

  return (
    <div className="container p-0">
      <div
        className="d-flex justify-content-between p-2 align-items-center my-1"
        style={{ height: 45 }}
      >
        <h6 className="text-center mb-0">List chat:</h6>
        <button className="btn btn-outline-secondary" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      {/* jika belum ada teman maka tampilkan cari teman dulu */}
      {chatList.length === 0 ? (
        <div className="text-center">
          <p>Belum ada teman, cari teman dulu yuk!</p>
        </div>
      ) : (
        <ul
          className="list-group border p-1"
          style={{ height: 400, overflow: "auto" }}
        >
          {chatList.map((chat, i) => (
            <ChatComponent key={i} chat={chat} setChatList={setChatList} />
          ))}
        </ul>
      )}
    </div>
  );
}
