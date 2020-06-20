const db = require('../../db/db.js')

const homepage = () => {
  let modules = {};

  modules.getMarkers = async (id) => {
    return db.get_marker_by_id.execute(id);
  }
  /**
   * Create a map marker 
   * @param {Object} marker - the marker to be created
   * @param {number} marker.user_id - id of the user the marker belongs to
   * @param {number} marker.lng - lng of the location the marker represents
   * @param {number} marker.lat - lat of the location the marker represents
   * @param {string} marker.name - name of the location the marker represents
   * @param {string} marker.address - human readable address of the location the marker represents
   */
  modules.createMarker = async ({ user_id, lng, lat, name, address }) => {
    return db.create_marker.execute(user_id, lng, lat, name, address);
  }

  /**
   * Delete a map marker
   * @param {number} id - the id of the marker to be deleted 
   */
  modules.deleteMarker = async (id) => {
    return db.delete_marker.execute(id);
  }

  return Object.freeze(modules);
}

module.exports = homepage()