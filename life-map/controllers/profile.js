const profile = require('../service/profile/profile.js');

const profileController = () => {
  let modules = {};

  modules.getUserProfile = async (req, res) => {
    const id = req.body.id;
    try {
      const result = await profile.getUserProfile(id);
      res.status(200).json({
        ...result,
        success: true,
        message: 'Successfully retrived profile info'
      })
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: 'Failed to retrive profile info'
      })
    }
  }
  return Object.freeze(modules);
}

module.exports = profileController();