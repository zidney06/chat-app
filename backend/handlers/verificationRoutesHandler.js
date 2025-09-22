import User from "./../schemas/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// get

// post
export const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      msg: "username, email atau password belum dimasukan!",
    });
  }

  try {
    const isExist = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (isExist) {
      return res.status(400).json({
        msg: "User dengan username atau email tersebut sudah terdaftar!",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      profilePhotoUrl:
        "https://assets-a1.kompasiana.com/items/album/2021/03/24/blank-profile-picture-973460-1280-605aadc08ede4874e1153a12.png?t=o&v=780",
    });

    await newUser.save();

    res.status(201).json({
      msg: "Berhasil mendaftar!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Terjadi masalah!" });
  }
};

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Email atau password belum dimasukan!",
    });
  }

  try {
    // cek apakah user sudah daftar atau belum
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        msg: "User tidak ditemukan!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        msg: "Password salah!",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(200).json({
      msg: "Berhasil login!",
      token: token,
      userData: {
        username: user.username,
        userId: user._id,
        profilePhotoUrl: user.profilePhotoUrl,
        friendRequest: user.friendRequest,
        friendList: user.friendList,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan!",
    });
  }
};

// put / patch

// delete
