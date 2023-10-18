const dayjs = require("dayjs");
const prisma = require("../model/prisma");
const createError = require("../utils/create-error");

exports.booking = async (req, res, next) => {
  try {
    // console.log(req.customer);
    // console.log(req.body);
    // const books = await prisma.book.findMany({
    //   where: {
    //     roomId: req.params.roomId,
    //   },
    // });
    // const result = books.filter((book) => {
    //   const bookStartDate = new Date(book.fromDate).getTime();
    //   const bookEndDate = new Date(book.toDate).getTime();
    //   const startDate = new Date(req.body.start).getTime();
    //   const endDate = new Date(req.body.end).getTime();
    //   if (startDate >= bookStartDate && startDate <= bookEndDate) {
    //     return true;
    //   }
    //   if (endDate >= bookStartDate && endDate <= bookEndDate) {
    //     return true;
    //   }
    // });
    // if (result.length) {
    //   return next(createError("date already book", 400));
    // }
    const room = await prisma.room.findUnique({
      where: {
        id: req.params.roomId,
      },
    });
    if (!room.remaining >= req.body.room) {
      res.status(200).json({ message: "full" });
    }
    const customer = await prisma.customer.find;
    if (req.user) {
      await prisma.book.create({
        data: {
          fromDate: new Date(req.body.start),
          toDate: new Date(req.body.end),
          userId: req.user.id,
          roomId: req.params.roomId,
          orders: {
            create: {
              amount: req.body.amount,
              status: "SUCCESS",
            },
          },
        },
      });

      const room = await prisma.room.findUnique({
        where: {
          id: req.params.roomId,
        },
      });
      await prisma.room.update({
        where: {
          id: req.params.roomId,
        },
        data: {
          remaining: room.remaining - req.body.room,
        },
      });
    } else {
      const customer = await prisma.customer.create({
        data: {
          firstName: req.customer.firstName,
          lastName: req.customer.lastName,
          email: req.customer.email,
          mobile: req.customer.mobile,
        },
      });
      await prisma.book.create({
        data: {
          fromDate: new Date(req.body.start),
          toDate: new Date(req.body.end),
          roomId: req.params.roomId,
          orders: {
            create: {
              amount: req.body.amount,
              status: "SUCCESS",
            },
          },
          customerId: customer.id,
        },
      });

      const room = await prisma.room.findUnique({
        where: {
          id: req.params.roomId,
        },
      });
      await prisma.room.update({
        where: {
          id: req.params.roomId,
        },
        data: {
          remaining: room.remaining - req.body.room,
        },
      });
    }
    res.status(200).json({ message: "OK" });
  } catch (err) {
    next(err);
  }
};
