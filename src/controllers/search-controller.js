const prisma = require("../model/prisma");
const createError = require("../utils/create-error");

exports.getPlace = async (req, res, next) => {
  try {
    const { type } = req.body;
    let places;
    if (req.body.type) {
      places = await prisma.placer.findMany({
        where: {
          type,
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
    } else {
      places = await prisma.placer.findMany({
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
    }
    console.log(places);
    res.status(200).json({ places });
  } catch (err) {
    next(err);
  }
};

exports.getPlaceById = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const place = await prisma.placer.findUnique({
      where: {
        id: placeId,
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
        rooms: true,
      },
    });
    if (!place) {
      return next(createError("not found", 400));
    }
    console.log(place);
    res.status(200).json({ place });
  } catch (err) {
    next(err);
  }
};
