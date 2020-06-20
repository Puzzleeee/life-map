const db = require("../../db/db.js");
const AWS = require("../aws-upload/aws.js");

const media = () => {
  let modules = {};

  modules.retrievePhotos = async (entryId) => {
    const fileNames = await db.get_photos_by_entry_id
      .execute(entryId)
      .then((result) => result.map((x) => x.file_name));
    return Promise.all(fileNames.map((x) => AWS.retrieve(x)));
  };

  modules.uploadPhotos = async (entryId, files) => {
    if (files) {
      let fileArr = Array.isArray(files) ? files : [files];
      let promises = [];
      for (let i = 0; i < fileArr.length; i++) {
        promises.push(db.upload_photo.execute(entryId, fileArr[i].name));
        promises.push(AWS.upload(fileArr[i]));
      }
      return Promise.all(promises);
    }
    return Promise.resolve(true);
  };

  /**
   * Delete all photos associated with a diary entry
   * @param {number} id id of the diary entry that is going to be deleted
   */
  modules.deleteEntryPhotos = async (id) => {
    return db.delete_photos_by_entry_id.execute(id);
  }

  return Object.freeze(modules);
};

module.exports = media();
