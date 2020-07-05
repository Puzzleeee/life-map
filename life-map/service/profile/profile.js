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

  return modules;
}

module.exports = profile();