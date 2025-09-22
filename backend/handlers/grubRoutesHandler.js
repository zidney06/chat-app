import User from "./../schemas/userModel.js";
import Room from "../schemas/roomModel.js";

// get
export const getGrubMembershandler = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId).populate("members");

    if (!room) {
      return res.status(404).json({
        msg: "Room tidak ditemukan",
      });
    }

    console.log(room, "get member grub");

    res.status(200).json({
      msg: "Oke dulu",
      data: {
        members: room.members,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: " Terjadi masalah ketika mengambil data member grub!",
    });
  }
};

// post
export const createGrubHandler = async (req, res) => {
  const { grubMember, roomName } = req.body;
  const userId = req.user.id;

  try {
    const isRoomExist = await Room.findOne({ roomName });

    if (isRoomExist) {
      return res.status(409).json({
        msg: `Room dengan nama ${roomName} sudah ada!`,
      });
    }

    if (grubMember.length < 3) {
      return res.status(409).json({
        msg: "Anggota grub minimal 3!",
      });
    }

    // Buat data grub
    const newGrub = await Room.create({
      roomName,
      roomType: "grub",
      members: grubMember,
      admins: [userId],
      profilePhotoUrl:
        "https://i.pinimg.com/1200x/bd/c9/ed/bdc9ed571a547a741983ada110cde071.jpg",
    });

    // masukan data chat kedalam chatList milik anggota grub
    const tes = await User.updateMany(
      {
        _id: { $in: grubMember },
      },
      {
        $push: {
          chatList: {
            chatId: newGrub._id,
            name: newGrub.roomName,
            roomName: newGrub.roomName,
            roomType: "grub",
            profilePhotoUrl: newGrub.profilePhotoUrl,
          },
        },
      }
    );

    console.log(newGrub, tes);

    res.status(201).json({
      msg: "Berhasil membuat grub baru",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "terjadi error saat membuat grub!",
    });
  }
};

export const leaveGrubHandler = async (req, res) => {
  const userId = req.user.id;
  const { roomId } = req.body;

  try {
    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $pull: { members: userId, admins: userId },
      },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(userId, {
      $pull: { chatList: { chatId: roomId } },
    });

    if (!room || !user) {
      return res.status(404).json({
        msg: "Room atau user tidak ditemukan",
      });
    }

    console.log(room, "leave room");

    // jika member mencapai nol maka hapus room
    if (room.members.length === 0) {
      await Room.findByIdAndDelete(roomId);
    }

    res.status(200).json({
      msg: "Berhasil keluar dari grub",
      data: {
        roomId: room._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat keluar dari grub!",
    });
  }
};

// tambah fitur admin

// put / patch

// delete
export const deleteGrubhandler = async (req, res) => {
  const userId = req.user.id;
  const { roomId } = req.params;

  try {
    const room = await Room.findByIdAndDelete(roomId);

    if (!room) {
      return res.status(404).json({
        msg: "Room tidak ditemukan",
      });
    }

    // jika user bukan admin maka kasih error 401
    if (!room.admins.includes(userId)) {
      return res.status(401).json({
        msg: "Anda tidak bisa menghapus grub, anda bukan admin!",
      });
    }

    console.log(room, "delete room");
    // hapus room dari chatList user
    const result = await User.updateMany(
      { _id: { $in: room.members } },
      { $pull: { chatList: { chatId: room._id } } }
    );

    console.log(result, "result");

    res.status(201).json({
      msg: "Oke dulu",
      data: {
        chatId: room._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat menghapus grub",
    });
  }
};
