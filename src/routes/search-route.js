const express = require("express");
const searchController = require("../controllers/search-controller");
const router = express.Router();

router.post("/", searchController.getPlace);
router.post("/place/:placeId", searchController.getPlaceById);
router.get("/room/:roomId", searchController.getRoomById);

module.exports = router;
