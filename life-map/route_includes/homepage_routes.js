const express = require('express');
const router = express.Router();

router.use('/homepage', require('../routes/homepage/markers.js'));

module.exports = router;