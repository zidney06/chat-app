import mongoose from "mongoose";

export const roomSchema = new mongoose.Schema({
  roomName: {
    required: true,
    type: String,
  },
  roomType: {
    required: true,
    type: String,
    enum: ["chat", "grub"],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  roomMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  profilePhotoUrl: {
    type: String,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
