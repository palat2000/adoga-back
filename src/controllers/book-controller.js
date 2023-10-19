const prisma = require("../model/prisma");
const createError = require("../utils/create-error");

exports.booking = async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: req.params.roomId,
      },
      include: {
        books: true,
      },
    });
    const bookCount = room.books.reduce((acc, book) => {
      const bookStart = new Date(book.fromDate);
      const bookEnd = new Date(book.toDate);
      const startNew = new Date(req.body.start);
      const endNew = new Date(req.body.end);
      if (
        (startNew >= bookStart && startNew < bookEnd) ||
        (endNew > bookStart && endNew <= bookEnd)
      ) {
        acc += 1;
      }
      return acc;
    }, 0);
    const remaining = room.totalRoomCount - bookCount;
    if (remaining === 0 || remaining < req.body.room) {
      res.status(200).json({ message: "full" });
    }
    if (req.user) {
      await prisma.book.create({
        data: {
          fromDate: new Date(req.body.start),
          toDate: new Date(req.body.end),
          userId: req.user.id,
          roomId: req.params.roomId,
          amountRoom: req.body.room,
          orders: {
            create: {
              amount: req.body.amount,
              status: "SUCCESS",
            },
          },
        },
      });
      // const room = await prisma.room.findUnique({
      //   where: {
      //     id: req.params.roomId,
      //   },
      // });
      // await prisma.room.update({
      //   where: {
      //     id: req.params.roomId,
      //   },
      //   data: {
      //     remaining: room.remaining - req.body.room,
      //   },
      // });
    } else {
      let customer;
      const found = await prisma.customer.findFirst({
        where: {
          firstName: req.customer.firstName,
          lastName: req.customer.lastName,
          email: req.customer.email,
          mobile: req.customer.mobile,
        },
      });
      if (found) {
        customer = found;
      } else {
        customer = await prisma.customer.create({
          data: {
            firstName: req.customer.firstName,
            lastName: req.customer.lastName,
            email: req.customer.email,
            mobile: req.customer.mobile,
          },
        });
      }
      await prisma.book.create({
        data: {
          fromDate: new Date(req.body.start),
          toDate: new Date(req.body.end),
          roomId: req.params.roomId,
          amountRoom: req.body.room,
          orders: {
            create: {
              amount: req.body.amount,
              status: "SUCCESS",
            },
          },
          customerId: customer.id,
        },
      });
      // const room = await prisma.room.findUnique({
      //   where: {
      //     id: req.params.roomId,
      //   },
      // });
      // await prisma.room.update({
      //   where: {
      //     id: req.params.roomId,
      //   },
      //   data: {
      //     remaining: room.remaining - req.body.room,
      //   },
      // });
    }
    res.status(200).json({ message: "OK" });
  } catch (err) {
    next(err);
  }
};
