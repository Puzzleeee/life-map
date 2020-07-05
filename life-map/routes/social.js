const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middleware/authentication/auth.js");
const socialController = require("../controllers/social.js");


/** POST
 * /social/follow:
 *   post:
 *      recipient: UUID of the follow request recipient
 */
router.post('/follow', socialController.newFollowRequest);

/** GET 
 * /social/social-info
 *   response:
 *      { 
 *        followRequest: array of user's follow requests
 *        followers: array of user's followers 
 *        following: array of user's following 
 *      }
 */
router.get('/social-info', socialController.getSocialInfo);

/** POST
 * /social/accept-follow-request && /social/decline-follow-request
 *   post:
 *      id: id of the follow request
 *      sender: id of the request sender
 *      recipient: id of the request recipient
 */
router.post('/accept-follow-request', socialController.acceptFollowRequest);
router.post('/decline-follow-request', socialController.declineFollowRequest);

/** POST
 * /social/user
 *   post:
 *      searchString: string to run search on
 */
router.post('/user', socialController.searchUsers);

module.exports = router;