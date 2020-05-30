const db = require('../../db/db.js')

const homepage = () => {
  let modules = {};

  modules.getMarkers = async (id) => {
    return db.get_markers_by_user_id.execute(id)
  }

  return modules;
}

module.exports = homepage()