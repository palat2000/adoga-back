const prisma = require("../model/prisma");
const { roomSchema } = require("../validators/manageSchema");

exports.createRoom = async (req, res, next) => {
  try {
    const { value, error } = roomSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // const room = await prisma.room.create({
    //   data: value,
    // });
    res.send("ok");
  } catch (err) {
    next(err);
  }
};
