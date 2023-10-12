const express = require("express");
const authenMiddleware = require("../middlewares/authen");
const isPlacerMiddleware = require("../middlewares/is-placer");
const manageController = require("../controllers/manage-controller");

const router = express.Router();

router.post(
  "/create-room",
  authenMiddleware,
  isPlacerMiddleware,
  manageController.createRoom
);

module.exports = router;
