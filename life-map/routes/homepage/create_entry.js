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
 */
router.post('/', checkAuthenticated, async (req, res) => {
  const values = {
    user_id: req.user.id,
    marker_id: 1, // hard code marker_id to be 1 for now
    title: req.body.title,
    content: req.body.content,
    shared: req.body.shared
  }
  try {
    await diary.createDiaryEntry(values);
    res.status(200).json({
      success: true,
      message: 'entry created successfully!'
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({
      success: false,
      message: 'something went wrong'
    })
  }
})

module.exports = router;