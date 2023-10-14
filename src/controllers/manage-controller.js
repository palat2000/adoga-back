const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");
const createError = require("../utils/create-error");
const {
  roomSchema,
  changePasswordSchema,
} = require("../validators/manageSchema");

exports.createRoom = async (req, res, next) => {
  try {
    const { value, error } = roomSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const data = {
      ...value,
      remaining: value.totalRoomCount,
      placerId: req.placer.id,
    };
    const room = await prisma.room.create({
      data,
    });
    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { value, error } = roomSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundPlacer = await prisma.placer.findUnique({
      where: {
        id: req.placer.id,
      },
    });
    if (!foundPlacer) {
      return next(createError("cannot update", 400));
    }
    await prisma.room.update({
      where: {
        id: req.params.roomId,
      },
      data: value,
    });
    res.status(200).json({ message: "OK" });
  } catch (err) {
    next(err);
  }
};

exports.changePlacePassword = async (req, res, next) => {
  try {
    const { value, error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundPlacer = await prisma.placer.findUnique({
      where: {
        id: req.placer.id,
      },
    });
    if (!foundPlacer) {
      return next(createError("cannot change password this id", 400));
    }
    const isMatch = await bcrypt.compare(value.password, foundPlacer.password);
    if (!isMatch) {
      return next(createError("cannot change password", 400));
    }
    const hashed = await bcrypt.hash(value.newPassword, 13);
    await prisma.placer.update({
      data: {
        password: hashed,
      },
      where: {
        id: foundPlacer.id,
      },
    });
    res.status(200).json({ message: "changed password" });
  } catch (err) {
    next(err);
  }
};

exports.getMyRooms = async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        placerId: req.placer.id,
      },
      orderBy: {
        name: "asc",
      },
    });
    if (!rooms) {
      return next(createError("not found rooms", 400));
    }
    res.status(200).json({ rooms });
  } catch (err) {
    next(err);
  }
};
