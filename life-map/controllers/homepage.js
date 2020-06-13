const db = require('../db/db.js');
const homepage = require('../service/homepage/homepage.js');
const marker = require('../service/homepage/markers.js');
const diary = require('../service/homepage/diary.js');
const media = require('../service/homepage/media.js');

const homepageController = () => {
  let modules = {};

  modules.home = async (req, res) => {
    const id = req.user.id
    try {
      const userData = await homepage.arrangeUserData(id);
      res.status(200).json({
        success: true,
        data: userData
      })
    } catch (err) {
      res.status(400).json({
        success: false,
        err: err
      })
    }
  }

  modules.createEntry = async (req, res) => {
    const user_id = req.user.id;
    const { name, address, lat, lng } = req.body.location;
    const locationValues = { user_id, name, address, lat, lng };
    const files = req.files;
    try {
      const marker_id = await marker.createMarker(locationValues);
      const { title, content, shared } = req.body;
      const diaryValues = { user_id, marker_id, title, content, shared };
      const entryId = await diary.createDiaryEntry(diaryValues);
      await media.uploadPhotos(entryId, files);
      res.status(200).json({
        success: true,
        message: 'entry created successfully!'
      });
    } catch (err) {
      console.log(err)
      res.status(400).json({
        success: false,
        message: 'something went wrong'
      })
    }
  }

  return Object.freeze(modules);
}

module.exports = homepageController();
