const createError = require("../utils/create-error");

module.exports = (req, res, next) => {
  if (req.isPlacer) {
    return next();
  }
  next(createError("you don't have permission", 401));
};
