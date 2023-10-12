const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerSchema,
  loginSchema,
  registerPlaceSchema,
} = require("../validators/authSchema");
const prisma = require("../model/prisma");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const isMatch = await prisma.user.findFirst({
      where: {
        email: value.email,
      },
    });
    if (isMatch) {
      return next(createError("This email is already used", 400));
    }
    value.password = await bcrypt.hash(value.password, 15);
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
    value.password = await bcrypt.hash(value.password, 15);
    const placer = await prisma.placer.create({
      data: value,
    });
    const token = jwt.sign(
      { placerId: placer.id },
      process.env.SECRET_KEY || "asdsafgdsfa",
      { expiresIn: process.env.EXPIRE }
    );
    delete placer.password;
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
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
    res.status(200).json({ token, user: foundPlacer });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  next(createError("Error", 400));
};
