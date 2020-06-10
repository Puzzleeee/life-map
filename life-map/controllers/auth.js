const db = require('../db/db.js');
const registerUser = require('../service/authentication/register.js');

const authController = () => {
  let modules = {};

  modules.checkAuth = (req, res) => {
    if (req.isAuthenticated()) {
      const { name, id } = req.user;
      res.status(200).json({
        authenticated: true,
        user: { name: name, id: id }
      })
    } else {
      res.status(200).json({
        authenticated: false,
        user: {}
      })
    }
  }

  modules.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = await registerUser(email, name, password);
      res.status(200).json(result)
    } catch (err) {
      console.log(err)
      res.status(409).json({
        success: false,
        err: err
      })
    }
  }

  modules.failure = (req, res) => {
    res.status(200).json({
      success: false,
      user: {}
    })
  }

  modules.login = (req, res) => {
    const message = "Welcome to the log in page"
    res.json({
      message: message
    })
  }

  modules.logout = (req, res) => {
    req.logOut()
    res.redirect('/login')
  }

  return Object.freeze(modules);
}

module.exports = authController();