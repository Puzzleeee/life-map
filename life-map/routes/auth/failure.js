const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    success: false,
    user: {}
  })
})

module.exports = router;