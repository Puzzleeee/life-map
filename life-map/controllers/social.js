const social = require('../service/social/social.js');

const socialController = () => {
  let modules = {};

  modules.newFollowRequest = async (req, res) => {
    // const sender = req.user.id;
    const sender = 'ccfe1fec-7153-430d-9805-2ebcf821c937';
    const recipient = req.body.recipient;
    try {
      await social.createFollowRequest(sender, recipient);
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
      })
    }
  }

  return Object.freeze(modules);
}

module.exports = socialController();