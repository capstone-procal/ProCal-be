const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

// 회원가입
userController.createUser = async (req, res) => {
  try {
    let { email, password, name, nickname, level, profileImage } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error("이미 사용 중인 이메일입니다.");

    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) throw new Error("이미 사용 중인 닉네임입니다.");

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password,
      name,
      nickname,
      profileImage,
      level: level || "user"
    });

    await newUser.save();

    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

// 로그인된 유저 정보 반환
userController.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) throw new Error("유저 정보를 찾을 수 없습니다.");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

userController.updateUser = async (req, res) => {
  try {
    const { userId } = req;
    const { name, nickname, email, password, profileImage } = req.body;

    const updateFields = { name, nickname, email, profileImage };

    if (password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

    if (!updatedUser) throw new Error("유저를 찾을 수 없습니다.");

    res.status(200).json({ status: "success", user: updatedUser });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;