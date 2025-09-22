import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
  message: {
    required: true,
    type: String,
  },
  sender: {
    required: true,
    type: String,
  },
  timeStamp: {
    required: true,
    type: Date,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
