const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { name, id } = req.user;
    res.status(200).json({
      authenticated: true,
      user: { name: name, id: id }
    })
  } else {
    res.status(200).json({
      authenticated: false,
      user: {}
    })
  }
})

module.exports = router;