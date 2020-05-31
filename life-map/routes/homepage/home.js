const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../middleware/authentication/auth.js')
const homepage = require('../../service/homepage/homepage.js');

router.get('/', checkAuthenticated, async (req, res) => {
  let id = req.user.id
  try {
    const userData = await homepage.arrangeUserData(id);
    res.status(200).json({
      success: true,
      data: userData
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err: err
    })
  }
})

module.exports = router;