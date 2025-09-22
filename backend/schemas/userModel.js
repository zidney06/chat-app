import mongoose from "mongoose";
import { roomSchema } from "./roomModel.js";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
  name: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  profilePhotoUrl: {
    type: String,
    required: true,
  },
});

export const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    friendList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chatList: [chatSchema],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    receivedFriendRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // user yang dimintai pertmenan (berisi id user)
    friendRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ], // user yang mengirim permintaan pertemanan (berisi id user)
    profilePhotoUrl: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
