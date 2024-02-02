const express = require("express");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth.middleware.js");
const url = require("url");
const joi = require("joi");

const router = express.Router();

const resumeForm = joi.object({
  title: joi.string().min(1).max(100).required(),
  content: joi.string(),
});

router.post("/posts", authMiddleware, async (req, res, next) => {
  try {
    const validation = await resumeForm.validateAsync(req.body);
    const { title, content } = validation;
    const { userId } = req.locals.user;

    const resume = await prisma.resume.create({
      data: {
        title: title,
        userId: userId,
        content: content,
      },
    });

    return res.status(201).json({ message: "이력서가 작성되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.get("/posts", async (req, res, next) => {
  let getUrl = req.url;
  let queryData = url.parse(getUrl, true).query;
  let orderValue = queryData.orderValue;
  const orderKey = queryData.orderKey;
  const orderByOptions = orderKey
    ? [{ [orderKey]: orderValue.toLowerCase() }]
    : undefined;
  const resumeList = await prisma.resume.findMany({
    select: {
      resumeId: true,
      title: true,
      content: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: orderByOptions,
  });
  return res.status(200).json({ data: resumeList });
});

router.get("/posts/:resumeId", async (req, res, next) => {
  const { resumeId } = req.params;
  if (!resumeId) {
    return res.status(400).json({ message: "이력서 Id는 필수값입니다." });
  }
  const resumeDetail = await prisma.resume.findFirst({
    where: { resumeId: resumeId },
    select: {
      resumeId: true,
      title: true,
      content: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!resumeDetail)
    return res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
  return res.status(200).json({ data: resumeDetail });
});

router.patch("/posts/:resumeId", authMiddleware, async (req, res) => {
  if (!resumeId) {
    return res.status(400).json({ message: "이력서 Id는 필수값입니다." });
  }
  const validation = await resumeForm.validateAsync(req.body);
  const updatedData = validation;
  const { resumeId } = req.params;
  const { userId } = req.locals.user;

  const updateResume = await prisma.resume.update({
    data: {
      ...updatedData,
    },
    where: {
      resumeId: resumeId,
      userId: userId,
    },
  });
  if (!updateResume)
    return res.status(404).json({ message: "이력서 조회에 실패하엿습니다." });
  return res.status(201).json({ message: "이력서를 수정했습니다." });
});

router.delete("/posts/:resumeId", authMiddleware, async (req, res) => {
  const { resumeId } = req.params;
  const { userId } = req.locals.user;

  const deleteResume = await prisma.resume.delete({
    where: {
      resumeId: resumeId,
      userId: userId,
    },
  });
  if (!deleteResume)
    return res.status(404).json({ message: "이력서 조회에 실패하엿습니다." });
  return res.status(201).json({ message: "이력서를 삭제했습니다." });
});
module.exports = router;
