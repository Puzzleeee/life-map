const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/authentication/auth.js');
const homepageController = require('../controllers/homepage.js');

router.get('/', checkAuthenticated, homepageController.home)

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
 *                     lng: Number
 *                 }
 */
router.post('/create-entry', checkAuthenticated, homepageController.createEntry)



module.exports = router;