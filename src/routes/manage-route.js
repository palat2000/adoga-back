const express = require("express");
const authenMiddleware = require("../middlewares/authen");
const isPlacerMiddleware = require("../middlewares/is-placer");
const manageController = require("../controllers/manage-controller");

const router = express.Router();

router.get(
  "/my-rooms",
  authenMiddleware,
  isPlacerMiddleware,
  manageController.getMyRooms
);
router.post(
  "/create-room",
  authenMiddleware,
  isPlacerMiddleware,
  manageController.createRoom
);
router.patch(
  "/update-room/:roomId",
  authenMiddleware,
  isPlacerMiddleware,
  manageController.updateRoom
);
router.patch(
  "/change-password/place",
  authenMiddleware,
  isPlacerMiddleware,
  manageController.changePlacePassword
);

module.exports = router;
