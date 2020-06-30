const db = require('../../db/db.js')

const social = () => {
  let modules = {};

  modules.createFollowRequest = async (sender, recipient) => {
    return db.create_follow_request.execute(sender, recipient);
  }

  modules.getFollowRequests = async (recipient) => {
    return db.get_follow_requests.execute(recipient);
  }

  /**
   * Accept a follow request
   * 
   * Deletes the request from follow_requests table and creates a new
   * row in followers table representing the new follower relationship.
   * 
   * @param {Object} follow_request - The request to be accepted
   * @param {string} follow_request.id - ID of the request
   * @param {string} follow_request.sender - ID of the sender
   * @param {string} follow_request.recipient - ID of the recipient 
   */
  modules.acceptFollowRequest = async ({id, sender, recipient}) => {
    return db.delete_follow_request.execute(id)
      .then(() => {
        db.create_follower_relationship.execute(recipient, sender);
      });
  }

  modules.declineFollowRequest = async ({id}) => {
    return db.delete_follow_request.execute(id);
  }

  modules.getFollowers = async (id) => {
    return db.get_followers.execute(id);
  }

  return Object.freeze(modules);
}

// const testcases = async () => {
//   const test = social();
//   await test.createFollowRequest(9, 8);
//   const requests = await test.getFollowRequests(8);
//   console.log("REQUESTS", requests);
//   await test.declineFollowRequest(requests[0]);
//   const followers = await test.getFollowers(8);
//   console.log("FOLLOWERS", followers);
// }

// testcases();

module.exports = social();