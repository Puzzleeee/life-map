const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../middleware/authentication/auth.js");
const busboyMiddleware = require("../middleware/file-upload/busboy.js");
const { newEntryRules, newEntryValidator } = require("../middleware/validation/validator.js");
const homepageController = require("../controllers/homepage.js");

router.get("/", checkAuthenticated, homepageController.home);

/**
 * /homepage/create-entry:
 *  post:
 *    title: title of diary entry
 *    content: content of diary entry
 *    shared: 1/0, whether the diary entry should be shared with friends
 *    location: object that represents the location of the diary entry
 *              with the shape: {
 *                     name: String,
 *                     address: String,
 *                     lat: Number,
 *                     lng: Number,
 *                     fileName: String || [String]
 *                 }
 */
router.post(
  "/create-entry",
  newEntryRules(),
  [
    checkAuthenticated,
    busboyMiddleware,
    newEntryValidator,
  ],
  homepageController.createEntry
);

/**
 * /homepage/delete-entry:
 * post:
 *   id: id of the diary entry to be deleted
 *   marker_id: id of the marker associated witht he diary entry
 */
router.post("/delete-entry", checkAuthenticated, homepageController.deleteEntry);

module.exports = router;
