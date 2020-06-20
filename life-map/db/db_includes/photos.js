module.exports = function (crud) {
  return {
    get_photos_by_entry_id: require('../tables/photos/get_photos_by_entry_id.js')(crud),
    upload_photo: require('../tables/photos/upload_photo.js')(crud),
    delete_photos_by_entry_id: require('../tables/photos/delete_photos_by_entry_id.js')(crud),
  }
}