const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../../middleware/authentication/auth.js');
const diary = require('../../service/homepage/diary.js');
const marker = require('../../service/homepage/markers.js');

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
router.post('/', checkAuthenticated, async (req, res) => {
  const user_id = req.user.id;
  const { name, address, lat, lng } = req.body.location;
  const locationValues = { user_id, name, address, lat, lng };
  try {
    const marker_id = await marker.createMarker(locationValues);
    const { title, content, shared } = req.body;
    const diaryValues = { user_id, marker_id, title, content, shared };
    await diary.createDiaryEntry(diaryValues);
    res.status(200).json({
      success: true,
      message: 'entry created successfully!'
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      success: false,
      message: 'something went wrong'
    })
  }
})

module.exports = router;