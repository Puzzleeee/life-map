const express = require('express');
const router = express.Router();

router.use('/register', require('../routes/auth/register.js'));
router.use('/logout', require('../routes/auth/logout.js'));
router.use('/login', require('../routes/auth/login.js'));
router.use('/failure', require('../routes/auth/failure.js'))



module.exports = router;