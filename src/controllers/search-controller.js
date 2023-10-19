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
    const placesInFilter = places.filter((place) => {
      let result = false;
      if (!place.rooms?.length) {
        return false;
      }
      for (let room of place.rooms) {
        if (
          room.price >= req.body.minPrice &&
          room.price <= req.body.maxPrice &&
          room.maximumNumberPeople >= req.body.people
        ) {
          result = true;
        }
      }
      return result;
    });
    const placesNotFullBook = placesInFilter.reduce((allPlace, place) => {
      const freeRoom = place.rooms.reduce((allRoom, room) => {
        const bookCount = room.books.reduce((acc, book) => {
          const bookStart = new Date(book.fromDate);
          const bookEnd = new Date(book.toDate);
          const startNew = new Date(req.body.start);
          const endNew = new Date(req.body.end);
          if (
            (startNew >= bookStart && startNew < bookEnd) ||
            (endNew > bookStart && endNew <= bookEnd)
          ) {
            acc += book.amountRoom;
          }
          return acc;
        }, 0);
        room.remaining = room.totalRoomCount - bookCount;
        if (room.remaining >= req.body.room) {
          allRoom.push(room);
        }
        return allRoom;
      }, []);
      place.rooms = freeRoom;
      if (place.rooms.length) {
        allPlace.push(place);
      }
      return allPlace;
    }, []);
    res.status(200).json({ places: placesNotFullBook });
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
    const filterRoom = place.rooms.reduce((acc, room) => {
      let count = 0;
      room.books.forEach((book) => {
        const bookStart = new Date(book.fromDate);
        const bookEnd = new Date(book.toDate);
        const startNew = new Date(req.body.start);
        const endNew = new Date(req.body.end);
        if (
          (startNew >= bookStart && startNew < bookEnd) ||
          (endNew > bookStart && endNew <= bookEnd)
        ) {
          count += book.amountRoom;
        }
      });
      room.remaining = room.totalRoomCount - count;
      if (
        room.remaining !== 0 &&
        room.remaining >= req.body.room &&
        room.maximumNumberPeople >= req.body.people
      ) {
        acc.push(room);
      }
      return acc;
    }, []);
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
