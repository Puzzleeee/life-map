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

  modules.updateUserProfile = async (req, res) => {
    const { profile_id, id, bio, name } = req.body;
    try {
      await profile.updateUserProfile(profile_id, id, bio, name);
      res.status(200).json({
        success: true,
        message: 'Successfully updated profile'
      })
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: 'Failed to update profile'
      })
    }
  }

  modules.updateProfilePic = async (req, res) => {
    const profile_id = req.body.profile_id;
    const photo = req.files.length > 0 ? req.files[0] : null;

    try {
      await profile.updateProfilePic(profile_id, photo);
      res.status(200).json({
        success: true,
        message: 'Successfully updated profile picture'
      })
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: 'Failed to update profile picture'
      })
    }
  }
  return Object.freeze(modules);
}

module.exports = profileController();