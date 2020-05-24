const express = require('express')
const db = require('../../db/db.js')

const router = express.Router()

router.get('/', async (req, res) => {
  let id = req.body.user_id;
  try {
    const markers = await db.get_markers_by_user_id.execute(id)
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