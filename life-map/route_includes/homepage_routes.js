const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/authentication/auth.js')

router.use(checkAuthenticated)
router.use('/', require('../routes/homepage/home.js'));

module.exports = router;