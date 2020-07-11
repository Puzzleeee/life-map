const db = require("../db/db.js");
const homepage = require("../service/homepage/homepage.js");
const marker = require("../service/homepage/markers.js");
const diary = require("../service/homepage/diary.js");
const media = require("../service/homepage/media.js");
const social = require("../service/social/social.js");

const homepageController = () => {
  let modules = {};

  modules.home = async (req, res) => {
    const id = req.user.id;
    try {
      const { following } = await social.arrangeSocialInfo(id);
      // array of user ids that user follows, to be used to get diary entry details
      const toRetrieve = [id].concat(
        following.map((relation) => relation.followee)
      );
      const diaryEntries = await Promise.all(
        toRetrieve.map((id) => homepage.arrangeUserData(id))
      );
      const flattened = diaryEntries.reduce((a, b) => a.concat(b), []);
      res.status(200).json({
        success: true,
        data: flattened,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        err: err,
      });
    }
  };

  modules.createEntry = async (req, res) => {
    const user_id = req.user.id;
    // console.log("body", req.body);
    const { name, address, lat, lng, variant } = JSON.parse(req.body.location);
    const locationValues = { user_id, name, address, lat, lng, variant };
    const files = req.files;

    try {
      const marker_id = await marker.createMarker(locationValues);
      const { title, content } = req.body;
      const shared = JSON.parse(req.body.shared);
      const diaryValues = { user_id, marker_id, title, content, shared };
      const entryId = await diary.createDiaryEntry(diaryValues);
      await media.uploadPhotos(entryId, files);
      res.status(200).json({
        success: true,
        message: "entry created successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }
  };

  modules.deleteEntry = async (req, res) => {
    const { id, marker_id } = req.body;
    try {
      // should we do it syncronously or asyncronously?
      await media.deleteEntryPhotos(id);
      await marker.deleteMarker(marker_id);
      await diary.deleteDiaryEntry(id);
      res.status(200).json({
        success: true,
        message: "entry and all relevant media deleted successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }
  };

  return Object.freeze(modules);
};

module.exports = homepageController();
