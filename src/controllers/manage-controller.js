const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");
const createError = require("../utils/create-error");
const {
  roomSchema,
  changePasswordSchema,
  mobileSchema,
  profile,
} = require("../validators/manageSchema");
const { upload } = require("../utils/cloundinary-service");

exports.createRoom = async (req, res, next) => {
  try {
    const { value, error } = roomSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    if (!req.files) {
      return next(createError("not found image", 400));
    }
    const imageRoom = await upload(req.files.imageRoom[0].path);
    const data = {
      ...value,
      placerId: req.placer.id,
    };
    const room = await prisma.room.create({
      data,
    });
    await prisma.imageRoom.create({
      data: {
        image: imageRoom,
        roomId: room.id,
      },
    });
    res.status(200).json({ room: { ...room, images: [{ image: imageRoom }] } });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      fs.unlink(req.files.imageRoom[0].path);
    }
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

exports.changeUserPassword = async (req, res, next) => {
  try {
    const { value, error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!foundUser) {
      return next(createError("user not found", 400));
    }
    const isMatch = await bcrypt.compare(value.password, foundUser.password);
    if (!isMatch) {
      return next(createError("cannot change password", 400));
    }
    const hashed = await bcrypt.hash(value.newPassword, 13);
    await prisma.user.update({
      data: {
        password: hashed,
      },
      where: {
        id: foundUser.id,
      },
    });
    res.status(200).json({ message: "changed password" });
  } catch (err) {
    next(err);
  }
};

exports.addMobile = async (req, res, next) => {
  try {
    const { value, error } = mobileSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!foundUser) {
      return next(createError("user not found", 400));
    }
    const isUsed = await prisma.user.findUnique({
      where: {
        mobile: value.mobile,
      },
    });
    if (isUsed) {
      return next(createError("mobile is already used", 400));
    }
    await prisma.user.update({
      data: value,
      where: {
        id: foundUser.id,
      },
    });
    res.status(200).json({ message: "add mobile" });
  } catch (err) {
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const { value, error } = profile.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!foundUser) {
      return createError("user not found", 400);
    }
    await prisma.user.update({
      data: value,
      where: {
        id: foundUser.id,
      },
    });
    res.status(200).json({ message: "updated" });
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
      include: {
        images: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json({ rooms });
  } catch (err) {
    next(err);
  }
};

exports.getMyBooking = async (req, res, next) => {
  try {
    const allBooking = await prisma.book.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        room: {
          include: {
            placer: {
              select: {
                name: true,
              },
            },
            images: true,
          },
        },
      },
    });
    res.status(200).json({ allBooking });
  } catch (err) {
    next(err);
  }
};

exports.getPlaceBooking = async (req, res, next) => {
  try {
    const placeBooking = await prisma.room.findMany({
      where: {
        placerId: req.placer.id,
      },
      include: {
        books: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            customer: true,
          },
        },
        images: true,
      },
    });
    res.status(200).json({ placeBooking });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const existBook = await prisma.book.findUnique({
      where: {
        id: req.params.bookId,
      },
    });
    if (!existBook) {
      return next(createError("booking not found", 400));
    }
    const existOrder = await prisma.order.findFirst({
      where: {
        bookId: existBook.id,
      },
    });
    if (!existBook) {
      return next(createError("order not found", 400));
    }
    await prisma.order.delete({
      where: {
        id: existOrder.id,
      },
    });
    await prisma.book.delete({
      where: {
        id: existBook.id,
      },
    });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
