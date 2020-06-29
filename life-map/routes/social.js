const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middleware/authentication/auth.js");
const socialController = require("../controllers/social.js");


/**
 * /follow:
 *   post:
 *      recipient: UUID of the follow request recipient
 */
router.post('/follow', socialController.newFollowRequest);

module.exports = router;