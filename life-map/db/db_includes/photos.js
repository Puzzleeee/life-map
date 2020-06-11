module.exports = function (crud) {
  return {
    get_photos_by_entry_id: require('../tables/photos/get_photos_by_entry_id.js')(crud)
  }
}