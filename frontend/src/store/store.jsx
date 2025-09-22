import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [userData, setUserData] = useState({
    username: "",
    userId: "",
    friendRequest: [],
  });
  const [mode, setMode] = useState("");
  const [room, setRoom] = useState("");
  const [chatName, setChatName] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);

  const addFriendRequest = (userId) => {
    setUserData((prev) => ({
      ...prev,
      friendRequest: [...prev.friendRequest, userId],
    }));
  };

  const setUsername = (username) => {
    setUserData((prev) => ({
      ...prev,
      username: username,
    }));
  };

  return (
    <MyContext.Provider
      value={{
        userData,
        setUserData,
        addFriendRequest,
        setUsername,
        mode,
        setMode,
        room,
        setRoom,
        messages,
        setMessages,
        chatName,
        setChatName,
        chatList,
        setChatList,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
