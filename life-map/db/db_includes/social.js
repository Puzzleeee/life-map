module.exports = function (crud) {
  return {
    create_follow_request: require('../tables/social/create_follow_request.js')(crud),
    get_follow_requests: require('../tables/social/get_follow_requests.js')(crud),
  }
}