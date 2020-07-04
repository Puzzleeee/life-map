const db = require('../../db/db.js')

const social = () => {
  let modules = {};

  /**
   * Follow requests are created and retrived in the following shape: 
   * {
   *   id (auto generated) - id of the follow request
   *   sender - uuid of the follow request sender
   *   recipient - uuid of the follow request recipient
   *   date_time (auto generated) - date/time request was created
   * }
   */


   /**
    * Create a follow request
    * 
    * @param {string} sender - uuid of follow request sender 
    * @param {string} recipient - uuid of follow request recipient
    */
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

  /**
   * Follower and following data returned in the following shape:
   * {
   *   id (auto generated): id of the relationship
   *   followee: id of the user being followed
   *   follower: id of the user that is following
   *   email: email of the follower/followee if retrieving follower/following respectively
   *   name: username of the follower/followee if retrieving follower/following respecitively
   * }
   * 
   */

  modules.getFollowers = async (id) => {
    return db.get_followers.execute(id);
  }

  modules.getFollowing = async (id) => {
    return db.get_following.execute(id);
  }

  /**
   * Gets the basic social info of user
   * 
   * @param {string} id - UUID of requesting user
   * @return {Object} Object containing the basic social info of the user
   */
  modules.arrangeSocialInfo = async (id) => {
    return {
      followRequests: await modules.getFollowRequests(id),
      followers: await modules.getFollowers(id),
      following: await modules.getFollowing(id),
    };
  }

  return Object.freeze(modules);
}

// const testcases = async () => {
//   const test = social();
//   await test.createFollowRequest(9, 8);
//   await test.createFollowRequest(2, 8);
//   await test.createFollowRequest(8, 10);
//   const requests = await test.getFollowRequests(8);
//   await test.acceptFollowRequest(requests[0]);
//   const requests2 = await test.getFollowRequests(10);
//   await test.acceptFollowRequest(requests2[0]);
//   const socialInfo = await test.arrangeSocialInfo(8);
//   console.log("SOCIAL INFO:", socialInfo);
// }

// testcases();

module.exports = social();