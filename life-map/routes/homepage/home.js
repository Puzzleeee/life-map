const express = require('express')
const homepage = require('../../service/homepage/homepage.js')

const router = express.Router()

router.get('/', async (req, res) => {
  let id = req.user.id
  try {
    const markers = await homepage.getMarkers(id);
    res.status(200).json({
      success: true,
      data: markers
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err: err
    })
  }
})

module.exports = router;