const express = require('express');
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    fb_key: process.env.KEY
  })
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));


