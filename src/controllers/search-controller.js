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
          name: {
            contains: req.body.search || "",
          },
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
          rooms: {
            include: {
              books: true,
            },
          },
        },
      });
    } else {
      places = await prisma.placer.findMany({
        where: {
          name: {
            contains: req.body.search || "",
          },
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
          rooms: {
            include: {
              books: true,
            },
          },
        },
      });
    }
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
    const placesNotBook = placesInFilter.filter((place) => {
      let result = true;
      place.rooms.forEach((room) => {
        if (room.remaining >= req.body.room) {
          return true;
        }
        room.books.forEach((book) => {
          const bookStartDate = new Date(book.fromDate).getTime();
          const bookEndDate = new Date(book.toDate).getTime();
          const startDate = new Date(req.body.start).getTime();
          const endDate = new Date(req.body.end).getTime();
          if (startDate >= bookStartDate && startDate <= bookEndDate) {
            result = false;
          }
          if (endDate >= bookStartDate && endDate <= bookEndDate) {
            result = false;
          }
        });
      });
      return result;
    });
    // console.log(placesNotBook);
    res.status(200).json({ places: placesNotBook });
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
        rooms: {
          include: {
            books: true,
            images: true,
          },
        },
      },
    });
    if (!place) {
      return next(createError("not found", 400));
    }
    const filterRoom = place.rooms.filter((room) => {
      if (
        room.remaining >= req.body.room &&
        room.maximumNumberPeople >= req.body.people
      ) {
        return true;
      }
      let result = true;
      room.books.forEach((book) => {
        const bookStartDate = new Date(book.fromDate).getTime();
        const bookEndDate = new Date(book.toDate).getTime();
        const startDate = new Date(req.body.start).getTime();
        const endDate = new Date(req.body.end).getTime();
        if (startDate >= bookStartDate && startDate <= bookEndDate) {
          result = false;
        }
        if (endDate >= bookStartDate && endDate <= bookEndDate) {
          result = false;
        }
      });
      if (!result) {
        return result;
      }
    });
    // console.log(filterRoom);
    place.rooms = filterRoom;
    res.status(200).json({ place });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: req.params.roomId,
      },
      include: {
        placer: true,
        images: true,
      },
    });
    if (!room) {
      return next(createError("room not found", 400));
    }
    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};
