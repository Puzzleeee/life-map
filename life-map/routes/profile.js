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

router.post('/user-summary', checkAuthenticated, profileController.getUserSummary);

router.post('/update-user', checkAuthenticated, profileController.updateUserProfile);

router.post('/profile-pic', [checkAuthenticated, busboyMiddleware], profileController.updateProfilePic);

router.get('/profile-pic', checkAuthenticated, profileController.getProfilePic);

module.exports = router; 