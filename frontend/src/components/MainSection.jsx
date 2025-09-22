import { useContext, useState } from "react";
import FindFriend from "./FindfriendsComponents/FindFriend";
import FriendRequest from "./FriendReqComponents/FriendRequest";
import CreateGroup from "./GrubComponents/CreateGroup";
import BlaclistedUserComponent from "./BlacklistComponents/BlacklistedUserComponent";
import SettingsComponent from "./SettingsComponents/SettingsComponent";
import { MyContext } from "../store/store";
import ChatSection from "./ChatComponents/ChatSection";
import MembersGrub from "./GrubComponents/MembersGrub";

export default function MainMenu() {
  const { mode } = useContext(MyContext);

  if (mode === "") {
    return <h1 className="text-center">Whats App Clone</h1>;
  } else if (mode === "chat") {
    return <ChatSection />;
  } else if (mode === "find-friends") {
    return <FindFriend />;
  } else if (mode === "friend-request") {
    return <FriendRequest />;
  } else if (mode === "create-group") {
    return <CreateGroup />;
  } else if (mode === "blacklisted-user") {
    return <BlaclistedUserComponent />;
  } else if (mode === "settings") {
    return <SettingsComponent />;
  } else if (mode === "members-grub") {
    return <MembersGrub />;
  }
}
