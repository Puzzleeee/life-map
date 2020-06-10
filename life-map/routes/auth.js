const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.js')

router.get('/check-auth', authController.checkAuth);

router.get('/failure', authController.failure);

router.get('/login', authController.login);

router.post('/logout', authController.logout);


/**
 * /register:
 *   post:
 *     name: Name of the new user that is registering
 *     email: Email address of the user
 *     password: password for the user's new account
 */
router.post('/register', authController.register);



module.exports = router;
