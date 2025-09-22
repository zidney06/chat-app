import Message from "../schemas/messageModel.js";
import Room from "../schemas/roomModel.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("a user connected!", socket.user);

    socket.on("disconnect", () => {
      console.log("user disconnected: " + socket.id);
    });

    // masuk ke room
    socket.on("join-room", async (data) => {
      const userId = socket.user.id;
      const { chatName, roomId } = data;

      try {
        const room = await Room.findById(roomId);

        if (!room) {
          return io.to(socket.id).emit("error", "Room harus di isi");
        }

        console.log("masuk ke room", room.roomName);

        // masukan user ke room
        socket.join(room.roomName);

        io.to(socket.id).emit("success-join-room", {
          msg: "Berhasil masuk ke room",
          data: {
            room: room,
            roomName: room.roomName,
            messages: room.roomMessages,
            chatName: chatName,
          },
        });
      } catch (err) {
        console.error(err);
        io.to(socket.id).emit("error", "Terjadi msalah ketika masuk ke room!");
      }
    });

    // untuk mengirimkan pesan
    socket.on("send-message", async (data) => {
      const { room, sender, message } = data;
      const user = socket.user;

      try {
        const existedRoom = await Room.findById(room._id);

        if (!existedRoom) {
          return io.to(socket.id).emit("error", "Room tidak ditemukan");
        }

        // cek apakah user ada dalam daftar memebrs room
        if (!existedRoom.members.includes(user.id)) {
          return io
            .to(socket.id)
            .emit("error", "Anda bukan anggota dari chat ini");
        }

        // simpan pesan kedalam daftar pesan milik room
        const msg = new Message({
          message: message,
          sender: sender,
          timeStamp: Date.now(),
        });

        existedRoom.roomMessages.push(msg._id);

        console.log(existedRoom, "Kirim pesan");

        // simpan semua perubahan
        await Promise.all([msg.save(), existedRoom.save()]);

        // kirim pesan ke user
        io.to(existedRoom.roomName).emit("terima", msg);
      } catch (err) {
        console.log(err);
        io.to(socket.id).emit(
          "error",
          "Terjadi kesalahan saat mengirimkan pesan"
        );
      }
    });

    // fitur untuk menghapus pesan
    socket.on("delete-message", async (data) => {
      const { msgId, roomName } = data;

      try {
        const msg = await Message.findByIdAndDelete(msgId);

        if (!msg) {
          return io.to(socket.id).emit("error", "Pesan tidak ditemukan!");
        }

        const room = await Room.findOneAndUpdate(
          { roomName: roomName },
          {
            $pull: { roomMessages: msgId },
          }
        );

        if (!room) {
          return io.to(socket.id).emit("error", "Room tidak ditemukan!");
        }

        console.log(msg, room, "hapus pesan");

        io.to(roomName).emit("success-delete-message", { msgId: msg._id });
      } catch (err) {
        console.log(err);
        io.to(socket.id).emit(
          "error",
          "terjadi kesalahan ketika menghapus pesan!"
        );
      }
    });
    // untuk keluar dari room
    socket.on("leave-grub", (value) => {
      const { room } = value;

      console.log("Keluar dari room: " + room.roomName);

      socket.leave(room.roomName);
    });
  });
}
