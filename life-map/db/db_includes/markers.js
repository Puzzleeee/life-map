module.exports = function (crud) {
  return {
    get_markers_by_user_id : require('../tables/markers/get_markers_by_user_id.js')(crud),
    get_marker_by_id: require('../tables/markers/get_marker_by_id.js')(crud),
    create_marker: require('../tables/markers/create_marker.js')(crud),
    delete_marker: require('../tables/markers/delete_marker.js')(crud),
  }
}