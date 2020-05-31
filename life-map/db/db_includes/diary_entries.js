module.exports = function (crud) {
  return {
    get_entries_by_user_id : require('../tables/diary_entries/get_entries_by_user_id.js')(crud),
    create_diary_entry : require('../tables/diary_entries/create_diary_entry.js')(crud)
  }
}