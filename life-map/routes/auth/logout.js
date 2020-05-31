const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

module.exports = router;