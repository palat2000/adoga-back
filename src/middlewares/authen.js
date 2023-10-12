const jwt = require("jsonwebtoken");
const createError = require("../utils/create-error");
const prisma = require("../model/prisma");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }
    const [, token] = authorization.split(" ");
    const payload = jwt.verify(token, process.env.SECRET_KEY || "sdfghjk");
    const foundUser = await prisma.user.findUnique({
      where: {
        id: payload.userId || payload.placerId,
      },
    });
    if (foundUser) {
      delete foundUser.password;
      req.user = foundUser;
      req.isPlacer = false;
      return next();
    }
    const foundPlacer = await prisma.placer.findUnique({
      where: {
        id: payload.placerId || payload.userId,
      },
    });
    if (foundPlacer) {
      delete foundPlacer.password;
      req.placer = foundPlacer;
      req.isPlacer = true;
      return next();
    }
    return next(createError("unauthenticated", 401));
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
