const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerSchema,
  loginSchema,
  registerPlaceSchema,
} = require("../validators/authSchema");
const cloudinary = require("../config/cloudinary");
const prisma = require("../model/prisma");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloundinary-service");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const isEmailUsed = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (isEmailUsed) {
      return next(createError("This email is already used", 400));
    }
    const customer = await prisma.customer.findFirst({
      where: {
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
      },
    });
    if (customer) {
      const isMobileUsed = await prisma.user.findUnique({
        where: {
          mobile: customer.mobile,
        },
      });
      if (isMobileUsed) {
        delete customer.mobile;
      }
      const hashed = await bcrypt.hash(value.password, 13);
      const user = await prisma.user.create({
        data: {
          ...customer,
          password: hashed,
        },
      });
      await prisma.book.updateMany({
        where: {
          customerId: customer.id,
        },
        data: {
          userId: user.id,
        },
      });
      await prisma.customer.delete({
        where: {
          id: customer.id,
        },
      });
      const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY || "lkshflksdhfjkh",
        {
          expiresIn: process.env.EXPIRE,
        }
      );
      delete user.password;
      return res.status(201).json({ token, user });
    }
    value.password = await bcrypt.hash(value.password, 13);
    const user = await prisma.user.create({
      data: value,
    });
    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY || "lkshflksdhfjkh",
      {
        expiresIn: process.env.EXPIRE,
      }
    );
    delete user.password;
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      next(error);
    }
    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: value.email }, { mobile: value.mobile }],
      },
    });
    if (!foundUser) {
      return next(createError("invalid email or mobile or password", 400));
    }
    const isMatch = await bcrypt.compare(value.password, foundUser.password);
    if (!isMatch) {
      return next(createError("invalid email or mobile or password", 400));
    }
    const token = jwt.sign(
      { userId: foundUser.id },
      process.env.SECRET_KEY || "asdfdfsfdg",
      { expiresIn: process.env.EXPIRE }
    );
    res.status(200).json({ user: foundUser, token });
  } catch (err) {
    next(err);
  }
};

exports.registerPlace = async (req, res, next) => {
  try {
    const { value, error } = registerPlaceSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    if (!req.files) {
      return next(createError("image not found", 400));
    }
    const isEmailUsed = await prisma.placer.findUnique({
      where: {
        email: value.email,
      },
    });
    if (isEmailUsed) {
      return next(createError("email is already used", 400));
    }
    const isMobileUsed = await prisma.placer.findUnique({
      where: {
        mobile: value.mobile,
      },
    });
    if (isMobileUsed) {
      return next(createError("mobile is already used", 400));
    }
    value.password = await bcrypt.hash(value.password, 13);
    const placer = await prisma.placer.create({
      data: value,
    });
    const imagePlace = await upload(req.files.imagePlace[0].path);
    await prisma.imagePlace.create({
      data: {
        image: imagePlace,
        placerId: placer.id,
      },
    });
    const token = jwt.sign(
      { placerId: placer.id },
      process.env.SECRET_KEY || "asdsafgdsfa",
      { expiresIn: process.env.EXPIRE }
    );
    delete placer.password;
    res
      .status(201)
      .json({ token, user: { ...placer, isPlacer: true, imagePlace } });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      fs.unlink(req.files.imagePlace[0].path);
    }
  }
};

exports.loginPlace = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundPlacer = await prisma.placer.findFirst({
      where: {
        OR: [{ email: value.email }, { mobile: value.mobile }],
      },
      include: {
        imagePlaces: {
          select: {
            image: true,
          },
        },
      },
    });
    if (!foundPlacer) {
      return next(createError("invalid email or mobile or password", 400));
    }
    const isMatch = await bcrypt.compare(value.password, foundPlacer.password);
    if (!isMatch) {
      return next(createError("invalid email or mobile or password", 400));
    }
    const token = jwt.sign(
      { placerId: foundPlacer.id },
      process.env.SECRET_KEY || "dfghjasc",
      { expiresIn: process.env.EXPIRE }
    );
    delete foundPlacer.password;
    res.status(200).json({ token, user: { ...foundPlacer, isPlacer: true } });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  if (req.placer) {
    return res.status(200).json({ user: { ...req.placer, isPlacer: true } });
  }
  next(createError("Error", 400));
};
