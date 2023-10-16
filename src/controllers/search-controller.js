const prisma = require("../model/prisma");

exports.getPlace = async (req, res, next) => {
  try {
    const places = await prisma.placer.findMany({
      where: {
        type: req.query.type,
      },
      select: {
        email: true,
        id: true,
        imagePlaces: true,
        lat: true,
        lng: true,
        mobile: true,
        name: true,
        type: true,
      },
    });
    console.log(places);
    res.status(200).json({ places });
  } catch (err) {
    next(err);
  }
};
