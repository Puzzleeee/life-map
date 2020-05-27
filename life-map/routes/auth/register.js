const express = require('express')
const registerUser = require('../../service/authentication/register.js')
const router = express.Router()

/**
 * /register:
 *   post:
 *     name: Name of the new user that is registering
 *     email: Email address of the user
 *     password: password for the user's new account
 */
router.post('/', async (req, res) => {
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password

  try {
    let result = await registerUser(email, name, password);
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(409).json({
      success: false,
      err: err
    })
  }
})

module.exports = router;