const db = require('../../db/db.js')
const homepage = require('../homepage/homepage.js');
const social = require('../social/social.js');

const profile = () => {
  let modules = {};

  modules.getUserProfile = async (id) => {
    const results = {
      profile : await db.get_user_profile.execute(id),
      entries : await homepage.arrangeUserData(id),
      social_info : await social.arrangeSocialInfo(id),
    }

    return { ...results.profile[0], entries: results.entries, ...results.social_info }
  }

  return modules;
}

module.exports = profile();