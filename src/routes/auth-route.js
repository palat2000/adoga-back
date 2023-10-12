const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const authenMiddleware = require("../middlewares/authen");

router.post("/login", authController.login);
router.post("/login/place", authController.loginPlace);
router.post("/register", authController.register);
router.post("/register/place", authController.registerPlace);
router.get("/me", authenMiddleware, authController.getMe);

module.exports = router;
