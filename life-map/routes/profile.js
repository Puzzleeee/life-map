const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middleware/authentication/auth.js");
const busboyMiddleware = require("../middleware/file-upload/busboy.js");
const profileController = require("../controllers/profile.js");

/** POST
 * /profile/user:
 *   post:
 *      id: id of the user whose profile is to be accessed
 */
router.post('/user', checkAuthenticated, profileController.getUserProfile);

router.post('/update-user', checkAuthenticated, profileController.updateUserProfile);

router.post('/profile-pic', [checkAuthenticated, busboyMiddleware], profileController.updateProfilePic);

module.exports = router; 