const express = require("express");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/sign-in", async (req, res, next) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_ID,
    redirect_uri: "http://localhost:3018/kakao/finish",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  console.log(finalUrl);
  return res.redirect(finalUrl);
});

router.get("/finish", async (req, res, next) => {
  try {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
      client_id: process.env.KAKAO_ID,
      client_secret: process.env.KAKAO_SECRET,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3018/kakao/finish",
      code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const kakaoTokenRequest = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
    const kakaoTokenData = await kakaoTokenRequest.json();

    if ("access_token" in kakaoTokenData) {
      const { access_token } = kakaoTokenData;
      const userRequest = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      });
      const userData = await userRequest.json();
      const user = await prisma.users.findFirst({
        where: { email: userData.kakao_account.email },
      });
      if (!user) {
        await prisma.users.create({
          data: {
            kakaoId: userData.id,
            name: userData.kakao_account.name,
            email: userData.kakao_account.email,
          },
        });
      }
      return res.json({ data: user });
    } else {
      // 엑세스 토큰이 없으면 로그인페이지로 리다이렉트
      return res.redirect("/kakao/sign-in");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { kakaoId, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해 주세요" });
    }

    const user = await prisma.users.findFirst({
      where: { kakaoId: +kakaoId },
    });

    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
    }

    // 최초 로그인이면 비밀번호 설정
    if (!user.password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { userId: user.userId },
        data: { password: hashedPassword },
      });
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }
    }

    // 엑세스 토큰과 리프레시 토큰 발급
    const accessToken = jwt.sign(
      { userId: user.userId },
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

    // 리프레시 토큰 저장
    await prisma.refreshToken.create({
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

module.exports = router;
