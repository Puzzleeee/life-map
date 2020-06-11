const db = require('../../db/db.js')
const AWS = require('../aws-upload/aws.js');

const media = () => {
  let modules = {};

  modules.retrievePhotos = async (entryId) => {
    const fileNames = await db.get_photos_by_entry_id.execute(entryId)
        .then((result) => result.map(x => x.file_name));
    return Promise.all(fileNames.map(x => AWS.retrieve(x)));
  }

  return Object.freeze(modules);
}

module.exports = media();