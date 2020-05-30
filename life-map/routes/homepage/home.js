const express = require('express')
const { checkAuthenticated } = require('../../middleware/authentication/auth.js')
const markers = require('../../service/homepage/markers.js')

const router = express.Router()

router.get('/', checkAuthenticated, async (req, res) => {
  let id = req.user.id
  try {
    const userMarkers = await markers.getMarkers(id);
    res.status(200).json({
      success: true,
      data: userMarkers
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err: err
    })
  }
})

module.exports = router;