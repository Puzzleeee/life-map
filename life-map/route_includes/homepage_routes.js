const express = require('express');
const router = express.Router();

router.use('/homepage', require('../routes/homepage/home.js'));

module.exports = router;