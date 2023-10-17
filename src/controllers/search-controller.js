const prisma = require("../model/prisma");
const createError = require("../utils/create-error");

exports.getPlace = async (req, res, next) => {
  try {
    const { type } = req.body;
    if (req.body.type) {
      const places = await prisma.placer.findMany({
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
          rooms: true,
        },
      });
      return res.status(200).json({ places });
    }
    const places = await prisma.placer.findMany({
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
    const placesInFilter = places.filter((el) => {
      let result = false;
      if (!el.rooms?.length) {
        return false;
      }
      for (let room of el.rooms) {
        if (
          room.price >= req.body.minPrice &&
          room.price <= req.body.maxPrice &&
          room.maximumNumberPeople >= req.body.people &&
          room.remaining >= req.body.room
        ) {
          result = true;
        }
      }
      return result;
    });
    console.log(placesInFilter);
    res.status(200).json({ places: placesInFilter });
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
