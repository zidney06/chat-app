import express from "express";
import {
  findFriendsHandler,
  friendRequestHandler,
  getFriendListHandler,
  acceptFriendRequestHandler,
  declineFriendRequestHandler,
  askForFriendshipHandler,
} from "../handlers/friendRoutesHandler.js";
import {
  getChatListHandler,
  joinRoomHandler,
  deleteChatHandler,
} from "../handlers/chatRoutesHandler.js";
import {
  createGrubHandler,
  deleteGrubhandler,
  getGrubMembershandler,
  leaveGrubHandler,
} from "../handlers/grubRoutesHandler.js";
import {
  registerHandler,
  loginHandler,
} from "../handlers/verificationRoutesHandler.js";
import {
  getBlacklisteduserHandler,
  blacklistUserHandler,
  unblockUserHandler,
} from "../handlers/userRouteshandler.js";
import { verifyToken } from "../middlewares/middlewares.js";

const route = express.Router();

// routes for friend
route.get("/find-friend", verifyToken, findFriendsHandler);
route.get("/friend-request", verifyToken, friendRequestHandler);
route.get("/get-friendList", verifyToken, getFriendListHandler);
route.post("/accept-friend-request", verifyToken, acceptFriendRequestHandler);
route.post("/decline-friend-request", verifyToken, declineFriendRequestHandler);
route.post("/ask-for-friendship", verifyToken, askForFriendshipHandler);

// routes for chat
route.get("/get-chatList", verifyToken, getChatListHandler);
route.post("/join-room", verifyToken, joinRoomHandler);
route.delete("/delete-chat/:roomId", verifyToken, deleteChatHandler);

// routes for grub
route.get("/get-grub-members/:roomId", verifyToken, getGrubMembershandler);
route.post("/create-grub", verifyToken, createGrubHandler);
route.post("/leave-grub", verifyToken, leaveGrubHandler);
route.delete("/delete-grub/:roomId", verifyToken, deleteGrubhandler);

// routes for verification
route.post("/register", registerHandler);
route.post("/login", loginHandler);

// routes for user
route.get("/get-blacklisted-user", verifyToken, getBlacklisteduserHandler);
route.post("/blacklist-user", verifyToken, blacklistUserHandler);
route.post("/unblock-user", verifyToken, unblockUserHandler);

// logika untuk memasukan anggota saat membuat grub itu sama dengan logika ketika ingin menambah anggota grub

export default route;
