const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/authentication/auth.js');

router.use(checkAuthenticated)
router.use('/', require('../routes/homepage/home.js'));
router.use('/create-entry', require('../routes/homepage/create_entry.js'));

module.exports = router;