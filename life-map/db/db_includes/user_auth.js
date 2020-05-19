module.exports = function (crud) {
  return {
    register_user : require('../tables/user_auth/register.js')(crud)
  }
}