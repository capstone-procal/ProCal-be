const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");

    const token = await user.generateToken();

    return res.status(200).json({
      status: "success",
      token,
      userId: user._id,
      userEmail: user.email,
      role: user.level
    });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 인증 미들웨어
authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error("토큰이 없습니다.");

    const token = tokenString.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    const user = await User.findById(payload._id);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    req.userId = payload._id;
    req.userLevel = user.level;

    next();
  } catch (error) {
    res.status(401).json({ status: "fail", error: error.message });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user.level !== "admin") {
      throw new Error("관리자 권한이 없습니다.");
    }
    next();
  } catch (error) {
    res.status(403).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;