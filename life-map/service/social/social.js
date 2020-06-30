const db = require('../../db/db.js')

const social = () => {
  let modules = {};

  modules.createFollowRequest = async (sender, recipient) => {
    return db.create_follow_request.execute(sender, recipient);
  }

  modules.getFollowRequests = async (recipient) => {
    return db.get_follow_requests.execute(recipient);
  }

  return Object.freeze(modules);
}

module.exports = social();