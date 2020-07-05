const social = require('../service/social/social.js');

const socialController = () => {
  let modules = {};

  modules.newFollowRequest = async (req, res) => {
    const sender = req.user.id;
    // const sender = 'ccfe1fec-7153-430d-9805-2ebcf821c937';
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

  modules.getSocialInfo = async (req, res) => {
    const id = req.user.id;
    // const id = 1;
    try {
      const data = await social.arrangeSocialInfo(id);
      res.status(200).json({
        ...data,
        success: true
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
      })
    }
  }

  modules.acceptFollowRequest = async (req, res) => {
    const { id, sender, recipient } = req.body;
    const followRequest = { id, sender, recipient };
    try {
      await social.acceptFollowRequest(followRequest);
      res.status(200).json({
        success: true
      })
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false
      })
    }
  }

  modules.declineFollowRequest = async (req, res) => {
    const { id, sender, recipient } = req.body;
    const followRequest = { id, sender, recipient };
    try {
      await social.declineFollowRequest(followRequest);
      res.status(200).json({
        success: true
      })
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false
      })
    }
  }

  modules.searchUsers = async (req, res) => {
    const { searchString } = req.body;
    try {
      const results = await social.searchUsers(searchString);
      res.status(200).json({
        results,
        success: true,
        message: "Search success"
      })
    } catch (err) {
      console.log(err);
      res.status(400).json({
        results: [],
        success: false,
        message: "Search unsuccessful"
      })
    }
  }

  return Object.freeze(modules);
}

module.exports = socialController();