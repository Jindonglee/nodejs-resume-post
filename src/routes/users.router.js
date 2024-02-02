const express = require("express");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm || password < 6) {
      return res.status(401).json({
        message: "최소 6자 이상이며, 비밀번호 확인과 일치해야 합니다.",
      });
    }

    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    if (isExistUser) {
      return res
        .status(409)
        .json({ message: "이미 중복된 이메일이 존재합니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
});

// 로그인 라우터
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findFirst({ where: { email } });

    if (!user)
      return res.status(401).json({ message: "존재하지 않는 이메일 입니다." });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    // 엑세스 토큰과 리프레시 토큰 발급
    const accessToken = jwt.sign(
      { userId: user.Id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: "12h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    const savedRefreshToken = await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.userId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    // 쿠키에 토큰 할당
    res.cookie("authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken);

    return res.status(200).json({ message: "로그인에 성공하셨습니다." });
  } catch (err) {
    next(err);
  }
});

router.get("/userInfo", authMiddleware, async (req, res, next) => {
  const { userId } = req.locals.user;

  const user = await prisma.users.findFirst({
    where: { userId: userId },
    select: {
      userId: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user)
    return res.status(401).json({ message: "유저정보가 존재하지 않습니다." });
  return res.status(200).json({ data: user });
});

module.exports = router;
