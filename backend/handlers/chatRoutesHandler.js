import User from "./../schemas/userModel.js";
import Room from "../schemas/roomModel.js";
import Message from "../schemas/messageModel.js";

// get
export const getChatListHandler = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("friendList");

    if (!user) {
      return res.status(404).json({
        msg: "User tidak ditemukan!",
      });
    }

    res.status(200).json({
      msg: "Berhasil mendapatkan daftar teman",
      data: user.chatList,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat mengambil daftar teman",
    });
  }
};

// post
export const joinRoomHandler = async (req, res) => {
  const userId = req.user.id;
  const { roomId, chatName } = req.body;

  try {
    const user = await User.findById(userId);
    const room = await Room.findById(roomId).populate("roomMessages");

    if (!user || !room) {
      return res.status(404).json({
        msg: "User atau room yang dicari tidak ditemukan!",
      });
    }

    const isMember = room.members.includes(user._id);

    if (!isMember) {
      return res.status(401).json({
        msg: "Maaf, anda tidak punya akses ke chat ini!",
      });
    }

    console.log(room, "daftar pesan room");

    res.status(200).json({
      msg: "Berhasil masuk ke room",
      data: {
        room,
        roomName: room.roomName,
        messages: room.roomMessages,
        chatName: chatName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Terjadi error ketika akan masuk ke room",
    });
  }
};

// put / patch

// delete
export const deleteChatHandler = async (req, res) => {
  const userId = req.user.id;
  const { roomId } = req.params;
  let user;
  let userTarget;

  try {
    const room = await Room.findById(roomId).populate("members");

    if (!room) {
      return res.status(404).json({
        msg: "Room tidak ditemukan",
      });
    }

    // tentukan mana user mana user target
    // kalau untuk mengahpus chat yang bertipe grub akan terjadi error
    // kalau berupa grub maka erlu menghapus room dari semua member
    if (room.roomType === "chat") {
      room.members.forEach((member) => {
        if (member._id.toString() === userId) {
          user = member;
        } else {
          userTarget = member;
        }
      });
      // Pastikan userTarget dan user ditemukan
      if (!user || !userTarget) {
        return res.status(404).json({
          msg: "User tidak ditemukan atau permintaan pertemanan tidak valid.",
        });
      }

      // Hapus userTarget dari friendList user dan sebaliknya
      user.friendList.pull(userTarget._id);
      userTarget.friendList.pull(user._id);

      // hapus room dari kedua user
      // menentukan room mana yang akan dihapus berdasarkan gabungan id user dan userTarget
      // nama ini harus sama dengan nama yang dibuat di acceptFriendRequest
      const sortedUsernames = [user._id, userTarget._id].sort();
      const roomName = `${sortedUsernames[0]}-${sortedUsernames[1]}`;

      // hapus chat dengan userTarget dari chatList
      user.chatList = user.chatList.filter(
        (chat) => chat.roomName !== roomName
      );
      userTarget.chatList = userTarget.chatList.filter(
        (chat) => chat.roomName !== roomName
      );

      // hapus room dari db
      const deletedRoom = await Room.findOneAndDelete({ roomName });

      if (!deletedRoom) {
        return res.status(404).json({
          msg: "gagal menghapus room",
        });
      }

      // perlu menghapus pesan dari room juga
      const arrrayId = deletedRoom.roomMessages;
      const deletedMsg = await Message.deleteMany({ _id: { $in: arrrayId } });

      console.log(deletedMsg);

      // simpan semua perubahan
      await Promise.all([user.save(), userTarget.save()]);

      res.status(200).json({
        msg: "Berhasil menghapus teman",
        data: {
          chatId: deletedRoom._id,
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat menghapus teman",
    });
  }
};
