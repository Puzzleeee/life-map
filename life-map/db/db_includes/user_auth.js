module.exports = function (crud) {
  return {
    register_user : require('../tables/user_auth/register.js')(crud),
    get_user_by_email: require('../tables/user_auth/get_user_by_email.js')(crud),
    get_user_by_id: require('../tables/user_auth/get_user_by_id')(crud),
    update_name: require('../tables/user_auth/update_name.js')(crud),
  }
}