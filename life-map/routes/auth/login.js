const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  let message = "Email or password incorrect, please check again"
  res.json({
    message: message
  })
})

module.exports = router;
