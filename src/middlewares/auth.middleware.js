const jwt = require("jsonwebtoken");
const { prisma } = require("../utils/prisma/index.js");

module.exports = async function (req, res, next) {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);

      if (!refreshToken) {
        throw new Error("Access Token 및 Refresh Token이 존재하지 않습니다.");
      }

      let payload;

      try {
        payload = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET_KEY
        );
      } catch (error) {
        payload = null;
      }

      if (!payload) {
        return res
          .status(401)
          .json({ message: "Refresh Token이 정상적이지 않습니다." });
      }

      const userInfo = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
      });

      if (!userInfo) {
        return res.status(419).json({
          message: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
        });
      }

      const newAccessToken = jwt.sign(
        { userId: userInfo.userId },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: "12h",
        }
      );
      const user = await prisma.users.findFirst({
        where: { userId: userInfo.userId },
      });

      res.cookie("authorization", `Bearer ${newAccessToken}`);
      req.locals = { user: user };
      next();
    } else {
      const [tokenType, token] = authorization.split(" ");
      if (tokenType !== "Bearer") {
        throw new Error("토큰타입이 Bearer 형식이 아닙니다.");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      const userId = decodedToken.userId;

      const user = await prisma.users.findFirst({
        where: { userId: userId },
      });

      if (!user) {
        throw new Error("토큰 사용자가 존재하지 않습니다.");
      }

      req.locals = { user: user };
      next();
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "토큰이 조작되었습니다." });
    }
    return res.status(400).json({ message: err.message });
  }
};
