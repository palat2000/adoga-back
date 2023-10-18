const express = require("express");
const bookController = require("../controllers/book-controller");
const authenMiddleware = require("../middlewares/authen");
const router = express.Router();

router.post("/:roomId", authenMiddleware, bookController.booking);

module.exports = router;
