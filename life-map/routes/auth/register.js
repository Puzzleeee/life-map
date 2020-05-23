const express = require('express')
const db = require('../../db/db.js')
const bcrypt = require('bcrypt')

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
    const existing = await db.get_user_by_email.execute(email)
    if (existing.length !== 0) {
      res.send("Email already used!")
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      await db.register_user.execute(name, email, hashedPassword)
      res.status(200).json({
        success: true,
        message: `${name} registered with email: ${email}`
      })
    }
  } catch (err) {
    console.log(err)
    res.status(409).json({
      success: false,
      err: err
    })
  }
})

module.exports = router;