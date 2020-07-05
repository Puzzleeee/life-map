const db = require('../../db/db.js')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')

const registerUser = async (email, name, password) => {
  try {
    const existing = await db.get_user_by_email.execute(email)
    if (existing.length !== 0) {
      return {
        success: false,
        message: 'duplicate'
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const uuid = uuidv4();
      await db.register_user.execute(uuid, name, email, hashedPassword)
      await db.create_profile.execute(uuid, 'Describe yourself!', null);
      return {
        success: true,
        message: `${name} registered with ${email}`
      }
    }
  } catch (err) {
    throw (err)
  }
}

module.exports = registerUser;