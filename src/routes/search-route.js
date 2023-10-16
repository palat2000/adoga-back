const express = require("express");
const searchController = require("../controllers/search-controller");
const router = express.Router();

router.get("", searchController.getPlace);

module.exports = router;
