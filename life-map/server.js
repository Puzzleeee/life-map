const express = require('express');
const dotenv = require('dotenv')
var cors = require('cors');
const bcrypt = require('bcrypt')
const db = require('./db/db.js')

dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    fb_key: process.env.KEY
  })
});

app.post('/register', async (req, res) => {
  let name = 'test_name'
  let email ='test@mail.com'
  let password = '123456'
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.register_user.execute(name, email, hashedPassword)
    console.log("success!")
  } catch (err) {
    console.log("failure")
  }
})

app.listen(PORT, console.log(`Server running on port ${PORT}`));


