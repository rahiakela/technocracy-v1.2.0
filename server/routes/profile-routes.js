const express = require("express");
const router = express.Router();
const verifyJWT = require("../config/verify-jwt-token");
const profileController = require("../controllers/profile-controller");

//routes for user profile
router.get("/api/profile/:userId", verifyJWT, profileController.getProfile);
router.post("/api/profile/:userId", verifyJWT, profileController.saveProfile);
router.put("/api/profile/:profileId", verifyJWT, profileController.updateProfile);
router.put("/api/profile/photo/:userId", verifyJWT, profileController.updateProfileImage);
router.delete("/api/profile/:profileId", verifyJWT, profileController.deleteProfile);

//export router
module.exports = router;