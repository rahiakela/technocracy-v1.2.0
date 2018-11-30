const express = require("express");
const router = express.Router();
const verifyJWT = require("../config/verify-jwt-token");
const homeController = require("../controllers/home-controller");
const authController = require("../controllers/auth-controller");

//routes for home
router.get("/api/home", homeController.home);

//routes for authentication
router.post("/api/register", authController.register);
router.post("/api/login", authController.login);

//routes for user profile
router.post("/api/profile", authController.saveUserInfo);

//routes for subscribe
router.get("/api/subscribe/:mailId", homeController.subscribe);
router.get("/api/unsubscribe/:mailId", homeController.unsubscribe);

// routes for account verification
router.get("/api/account/:verifyToken", authController.activateAccount);
router.get("/api/account/reverify/:email", authController.reverifyMailAccount);
router.put("/api/account/:newMailId/:oldMailId", authController.updateMailAccount);

//export router
module.exports = router;