const db = require('../../db/db.js')

const social = () => {
  let modules = {};

  modules.createFollowRequest = async (sender, recipient) => {
    return db.create_follow_request.execute(sender, recipient);
  }

  return Object.freeze(modules);
}

module.exports = social();