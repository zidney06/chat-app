import User from "./../schemas/userModel.js";

// get
export const getBlacklisteduserHandler = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("blockedUsers");

    if (!user) {
      return res.status(404).json({
        msg: "User tidak ditemukan",
      });
    }

    const blockedUsers = user.blockedUsers.map((usr) => {
      return {
        username: usr.username,
        id: usr._id,
        profilePhotoUrl: usr.profilePhotoUrl,
      };
    });

    console.log(user);

    res.status(200).json({
      msg: "Berhasil mendapatkan data user yang di blok",
      data: {
        blockedUsers,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan ketika mengambil daftar user yang di blok",
    });
  }
};

// post
export const blacklistUserHandler = async (req, res) => {
  const userId = req.user.id;
  const { userIdTarget } = req.body;
  let user;
  let userTarget;

  try {
    const users = await User.find({ _id: { $in: [userId, userIdTarget] } });

    if (users.length < 2) {
      return res.status(404).json({
        msg: "User atau user target tidak ditemukan!",
      });
    }

    users.forEach((usr) => {
      if (usr._id.toString() === userId) {
        user = usr;
      } else {
        userTarget = usr;
      }
    });

    // masukan id user target kedalam blokedUsers milik user
    user.blockedUsers.push(userTarget._id);

    // Hapus usertarget dari receivedFriendRequest user & hapus user dari FriendRequest userTarget
    user.receivedFriendRequest.pull(userTarget._id);
    userTarget.friendRequest.pull(user._id);

    // 5. Menggunakan Promise.all untuk eksekusi paralel yang efisien
    await Promise.all([user.save(), userTarget.save()]);

    res.status(200).json({
      msg: "Berhasil memblokir user",
      data: {
        userTargetId: userTarget._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat memblokir user!",
    });
  }
};

export const unblockUserHandler = async (req, res) => {
  const userId = req.user.id;
  const { userIdTarget } = req.body;
  let user;
  let userTarget;

  try {
    const users = await User.find({ _id: { $in: [userId, userIdTarget] } });

    if (users.length < 2) {
      return res.status(404).json({
        msg: "User atau user target tidak ditemukan!",
      });
    }

    users.forEach((usr) => {
      if (usr._id.toString() === userId) {
        user = usr;
      } else {
        userTarget = usr;
      }
    });

    // hapus userTargetId dari daftar blockedUsers user
    user.blockedUsers.pull(userTarget._id);

    // simpan perubahan
    await Promise.all([user.save(), userTarget.save()]);

    console.log(user, userTarget);

    res.status(200).json({
      msg: "Berhasil membuka user yang di blokir",
      data: {
        userIdTarget: userTarget._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan saat meng-unblock user",
    });
  }
};

// put / patch

// delete
