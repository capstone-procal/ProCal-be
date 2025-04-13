const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    let { email, password, name, nickname, level, profileImage } = req.body;

    //이메일 중복 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }

    //닉네임 중복 확인
    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      throw new Error("이미 사용 중인 닉네임입니다.");
    }

    //비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    //유저 생성
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

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) throw new Error("Invalid token");
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;