import User from "./../schemas/userModel.js";
import Room from "../schemas/roomModel.js";

// get
export const findFriendsHandler = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const userId = req.user.id;
  const skip = (page - 1) * 10;
  let users = [];

  try {
    const userData = await User.findById(userId);
    const collectedUsers = await User.find({ _id: { $ne: userId } })
      .skip(skip)
      .limit(10);

    // Kirim username, id, dan photo profile ke client
    // dan cek apakah user sudah ada dalam list friendList atau belum
    // Mbulet anjir
    collectedUsers.forEach((user) => {
      const isFriend = userData.friendList.includes(user._id); // apa ada di friendList
      const isRequested = userData.friendRequest.includes(user._id); // apa ada di friendrequest
      const isReceived = userData.receivedFriendRequest.includes(user._id);
      const isBlocked = userData.blockedUsers.includes(user._id);

      if (!isFriend && !isRequested && !isReceived && !isBlocked) {
        users.push({
          username: user.username,
          id: user._id,
          profilePhotoUrl: user.profilePhotoUrl,
        });
      }
    });

    console.log(users, userData);

    if (!userData) {
      return res.status(404).json({
        msg: "Data yang diperlukan tidak ada!",
      });
    }

    res.status(200).json({
      msg: "Berhasil mendapatkan data",
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan!",
    });
  }
};

export const friendRequestHandler = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("receivedFriendRequest");

    console.log(user.receivedFriendRequest);

    const friendRequest = user.receivedFriendRequest.map((friend) => {
      return {
        username: friend.username,
        id: friend._id,
        profilePhotoUrl: friend.profilePhotoUrl,
      };
    });

    res.status(200).json({
      msg: "Oke dulu",
      data: friendRequest,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat mengambil daftar permintaa pertemanan",
    });
  }
};

export const getFriendListHandler = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("friendList");

    if (!user) {
      return res.status(404).json({
        msg: "User tidak ditemukan!",
      });
    }

    const friendList = user.friendList.map((user) => {
      return {
        id: user._id,
        username: user.username,
        profilePhotoUrl: user.profilePhotoUrl,
      };
    });

    res.status(200).json({
      msg: "Berhasil mendapatkan daftar teman",
      data: {
        friendList,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi masalah saat mengambil daftar teman!",
    });
  }
};

// post
export const askForFriendshipHandler = async (req, res) => {
  const { userIdTarget } = req.body;
  const userId = req.user.id;
  let userTarget;
  let user;

  console.log(req.body, userId);

  // Cari user yang akan dimintai pertemanan
  try {
    const users = await User.find({
      _id: { $in: [userIdTarget, userId] },
    });

    users.forEach((e) => {
      console.log(e._id, "id");
      if (e._id.toString() === userIdTarget) {
        userTarget = e;
      } else {
        user = e;
      }
    });

    console.log(user, userTarget);

    if (!userTarget || !user) {
      return res.status(404).json({
        msg: "User yang dicari tidak ditemukan!",
      });
    }

    //  Cek apakah user yang dimintai sudah ada di daftar permintaan atau belum
    const isAlreadyRequested = user.friendRequest.some((friendId) => {
      return friendId === userTarget._id.toString();
    });

    if (isAlreadyRequested) {
      return res.status(400).json({
        msg: "Anda sudah mengirim permintaan pertemanan kepada user ini",
      });
    }

    // Logika untuk menyimpan permintaan pertemanan

    // masukan id user yang meminta ke daftar permintaan pertmenan user yang diminta
    userTarget.receivedFriendRequest.push(user._id);
    // masukan id user yang diminta ke daftar permintaan pertemanan user yang meminta
    user.friendRequest.push(userTarget._id);

    userTarget.save();
    user.save();

    console.log(user, " seng jaluk");
    console.log(userTarget, " seng dijaluk");

    res.status(201).json({
      msg: "Permintaan pertemanan berhasil dikirim!",
      data: {
        userIdTarget: userTarget._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat meminta pertemanan",
    });
  }
};

export const acceptFriendRequestHandler = async (req, res) => {
  // dari gemini
  const { userIdTarget } = req.body;
  const userId = req.user.id;

  try {
    const users = await User.find({
      _id: { $in: [userId, userIdTarget] },
    }).select(
      "username friendList receivedFriendRequest friendRequest chatList"
    );

    if (users.length !== 2) {
      return res.status(404).json({
        msg: "User tidak ditemukan atau permintaan pertemanan tidak valid.",
      });
    }

    const user = users.find((u) => u._id.toString() === userId);
    const userTarget = users.find((u) => u._id.toString() === userIdTarget);

    // Pastikan userTarget dan user ditemukan
    if (!user || !userTarget) {
      return res.status(404).json({
        msg: "User tidak ditemukan atau permintaan pertemanan tidak valid.",
      });
    }

    // 3. Menggunakan $addToSet untuk mencegah duplikasi
    // Menambhankan userTarget ke friendList user dan sebaliknya
    user.friendList.addToSet(userTarget._id);
    userTarget.friendList.addToSet(user._id);

    console.log(user);

    // 4. Menggunakan $pull untuk menghapus elemen dari array
    user.receivedFriendRequest.pull(userTarget._id);
    userTarget.friendRequest.pull(user._id);

    // 6. Cek apakah room sudah ada
    const sortedUsernames = [user._id, userTarget._id].sort();
    const roomName = `${sortedUsernames[0]}-${sortedUsernames[1]}`; // nama room ini sebaimnya diganti menggunakan id saja

    const existingRoom = await Room.findOne({ roomName });

    if (existingRoom) {
      return res.status(400).json({
        msg: "Room sudah ada",
      });
    }

    // Buat data room baru
    const room = new Room({
      roomName: roomName,
      roomType: "chat",
      profilePhotoUrl:
        "https://i.pinimg.com/1200x/bd/c9/ed/bdc9ed571a547a741983ada110cde071.jpg",
      members: [user._id, userTarget._id],
    });

    console.log(room, "room");
    // catatan buat nanti
    // - mengecek apaakh friendList, roomList masih dibutuhkan karena sudah ada chatList

    // menambhakan userTarget ke chatList user dan sebaliknya
    user.chatList.addToSet({
      chatId: room._id,
      name: userTarget.username,
      roomType: "chat",
      roomName: `${[user._id, userTarget._id].sort().join("-")}`,
      profilePhotoUrl: room.profilePhotoUrl,
    });
    userTarget.chatList.addToSet({
      chatId: room._id,
      name: user.username,
      roomType: "chat",
      roomName: `${[user._id, userTarget._id].sort().join("-")}`,
      profilePhotoUrl: room.profilePhotoUrl,
    });

    console.log(user, userTarget, room);

    // 5. Menggunakan Promise.all untuk eksekusi paralel yang efisien
    await Promise.all([user.save(), userTarget.save(), room.save()]);

    res.status(200).json({
      msg: "Permintaan pertemanan berhasil diterima.",
      data: {
        userTargetId: userTarget._id,
        room: room,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat menerima permintaan pertemanan",
    });
  }
};

export const declineFriendRequestHandler = async (req, res) => {
  const { userIdTarget } = req.body;
  const userId = req.user.id;

  try {
    const users = await User.find({
      _id: { $in: [userId, userIdTarget] },
    }).select(
      "username friendList receivedFriendRequest roomList friendRequest"
    );

    if (users.length !== 2) {
      return res.status(404).json({
        msg: "User tidak ditemukan atau permintaan pertemanan tidak valid.",
      });
    }

    const user = users.find((u) => u._id.toString() === userId);
    const userTarget = users.find((u) => u._id.toString() === userIdTarget);

    console.log(user, userTarget);

    // Pastikan userTarget dan user ditemukan
    if (!user || !userTarget) {
      return res.status(404).json({
        msg: "User tidak ditemukan atau permintaan pertemanan tidak valid.",
      });
    }

    // Hapus usertarget dari receivedFriendRequest user & hapus user dari FriendRequest userTarget
    user.receivedFriendRequest.pull(userTarget._id);
    userTarget.friendRequest.pull(user._id);

    // 5. Menggunakan Promise.all untuk eksekusi paralel yang efisien
    await Promise.all([user.save(), userTarget.save()]);

    res.status(200).json({
      msg: "Berhasil menolak permintaan pertemanan",
      data: {
        userTargetId: userTarget._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Terjadi kesalahan ketika menolak permintaan pertemanan",
    });
  }
};

// put / patch

// delete
