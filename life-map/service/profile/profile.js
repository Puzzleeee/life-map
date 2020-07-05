const db = require('../../db/db.js')
const homepage = require('../homepage/homepage.js');
const social = require('../social/social.js');

const profile = () => {
  let modules = {};

  modules.getUserProfile = async (id) => {
    const [profile, entries, socialInfo] = await Promise.all([
      db.get_user_profile.execute(id), 
      homepage.arrangeUserData(id),
      social.arrangeSocialInfo(id)
    ]);
    return {
      ...profile[0],
      entries: entries,
      ...socialInfo
    }
  }

  modules.updateUserProfile = async (profile_id, id, bio, name) => {
    return Promise.all([
      db.update_bio.execute(profile_id, bio),
      db.update_name.execute(id, name)
    ]);
  }

  return modules;
}

module.exports = profile();