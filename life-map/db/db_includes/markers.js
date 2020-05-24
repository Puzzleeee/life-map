module.exports = function (crud) {
  return {
    get_markers_by_user_id : require('../tables/markers/get_markers_by_user_id.js')(crud),
  }
}