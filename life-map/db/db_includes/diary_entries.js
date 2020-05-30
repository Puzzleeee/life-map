module.exports = function (crud) {
  return {
    get_entries_by_user_id : require('../tables/diary_entries/get_entries_by_user_id.js')(crud),
  }
}