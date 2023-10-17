const express = require("express");
const searchController = require("../controllers/search-controller");
const router = express.Router();

router.post("/", searchController.getPlace);
router.get("/place/:placeId", searchController.getPlaceById);

module.exports = router;
