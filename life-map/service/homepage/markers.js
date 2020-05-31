const db = require('../../db/db.js')

const homepage = () => {
  let modules = {};

  modules.getMarkers = async (id) => {
    return db.get_markers_by_user_id.execute(id);
  }

  modules.createMarker = async ({ user_id, lng, lat, name, address }) => {
    return db.create_marker.execute(user_id, lng, lat, name, address);
  }

  return Objects.freeze(modules);
}

module.exports = homepage()