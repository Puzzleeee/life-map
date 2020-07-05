const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middleware/authentication/auth.js");
const profileController = require("../controllers/profile.js");

/** POST
 * /profile/user:
 *   post:
 *      id: id of the user whose profile is to be accessed
 */
router.post('/user', profileController.getUserProfile);

router.post('/update-user', profileController.updateUserProfile);

module.exports = router; 