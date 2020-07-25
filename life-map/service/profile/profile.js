const db = require('../../db/db.js')
const homepage = require('../homepage/homepage.js');
const social = require('../social/social.js');
const AWS = require("../aws-upload/aws.js");
const { v4: uuidv4 } = require('uuid');

const profile = () => {
  let modules = {};

  /**
   * Get a summary of a user's profile: their id, email, name, bio, profile id and profile picture
   * 
   * @param {string} id - id of the user 
   * @return {object} object containing the keys id, email, name, bio, profile_pic and profile_id
   */
  modules.getUserSummary = async (id) => {
    const profile = (await db.get_user_profile.execute(id))[0];
    if (profile.profile_pic) {
      const pic = await AWS.retrieve(profile.profile_pic);
      profile.profile_pic = pic.data;
    }
    return profile;
  }

  modules.getProfilePic = async (id) => {
    const file_name = (await db.get_profile_pic.execute(id))[0].profile_pic;
    if (file_name) {
      const url = (await AWS.retrieve(file_name)).data;
      return url
    } else {
      return null;
    }
  }

  modules.getUserProfile = async (id, requester) => {
    const allowedToView = await social.checkRelationship(requester, id);
    const [profile, entries, socialInfo] = await Promise.all([
      modules.getUserSummary(id),
      allowedToView ? homepage.arrangeUserData(id) : homepage.getDummyData(id),
      social.arrangeSocialInfo(id)
    ]);

    const { followers, following } = socialInfo;
    let updatedSocialInfo;
    // if allowed to view profile, get the profile pictures of followers/following
    if (allowedToView) {
      const [followersWithProfilePic, followingWithProfilePic] = await Promise.all([
        Promise.all(followers.map(async (x) => {
          const profile_pic = await modules.getProfilePic(x.follower);
          return {...x, profile_pic}
        })),
        Promise.all(following.map(async (x) => {
          const profile_pic = await modules.getProfilePic(x.followee);
          return {...x, profile_pic}
        }))
      ]);
      
      updatedSocialInfo = {
        followers: followersWithProfilePic,
        following: followingWithProfilePic
      }
    } else {
      // If not allowed to view profile, convert all the followers/following information into empty objects
      updatedSocialInfo = {
        followers: followers.map(x => ({})),
        following: followers.map(x => ({}))
      }
    }

    return {
      ...profile,
      entries: entries,
      ...updatedSocialInfo
    }
  }

  modules.updateUserProfile = async (profile_id, id, bio, name) => {
    return Promise.all([
      db.update_bio.execute(profile_id, bio),
      db.update_name.execute(id, name)
    ]);
  }

  modules.updateProfilePic = async (profile_id, file) => {
    const file_name = file ? uuidv4() : null;
    let promises = [];
    promises.push(db.update_profile_pic.execute(profile_id, file_name));
    if (file_name) {
      promises.push(AWS.upload(file, file_name));
    }
    return Promise.all(promises);
  }

  return modules;
}

module.exports = profile();