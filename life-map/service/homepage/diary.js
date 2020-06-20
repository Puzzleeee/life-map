const db = require('../../db/db.js')

const diary = () => {
  let modules = {};

  modules.getDiaryEntries = async (id) => {
    return db.get_entries_by_user_id.execute(id);
  }

  /**
   * Create a diary entry
   * @param {Object} entry - the diary entry to be created
   * @param {number} entry.user_id - id of the user the diary entry belongs to
   * @param {number} entry.marker_id - id of the map marker associated with this diary entry
   * @param {string} entry.content - text content of the diary entry
   * @param {number} entry.shared - 1/0 to represent if the diary entry is to be shared with friends
   */
  modules.createDiaryEntry = async ({ user_id, marker_id, title, content, shared }) => {
    return db.create_diary_entry.execute(user_id, marker_id, title, content, shared);
  }

  /**
   * Delete a diary entry
   * @param {number} id - the id of the diary entry to be deleted 
   */
  modules.deleteDiaryEntry = async (id) => {
    return db.delete_diary_entry.execute(id);
  }

  return Object.freeze(modules);
}

module.exports = diary();